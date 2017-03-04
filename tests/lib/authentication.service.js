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
import { Http, Headers } from '@angular/http';
import { BehaviorSubject } from 'rxjs/Rx';
import { ConfigurationService } from './configuration.service';
var AuthenticationService = (function () {
    function AuthenticationService(config, http) {
        this.config = config;
        this.http = http;
        this.isAuthenticated = new BehaviorSubject(false);
        var token = localStorage.getItem('auth');
        if (token) {
            this.isAuthenticated.next(true);
        }
    }
    AuthenticationService.prototype.getUserInfo = function () {
        var token = localStorage.getItem('auth');
        if (token) {
            var tokenParts = token.split('.');
            return JSON.parse(atob(tokenParts[1]));
        }
        else {
            return null;
        }
    };
    AuthenticationService.prototype.login = function (login, password) {
        var _this = this;
        var headers = this.getHeaders();
        var body = JSON.stringify({
            login: login,
            password: password
        });
        this.http.post(this.config.get('BACKEND_URL') + '/@login', body, { headers: headers })
            .subscribe(function (res) {
            var data = res.json();
            if (data.token) {
                localStorage.setItem('auth', data.token);
                _this.isAuthenticated.next(true);
            }
            else {
                localStorage.removeItem('auth');
                _this.isAuthenticated.next(false);
            }
        });
    };
    AuthenticationService.prototype.logout = function () {
        localStorage.removeItem('auth');
        this.isAuthenticated.next(false);
    };
    AuthenticationService.prototype.getHeaders = function () {
        var headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        var auth = localStorage.getItem('auth');
        if (auth) {
            headers.append('Authorization', 'Bearer ' + auth);
        }
        return headers;
    };
    return AuthenticationService;
}());
AuthenticationService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ConfigurationService,
        Http])
], AuthenticationService);
export { AuthenticationService };
