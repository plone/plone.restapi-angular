var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { TraversalModule, Resolver, Marker, TraverserOutlet, TraverserLink } from 'angular-traversal';
import { AuthenticationService } from './authentication.service';
import { ConfigurationService } from './configuration.service';
import { ResourceService } from './resource.service';
import { InterfaceMarker, PloneTraverser, RESTAPIResolver, } from './traversal';
import { ViewView } from './views/view';
import { Navigation } from './components/navigation';
var RESTAPIModule = (function () {
    function RESTAPIModule() {
    }
    return RESTAPIModule;
}());
RESTAPIModule = __decorate([
    NgModule({
        declarations: [
            ViewView,
            Navigation,
        ],
        entryComponents: [
            ViewView,
        ],
        imports: [
            HttpModule,
            CommonModule,
            TraversalModule,
        ],
        providers: [
            AuthenticationService,
            ConfigurationService,
            ResourceService,
            PloneTraverser,
            { provide: Resolver, useClass: RESTAPIResolver },
            { provide: Marker, useClass: InterfaceMarker },
        ],
        exports: [
            ViewView,
            Navigation,
            TraverserOutlet,
            TraverserLink,
        ]
    })
], RESTAPIModule);
export { RESTAPIModule };
