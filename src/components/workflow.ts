import {
  Component, EventEmitter, Input, Output
} from '@angular/core';
import { Services } from '../services';
import { TraversingComponent } from '../traversing';
import { Target } from 'angular-traversal';
import { Error, WorkflowHistoryItem, WorkflowInformation, WorkflowTransitionItem } from '../interfaces';

@Component({
  selector: 'plone-workflow',
  template: `
    <div class="workflow" *ngIf="!!workflowInformation">
      <div class="workflow-history" *ngIf="showHistory">
        <ul>
          <li *ngFor="let item of workflowInformation?.history">
            <strong>{{ item.title }}</strong>
            by <strong>{{ item.actor }}</strong> &ndash;
            <em>{{ displayTime(item.time) }}</em>
            <em *ngIf="item.comments"> &ndash; {{ item.comments }}</em>
          </li>
        </ul>
      </div>
      <div class="workflow-actions">
        <div class="workflow-comment" *ngIf="haveCommentInput && workflowInformation?.transitions.length">
        <textarea
          placeholder="Your action comment"
          name="workflowComment"
          [(ngModel)]="commentText"></textarea>
        </div>
        <ul>
          <li class="workflow-current-state">State: <strong>{{ currentState() }}</strong></li>
          <li *ngFor="let transitionItem of workflowInformation?.transitions">
            <a href="#" (click)="processTransition($event, transitionItem)">{{ transitionItem.title }}</a>
          </li>
        </ul>
      </div>
    </div>`
})
export class Workflow extends TraversingComponent {

  @Input() showHistory = true;
  @Input() haveCommentInput = true;

  contextPath: string;
  commentText = '';
  public workflowInformation: WorkflowInformation | null;

  @Output() workflowStateChanged: EventEmitter<WorkflowHistoryItem> = new EventEmitter();

  constructor(public services: Services) {
    super(services);
  }

  onTraverse(target: Target) {
    if (target.contextPath) {
      this.contextPath = target.contextPath;
      this.loadWorkflowInformation();
    }
  }

  protected loadWorkflowInformation() {
    const component = this;
    this.services.resource.workflow(component.contextPath)
      .subscribe((workflowInformation: WorkflowInformation) => {
        component.workflowInformation = workflowInformation;
      });
  }

  processTransition(event: Event, item: WorkflowTransitionItem) {
    event.preventDefault();

    const transitionId = <string>item['@id'].split('/').pop();
    this.services.resource.transition(this.contextPath, transitionId, { comment: this.commentText || '' })
      .subscribe((historyItem: WorkflowHistoryItem) => {
        this.commentText = '';
        this.workflowStateChanged.emit(historyItem);
        this.loadWorkflowInformation();
      }, (error: Error) => {
        console.log(error);
        if (error.type === 'WorkflowException' || error.response && error.response.status === 404) {
          this.workflowInformation = null;
        } else {
          console.error(error);
        }
      });
  }

  currentState(): string | null {
    if (this.workflowInformation && this.workflowInformation.history.length > 0) {
      return this.workflowInformation.history[this.workflowInformation.history.length - 1].title;
    } else {
      return '';
    }
  }

  displayTime(datestr: string) {
    const date = new Date(datestr);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  }

}
