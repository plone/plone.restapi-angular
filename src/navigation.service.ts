import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { ResourceService } from './resource.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class NavigationService {

  private cache: any = {};

  constructor(
    private resource: ResourceService,
    private config: ConfigurationService,
  ) { }

  getNavigationFor(currentPath: string, root: string | number, depth: number): Observable<any> {
    const rootPath = this.getRoot(currentPath, root);
    const cacheKey = rootPath + ' > ' + depth.toString();
    if (this.cache[cacheKey]) {
      let tree = this.cache[cacheKey]
      if (currentPath) {
        tree = this.markActive(currentPath, tree);
      }
      return Observable.of(tree);
    } else {
      return this.resource.find(
        {
          is_default_page: false,
          path: {depth: depth}
        },
        rootPath,
        'getObjPositionInParent',
        ['exclude_from_nav', 'getObjPositionInParent'],
        undefined,
        1000
      ).map(res => {
        let tree = { children: {} };
        res.json().items.map(item => {
          if (item.exclude_from_nav) {
            return;
          }
          let localpath = this.config.urlToPath(item['@id']);
          let path = localpath.slice(
            localpath.indexOf(rootPath) + rootPath.length).split('/');
          if (path[0] === '') {
            path.shift();
            if (!path.length) {
              return;
            }
          }
          let id = path.pop() || '';
          let current = tree;
          path.map(folder => {
            if (!current.children[folder]) {
              current.children[folder] = {children: {}};
            }
            current = current.children[folder];
          });
          if (!current.children[id]) {
            current.children[id] = {};
          }
          current.children[id].properties = item;
        });
        this.cache[cacheKey] = tree;
        tree.children = this.getChildrenArray(tree.children);
        if (currentPath) {
          return this.markActive(currentPath, tree);
        } else {
          return tree;
        }
      });
    }
  }

  private getChildrenArray(children: any): any[] {
    return Object.keys(children).map(key => {
      let child = children[key];
      if (child.children) {
        child.children = this.getChildrenArray(child.children);
      }
      return child;
    }).sort((a, b) => {
      return (a.properties ? a.properties.getObjPositionInParent : 0) - (b.properties ? b.properties.getObjPositionInParent : 0);
    });
  }

  private markActive(currentPath: string, tree: any) {
    if (tree.children) {
      tree.children = tree.children.map(item => {
        item.active = (item.properties['@id'] === currentPath);
        item.in_path = (currentPath.startsWith(item.properties['@id']));
        return this.markActive(currentPath, item);
      });
    }
    return tree;
  }

  private getRoot(currentPath: string, root: string | number): string {
    currentPath = this.config.urlToPath(currentPath || '/');
    let rootPath = (typeof root === 'string') ? root : '/';
    if (typeof root === 'number') {
      if (root < 0) {
        let path = currentPath.split('/');
        if (root < path.length) {
          rootPath = path.slice(0, path.length + root).join('/');
        }
      }
    }
    return rootPath;
  }
}