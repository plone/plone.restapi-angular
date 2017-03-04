import { Component, OnInit } from '@angular/core';
import { Navigation } from '../../../lib';
import { Traverser } from 'angular-traversal';

@Component({
  selector: 'custom-navigation',
  templateUrl: './navigation.html'
})
export class CustomNavigation extends Navigation implements OnInit {}
