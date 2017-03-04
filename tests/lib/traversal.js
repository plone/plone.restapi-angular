var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Marker, Resolver, Traverser } from 'angular-traversal';
import { ResourceService } from './resource.service';
import { ViewView } from './views/view';
var InterfaceMarker = (function (_super) {
    __extends(InterfaceMarker, _super);
    function InterfaceMarker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InterfaceMarker.prototype.mark = function (context) {
        return context.interfaces;
    };
    return InterfaceMarker;
}(Marker));
InterfaceMarker = __decorate([
    Injectable()
], InterfaceMarker);
export { InterfaceMarker };
var RESTAPIResolver = (function (_super) {
    __extends(RESTAPIResolver, _super);
    function RESTAPIResolver(resource) {
        var _this = _super.call(this) || this;
        _this.resource = resource;
        return _this;
    }
    RESTAPIResolver.prototype.resolve = function (path) {
        return this.resource.get(path).map(function (res) { return res.json(); });
    };
    return RESTAPIResolver;
}(Resolver));
RESTAPIResolver = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ResourceService])
], RESTAPIResolver);
export { RESTAPIResolver };
var PloneTraverser = (function () {
    function PloneTraverser(traverser) {
        this.traverser = traverser;
    }
    PloneTraverser.prototype.initialize = function () {
        this.traverser.addView('view', '*', ViewView);
    };
    return PloneTraverser;
}());
PloneTraverser = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Traverser])
], PloneTraverser);
export { PloneTraverser };
