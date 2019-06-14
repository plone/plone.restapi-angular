import { EventEmitter, Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import {
    NamedFileUpload,
    NavLink,
    SearchOptions,
    SearchResults,
    WorkflowHistoryItem,
    WorkflowInformation,
    WorkflowTransitionOptions,
} from '../interfaces';
import { Vocabulary } from '../vocabularies';
import { APIService } from './api.service';
import { CacheService } from './cache.service';
import { ConfigurationService } from './configuration.service';
import { ReplaySubject } from 'rxjs';
import {map} from 'rxjs/operators';

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
    resourceModified: EventEmitter<{
        id: string;
        context: any;
    } | null> = new EventEmitter();
    traversingUnauthorized: EventEmitter<string> = new EventEmitter();

    copySource: ReplaySubject<string> = new ReplaySubject<string>(1);

    public static getSearchQueryString(
        query: { [key: string]: any },
        options: SearchOptions = {},
    ): string {
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
                params.push(
                    index + '=' + encodeURIComponent(criteria.toISOString()),
                );
            } else {
                Object.keys(criteria).map(key => {
                    params.push(
                        `${index}.${key}=${encodeURIComponent(criteria[key])}`,
                    );
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
                    filename: file.name,
                    data: fileData,
                    encoding: 'base64',
                    'content-type': file.type,
                });
                observer.complete();
            };
        }
    }

    constructor(
        protected api: APIService,
        protected cache: CacheService,
        protected configuration: ConfigurationService,
    ) {
        this.resourceModified.subscribe(() => {
            cache.revoke.emit();
        });
    }

    /**
     * Copy a resource (Plone REST API)
     * @param sourcePath
     * @param targetPath
     */
    copy(sourcePath: string, targetPath: string) {
        return this.emittingModified(
            this.api.post(targetPath + '/@copy', {
                source: this.api.getFullPath(sourcePath),
            }),
            targetPath,
        );
    }

    /**
     * Copy a resource (same as copy, but in Guillotina)
     * @param sourcePath
     * @param targetPath
     */
    duplicate(sourcePath: string, targetPath: string): Observable<any> {
        const url = sourcePath + '/@duplicate';
        const containerInPath: string = this.getContainerInPath(targetPath);
        const newId: string = sourcePath.split('/').pop() || '';
        return this.emittingModified(
            this.api.post(url, {
                destination: containerInPath,
                new_id: newId,
            }),
            targetPath,
        );
    }

    private getContainerInPath(targetPath: string): string {
        if (targetPath.indexOf('http') === 0) {
            const startPosition: number = targetPath.indexOf('https') === 0 ? 8 : 7;
            const startIndex: number = targetPath.indexOf('/', startPosition);
            targetPath = targetPath.substring(startIndex);
        }

        return '/' + targetPath.split('/').slice(3).join('/');
    }

    create(path: string, model: any) {
        return this.emittingModified(this.api.post(path, model), path);
    }

    delete(path: string) {
        return this.emittingModified(this.api.delete(path), path);
    }

    find(
        query: { [key: string]: any },
        path: string = '/',
        options: SearchOptions = {},
    ): Observable<SearchResults> {
        if (!path.endsWith('/')) {
            path += '/';
        }

        const queryString = ResourceService.getSearchQueryString(
            query,
            options,
        );
        return this.cache.get(path + '@search' + '?' + queryString);
    }

    get(path: string, expand?: string[]): Observable<any> {
        expand = Object.keys(this.defaultExpand).concat(expand || []);
        if (expand.length > 0) {
            path = path + '?expand=' + expand.join(',');
        }
        return this.cache.get(path);
    }

    items(path: string, page = 1): Observable<any> {
        return this.cache.get(`${path}/@items?page=${page}`);
    }

    move(sourcePath: string, targetPath: string) {
        const path = targetPath + '/@move';
        return this.emittingModified(
            this.api.post(path, { source: this.api.getFullPath(sourcePath) }),
            path,
        );
    }

    transition<S extends string = string, T extends string = string>(
        contextPath: string,
        transition: T,
        options: WorkflowTransitionOptions = {},
    ): Observable<WorkflowHistoryItem<S, T>> {
        return this.emittingModified(
            this.api.post(contextPath + '/@workflow/' + transition, options),
            contextPath,
        );
    }

    workflow<S extends string = string, T extends string = string>(
        contextPath: string,
    ): Observable<WorkflowInformation<S, T>> {
        return this.cache.get(contextPath + '/@workflow');
    }

    update(path: string, model: any): Observable<any> {
        return this.emittingModified(this.api.patch(path, model), path);
    }

    save(path: string, model: any): Observable<any> {
        return this.emittingModified(this.api.put(path, model), path);
    }

    navigation(): Observable<NavLink[]> {
        return this.cache.get('/@navigation').pipe(
            map((data: NavigationItems) => {
                if (data) {
                    return data.items
                        .filter((item: NavigationItem) => {
                            return (
                                !item.properties ||
                                !item.properties.exclude_from_nav
                            );
                        })
                        .map(this.linkFromItem.bind(this));
                } else {
                    return [];
                }
            })
        );
    }

    breadcrumbs(path: string): Observable<NavLink[]> {
        return this.cache.get(path + '/@breadcrumbs')
            .pipe(map((data: NavigationItems) => {
                if (data) {
                    return data.items.map(this.linkFromItem.bind(this));
                } else {
                    return [];
                }
            }));
    }

    type(typeId: string, containerPath = ''): Observable<any> {
        return this.cache.get(`${containerPath}/@types/${typeId}`);
    }

    vocabulary(vocabularyId: string): Observable<Vocabulary<string | number>> {
        return this.cache
            .get('/@vocabularies/' + vocabularyId)
            .pipe(map(
                (jsonObject: any): Vocabulary<string | number> =>
                    new Vocabulary(jsonObject.terms),
            ));
    }

    getAddons(path: string): Observable<string[]> {
        return this.cache.get<any>(path + '/@addons').pipe(map(res => res['installed']));
    }

    availableAddons(path: string): Observable<{id: string, title: string}[]> {
        return this.cache.get<any>(path + '/@addons').pipe(map(res => res['available']));
    }

    addAddon(path: string, addon: string): Observable<any> {
        return this.emittingModified(this.api.post(path + '/@addons', {id: addon}), path);
    }

    deleteAddon(path: string, addon: string): Observable<any> {
        return this.emittingModified(this.api.delete(path + '/@addons/' + addon), path);
    }

    getBehaviors(path: string): Observable<string[]> {
        return this.cache.get<any>(path + '/@behaviors').pipe(map(res => res['static'].concat(res['dynamic'])));
    }

    availableBehaviors(path: string): Observable<string[]> {
        return this.cache.get<any>(path + '/@behaviors').pipe(map(res => res['available']));
    }

    addBehavior(path: string, behavior: string): Observable<any> {
        return this.emittingModified(this.api.patch(path + '/@behaviors', {behavior: behavior}), path);
    }

    deleteBehavior(path: string, behavior: string): Observable<any> {
        return this.emittingModified(this.api.delete(path + '/@behaviors/' + behavior), path);
    }

    addableTypes(path: string): Observable<string[]> {
        return this.api.get(path + '/@addable-types');
    }

    sharing(path: string): Observable<string[]> {
        return this.api.get(path + '/@sharing');
    }

    updateSharing(path: string, sharing: any): Observable<string[]> {
        return this.emittingModified(this.api.post(path + '/@sharing', sharing), path);
    }

    registry(path: string): Observable<any> {
        return this.api.get(path + '/@registry');
    }

    declareRegistry(path: string, key: string): Observable<any> {
        return this.api.post(path + '/@registry', {interface: key});
    }

    getRegistryEntry(path: string, key: string): Observable<any> {
        return this.api.get(path + '/@registry/' + key);
    }

    setRegistryEntry(path: string, key: string, value: any): Observable<any> {
        return this.api.patch(path + '/@registry/' + key, {value: value});
    }

    /*
   Make the observable emit resourceModified event when it emits
   */
    public emittingModified<T>(
        observable: Observable<T>,
        path: string,
    ): Observable<T> {
        const service = this;
        return observable.pipe(map(
            (val: T): T => {
                service.resourceModified.emit({ id: path, context: val });
                return val;
            },
        ));
    }

    private linkFromItem(item: NavigationItem): NavLink {
        return {
            active: false,
            url: item['@id'],
            path: this.configuration.urlToPath(item['@id']),
            ...item,
        };
    }
}
