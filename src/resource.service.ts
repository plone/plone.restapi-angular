import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {APIService} from './api.service';
import {ConfigurationService} from './configuration.service';
import {NavLink} from './interfaces';


interface NavigationItem {
  title: string;
  url: string
  properties?: any;
}

interface NavigationItems {
  '@id': string;
  items: NavigationItem[];
}


@Injectable()
export class ResourceService {

  public defaultExpand: any = {};

  constructor(
    private api: APIService,
    private configuration: ConfigurationService) {
  }

  copy(sourcePath: string, targetPath: string) {
    return this.api.post(
      targetPath + '/@copy',
      { source: this.api.getFullPath(sourcePath) }
    );
  }

  create(path: string, model: any) {
    return this.api.post(path, model);
  }

  delete(path: string) {
    return this.api.delete(path);
  }

  find(
    query: any,
    path: string = '/',
    options: any = {},
  ) {
    if (!path.endsWith('/')) path += '/';
    let params: string[] = [];
    Object.keys(query).map(index => {
      let criteria = query[index];
      if (typeof criteria === 'boolean') {
        params.push(index + '=' + (criteria ? '1' : '0'));
      } else if (typeof criteria === 'string') {
        params.push(index + '=' + encodeURIComponent(criteria));
      } else if (Array.isArray(criteria)) {
        criteria.map(value => {
          params.push(index + '=' + encodeURIComponent(value));
        });
      } else {
        Object.keys(criteria).map(key => {
          params.push(index + '.' + key + '=' + encodeURIComponent(criteria[key]));
        });
      }
    });
    if (options.sort_on) {
      params.push('sort_on=' + options.sort_on);
    }
    if (options.sort_order) {
      params.push('sort_order=' + options.sort_order);
    }
    if (options.metadata_fields) {
      options.metadata_fields.map((field: any) => {
        params.push('metadata_fields:list=' + field);
      });
    }
    if (options.start) {
      params.push('b_start=' + options.start.toString());
    }
    if (options.size) {
      params.push('b_size=' + options.size.toString());
    }
    if (options.fullobjects) {
      params.push('fullobjects');
    }
    return this.api.get(
      path + '@search' + '?' + params.join('&')
    );
  }

  get(path: string, expand?: string[]) {
    expand = Object.keys(this.defaultExpand).concat(expand || []);
    if (expand.length > 0) {
      path = path + '?expand=' + expand.join(',');
    }
    return this.api.get(path);
  }

  move(sourcePath: string, targetPath: string) {
    return this.api.post(
      targetPath + '/@move',
      { source: this.api.getFullPath(sourcePath) }
    );
  }

  transition(path: string, transition: string) {
    return this.api.post(path + '/@workflow/' + transition, {});
  }

  update(path: string, model: any) {
    return this.api.patch(path, model);
  }

  navigation(): Observable<NavLink[]> {
    return this.api.get('/@components/navigation')
      .map((data: NavigationItems[]) => {
        if (data && data[0]) {
          return data[0].items.filter(item => {
            return !item.properties || !item.properties.exclude_from_nav;
          }).map(this.linkFromItem.bind(this))
        } else {
          return [];
        }
      });
  }

  breadcrumbs(path: string): Observable<NavLink[]> {
    return this.api.get(path + '/@components/breadcrumbs')
      .map((data: NavigationItems[]) => {
        if (data && data[0]) {
          return data[0].items.map(this.linkFromItem.bind(this))
        } else {
          return []
        }
      });
  }

  type(typeId: string): Observable<any> {
    return this.api.get('/@types/' + typeId);
  }

  private linkFromItem(item: NavigationItem): NavLink {
    return <NavLink>Object.assign({
      active: false,
      path: this.configuration.urlToPath(item.url)
    }, item)
  }
}
