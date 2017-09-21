import {
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { NgForm } from '@angular/forms';

import { Services } from '../services';
import { TraversingComponent } from '../traversing';

@Component({
  selector: 'plone-comment',
  template: `<p>
      <span class="comment-author">{{ comment.author_name }}</span>
      <span class="comment-date">{{ comment.creation_date | date }}</span>
    </p>
    <div class="comment-body" [innerHTML]="formatText(comment.text)"></div>`
})
export class Comment {

  @Input() comment: any;

  formatText(text) {
    if (text['mime-type'] == 'text/plain') {
      return text.data.replace(/\n/g, '<br>');
    } else {
      return text.data;
    }
  }
}

@Component({
  selector: 'plone-comment-add',
  template: `<form #f="ngForm" (submit)="add(f)">
    <div *ngIf="error">{{ error }}</div>
    <div>
      <label>E-mail <input type="email" name="author_email" ngModel /></label>
    </div>
    <div>
      <label>Comment <textarea name="text" ngModel></textarea></label>
    </div>
    <input type="submit" value="Comment" />
  </form>`
})
export class CommentAdd {

  @Input() path: string;
  @Output() onCreate: EventEmitter<boolean> = new EventEmitter<boolean>();
  error: string;

  constructor(
    private services: Services,
  ) { }

  add(form: NgForm) {
    this.services.comments.add(this.path, form.value).subscribe(res => {
      this.onCreate.next(true);
      form.resetForm();
    }, (err: Error) => {
      this.error = err.message;
    });
  }
}

@Component({
  selector: 'plone-comments',
  template: `<div class="comments">
    <plone-comment-add [path]="contextPath"
      (onCreate)="loadComments()"></plone-comment-add>
    <div class="comment" *ngFor="let comment of comments">
      <plone-comment [comment]="comment"></plone-comment>
    </div>
  </div>`
})
export class Comments extends TraversingComponent {

  comments: any[] = [];
  contextPath: string;

  constructor(
    public services: Services,
  ) {
    super(services);
  }

  onTraverse(target) {
    if (target.contextPath) {
      this.contextPath = target.contextPath;
      this.loadComments();
    }
  }

  loadComments() {
    this.services.comments.get(this.contextPath).subscribe(res => {
      this.comments = res.items;
    });
  }
}
