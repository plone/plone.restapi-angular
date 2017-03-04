import { OnInit } from '@angular/core';
import { Traverser } from 'angular-traversal';
import { ConfigurationService } from '../configuration.service';
export declare class Navigation implements OnInit {
    private config;
    private traverser;
    private links;
    private parent;
    constructor(config: ConfigurationService, traverser: Traverser);
    ngOnInit(): void;
}
