import { OnInit } from '@angular/core';
import { Traverser } from 'angular-traversal';
export declare class ViewView implements OnInit {
    private traverser;
    private context;
    constructor(traverser: Traverser);
    ngOnInit(): void;
}
