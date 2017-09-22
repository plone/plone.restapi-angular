import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import {ResourceService} from './resource.service';
import {ConfigurationService} from './configuration.service';
import {NavTree} from './interfaces';

interface UnorderedContentTree {
  children: { [key: string]: UnorderedContentTree };
  properties?: any;
}

@Injectable()
export class NavigationService {

  private cache: {[key: string]: NavTree} = {};

  constructor(private resource: ResourceService,
              private config: ConfigurationService) {
  }

  getNavigationFor(currentPath: string, root: string | number, depth: number): Observable<NavTree> {
    const rootPath = this.getRoot(currentPath, root);
    const cacheKey = rootPath + ' > ' + depth.toString();
    if (this.cache[cacheKey]) {
      let tree = this.cache[cacheKey];
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
        {
          metadata_fields: ['exclude_from_nav', 'getObjPositionInParent'],
          size: 1000
        }
      ).map(res => {
        const tree: UnorderedContentTree = {children: {}};
        res.items
          .sort((item: any) => item.getObjPositionInParent)
          .map((item: any) => {
            const localpath: string = this.config.urlToPath(item['@id']);
            const path: string[] = localpath.slice(
              localpath.indexOf(rootPath) + rootPath.length).split('/');
            if (path[0] === '') {
              path.shift();
              if (!path.length) {
                return;
              }
            }
            const id = path.pop() || '';
            let current: UnorderedContentTree = tree;
            path.map((folder: string) => {
              if (!current.children[folder]) {
                current.children[folder] = {children: {}};
              }
              current = current.children[folder];
              if (!current.children) {
                current.children = {};
              }
            });
            if (!current.children[id]) {
              current.children[id] = {
                children: {},
                properties: null
              };
            }
            current.children[id].properties = item;
          });
        const orderedTree = {children: this.getOrderedChildren(tree.children), properties: tree.properties};
        this.cache[cacheKey] = orderedTree;
        if (currentPath) {
          return this.markActive(currentPath, orderedTree);
        } else {
          return orderedTree;
        }
      });
    }
  }

  private getOrderedChildren(children: { [key: string]: UnorderedContentTree }): NavTree[] {
    return Object.keys(children).map(key => {
      const child: UnorderedContentTree = children[key];
      const orderedChild: NavTree[] = child.children ? this.getOrderedChildren(child.children) : [];
      return <NavTree>Object.assign({}, child, {children: orderedChild});
    }).filter(item => item.properties).sort((a, b) => {
      return a.properties.getObjPositionInParent - b.properties.getObjPositionInParent;
    });
  }

  private markActive(currentPath: string, tree: NavTree): NavTree {
    if (tree.children) {
      tree.children = tree.children.map(item => {
        item.active = (item.properties['@id'] === currentPath);
        item.inPath = (currentPath.startsWith(item.properties['@id']));
        return this.markActive(currentPath, item);
      });
    }
    return tree;
  }

  private getRoot(currentPath: string, root: string | number): string {
    currentPath = this.config.urlToPath(currentPath || '/');
    let rootPath = (typeof root === 'string') ? root : '/';
    if (typeof root === 'number') {
      if (root <= 0) {
        let path = currentPath.split('/');
        if (root < path.length) {
          rootPath = path.slice(0, path.length + root).join('/');
        }
      }
    }
    return rootPath;
  }
}
