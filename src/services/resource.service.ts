import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import {
  NamedFileUpload,
  NavLink,
  SearchOptions,
  SearchResults,
  WorkflowHistoryItem,
  WorkflowInformation,
  WorkflowTransitionOptions
} from '../interfaces';
import { Vocabulary } from '../vocabularies';
import { APIService } from './api.service';
import { CacheService } from './cache.service';
import { ConfigurationService } from './configuration.service';


interface NavigationItem {
  title: string;
  '@id': string;
  properties?: any;
}

interface NavigationItems {
  '@id': string;
  items: NavigationItem[];
}


@Injectable()
export class ResourceService {

  defaultExpand: any = {};
  public resourceModified: EventEmitter<{ id: string, context: any } | null> = new EventEmitter();

  public static getSearchQueryString(query: { [key: string]: any }, options: SearchOptions = {}): string {
    const params: string[] = [];
    Object.keys(query).map(index => {
      const criteria = query[index];
      if (typeof criteria === 'boolean') {
        params.push(index + '=' + (criteria ? '1' : '0'));
      } else if (typeof criteria === 'string') {
        params.push(index + '=' + encodeURIComponent(criteria));
      } else if (Array.isArray(criteria)) {
        criteria.map(value => {
          params.push(index + '=' + encodeURIComponent(value));
        });
      } else if (criteria instanceof Date) {
        params.push(index + '=' + encodeURIComponent(criteria.toISOString()));
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
    return params.join('&');
  }

  public static lightFileRead(file: File): Observable<NamedFileUpload> {
    return Observable.create(observeFileRead);

    function observeFileRead(observer: Subscriber<NamedFileUpload>) {
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onloadend = (e: any) => {
        const fileData = btoa(e.target.result);
        observer.next({
          filename: file.name, data: fileData,
          encoding: 'base64',
          'content-type': file.type,
        });
        observer.complete();
      };
    }
  }

  constructor(protected api: APIService,
              protected cache: CacheService,
              protected configuration: ConfigurationService) {
    this.resourceModified.subscribe(() => {
      cache.revoke.emit();
    });
  }

  copy(sourcePath: string, targetPath: string) {
    const path = targetPath + '/@copy';
    return this.emittingModified(
      this.api.post(
        targetPath + '/@copy',
        { source: this.api.getFullPath(sourcePath) }
      ), path
    );
  }

  create(path: string, model: any) {
    return this.emittingModified(
      this.api.post(path, model), path
    );
  }

  delete(path: string) {
    return this.emittingModified(
      this.api.delete(path), path
    );
  }

  find(query: { [key: string]: any },
       path: string = '/',
       options: SearchOptions = {}): Observable<SearchResults> {
    if (!path.endsWith('/')) {
      path += '/';
    }

    const queryString = ResourceService.getSearchQueryString(query, options);
    return this.cache.get(path + '@search' + '?' + queryString);
  }

  get(path: string, expand?: string[]) {
    expand = Object.keys(this.defaultExpand).concat(expand || []);
    if (expand.length > 0) {
      path = path + '?expand=' + expand.join(',');
    }
    return this.cache.get(path);
  }

  move(sourcePath: string, targetPath: string) {
    const path = targetPath + '/@move';
    return this.emittingModified(
      this.api.post(path, { source: this.api.getFullPath(sourcePath) }),
      path
    );
  }

  transition<S extends string = string, T extends string = string>(
    contextPath: string, transition: T, options: WorkflowTransitionOptions = {}): Observable<WorkflowHistoryItem<S, T>> {
    return this.emittingModified(
      this.api.post(contextPath + '/@workflow/' + transition, options), contextPath
    );
  }

  workflow<S extends string = string, T extends string = string>(contextPath: string): Observable<WorkflowInformation<S, T>> {
    return this.cache.get(contextPath + '/@workflow');
  }

  update(path: string, model: any): Observable<any> {
    return this.emittingModified(
      this.api.patch(path, model), path
    );
  }

  navigation(): Observable<NavLink[]> {
    return this.cache.get('/@navigation')
      .map((data: NavigationItems) => {
        if (data) {
          return data.items
            .filter((item: NavigationItem) => {
              return !item.properties || !item.properties.exclude_from_nav;
            })
            .map(this.linkFromItem.bind(this));
        } else {
          return [];
        }
      });
  }

  breadcrumbs(path: string): Observable<NavLink[]> {
    return this.cache.get(path + '/@breadcrumbs')
      .map((data: NavigationItems) => {
        if (data) {
          return data.items.map(this.linkFromItem.bind(this));
        } else {
          return [];
        }
      });
  }

  type(typeId: string): Observable<any> {
    return this.cache.get('/@types/' + typeId);
  }

  vocabulary(vocabularyId: string): Observable<Vocabulary<string | number>> {
    return this.cache.get('/@vocabularies/' + vocabularyId)
      .map((jsonObject: any): Vocabulary<string | number> => new Vocabulary(jsonObject.terms));
  }

  /*
   Make the observable emit resourceModified event when it emits
   */
  public emittingModified<T>(observable: Observable<T>, path: string): Observable<T> {
    const service = this;
    return observable.map((val: T): T => {
      service.resourceModified.emit({ id: path, context: val });
      return val;
    });
  }

  private linkFromItem(item: NavigationItem): NavLink {
    return {
      active: false,
      url: item['@id'],
      path: this.configuration.urlToPath(item['@id']),
      ...item
    };
  }
}
