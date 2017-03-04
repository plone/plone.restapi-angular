import { Component, OnInit } from '@angular/core';
import { ViewView } from '../../../lib';
import { Traverser } from 'angular-traversal';

@Component({
  selector: 'custom-view',
  templateUrl: './view.html'
})
export class CustomViewView extends ViewView implements OnInit {}
