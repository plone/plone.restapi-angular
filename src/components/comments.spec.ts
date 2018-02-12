import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { CommentItem } from '../interfaces';

import { Comment } from './comments';

describe('Comment component', () => {
  let comp: Comment;
  let fixture: ComponentFixture<Comment>;
  let commentContent, commentAuthor, commentDate: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Comment],
    });

    fixture = TestBed.createComponent(Comment);

    comp = fixture.componentInstance;

    commentContent = fixture.debugElement.query(By.css('.comment-body')).nativeElement;
    commentAuthor = fixture.debugElement.query(By.css('.comment-author')).nativeElement;
    commentDate = fixture.debugElement.query(By.css('.comment-date')).nativeElement;
  });

  it('should display author, date and format content', () => {
    let comment = <CommentItem>{
      comment_id: '13233313',
      creation_date: new Date('2000/01/01'),
      author_name: 'Dynausor',
      text: { 'mime-type': 'text/plain', 'data': 'Roaaaar\nRoooar\nRoooar' }
    };

    comp.comment = comment;

    fixture.detectChanges();

    expect(commentContent.innerHTML).toEqual(comment.text.data.replace(/\n/g, '<br>'));
    expect(commentAuthor.innerHTML).toEqual(comment.author_name);
    expect(commentDate.innerHTML).toEqual(new DatePipe('en').transform(comment.creation_date));
  });
});
