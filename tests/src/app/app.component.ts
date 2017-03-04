import { Component } from '@angular/core';
import { PloneTraverser } from '../../lib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';

  constructor(private traverser:PloneTraverser) {
    this.traverser.initialize();
  }
}
