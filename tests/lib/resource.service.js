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
import { Http } from '@angular/http';
import { AuthenticationService } from './authentication.service';
import { ConfigurationService } from './configuration.service';
var ResourceService = (function () {
    function ResourceService(authentication, config, http) {
        this.authentication = authentication;
        this.config = config;
        this.http = http;
    }
    ResourceService.prototype.copy = function (sourcePath, targetPath) { };
    ResourceService.prototype.create = function (path, model) { };
    ResourceService.prototype.delete = function (path) { };
    ResourceService.prototype.find = function (query) { };
    ResourceService.prototype.get = function (path, frames) {
        var url = this.config.get('BACKEND_URL') + path;
        var headers = this.authentication.getHeaders();
        return this.http.get(url, { headers: headers });
    };
    ResourceService.prototype.move = function (sourcePath, targetPath) { };
    ResourceService.prototype.transition = function (path, transition) { };
    ResourceService.prototype.update = function (path, model) { };
    return ResourceService;
}());
ResourceService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [AuthenticationService,
        ConfigurationService,
        Http])
], ResourceService);
export { ResourceService };
