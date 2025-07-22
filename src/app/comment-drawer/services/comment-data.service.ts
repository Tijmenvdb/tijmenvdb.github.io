import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, debounceTime, filter, Observable, of } from 'rxjs';
import { Comment, CommentSection } from '../models/comment.models';

@Injectable({
  providedIn: 'root'
})
export class CommentDataService implements OnDestroy {

  isDrawerOpen = false;
  
  sections: Map<string, BehaviorSubject<CommentSection>> = new Map();

  loadQueue$: BehaviorSubject<string[]> = new BehaviorSubject([] as string[]);

  constructor() {
    this.loadQueue$.pipe(
      debounceTime(20),
      filter(sectionIds => sectionIds.length > 0)
    ).subscribe((sectionIds) => {
      this.loadQueue$.next([]);
      this.loadComments(sectionIds);
    });
  }

  ngOnDestroy(): void {
    this.loadQueue$.complete();

    const sectionIterator =  this.sections.values();
    var section$ = sectionIterator.next();
    while(!section$.done) {
      section$.value?.complete();
      section$ = sectionIterator.next();
    }
  }

  initHook(sectionId: string, title: string, order: number): BehaviorSubject<CommentSection> {
    const commentSection: CommentSection = {
      title: title,
      order: order,
      comments: []
    };

    const commentSection$: BehaviorSubject<CommentSection> = new BehaviorSubject(commentSection);

    this.sections.set(sectionId, commentSection$);
    this.loadQueue$.next([...this.loadQueue$.value, sectionId]);
    this.updateDrawer();

    return commentSection$;
  }

  destroyHook(sectionId: string): void {
    const commentSection$ = this.sections.get(sectionId);
    commentSection$?.complete();
    this.sections.delete(sectionId);

    this.updateDrawer();
  }

  mockDate(amount: number, unit: 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years'): Date {
    var date = new Date();
    var offset = 0;
    switch(unit) {
      case 'seconds':
        offset = 1000;
        break;
      case 'minutes':
        offset = 60000;
        break;
      case 'hours':
        offset = 3600000;
        break;
      case 'days':
        offset = 86400000;
        break;
      case 'weeks':
        offset = 604800000;
        break;
      case 'months':
        offset = 2592000000;
        break;
      case 'years':
        offset = 31536000000;
        break;
    }

    return new Date(date.valueOf() - (offset * amount));
  }

  loadComments(sectionIds: string[]): void {
    const commentSections: any = {
      'personal-info': [
        {
          id: "0",
          username: "User X",
          message: "This is a comment by User X under Profile Info!",
          date: this.mockDate(1, 'hours'),
          replies: [
            {
              id: "4",
              username: "User A",
              message: "This is a reply by User A!",
              date: this.mockDate(30, 'minutes'),
            },
            {
              id: "5",
              username: "User B",
              message: "This is a reply by User B!",
              date: this.mockDate(39, 'minutes'),
            },
            {
              id: "6",
              username: "User C",
              message: "This is a reply by User C!",
              date: this.mockDate(45, 'minutes'),
            }
          ]
        },
        {
          id: "1",
          username: "User X",
          message: "This is a comment by User X under Profile Info!",
          date: this.mockDate(5, 'hours'),
          replies: [
            {
              id: "7",
              username: "User A",
              message: "This is a reply by User A!",
              date: this.mockDate(50, 'minutes'),
            },
            {
              id: "8",
              username: "User B",
              message: "This is a reply by User B!",
              date: this.mockDate(1, 'hours'),
            },
            {
              id: "9",
              username: "User C",
              message: "This is a reply by User C!",
              date: this.mockDate(2, 'hours'),
            }
          ]
        },
        {
          id: "2",
          username: "User X",
          message: "This is a comment by User X under Profile Info!",
          date: this.mockDate(2, 'days'),
          replies: [
            {
              id: "10",
              username: "User A",
              message: "This is a reply by User A!",
              date: this.mockDate(3, 'hours'),
            },
            {
              id: "11",
              username: "User B",
              message: "This is a reply by User B!",
              date: this.mockDate(6, 'hours'),
            },
            {
              id: "12",
              username: "User C",
              message: "This is a reply by User C!",
              date: this.mockDate(1, 'days'),
            }
          ]
        }
      ],
      'preferences': [
        {
          id: "3",
          username: "User X",
          message: "This is a comment by User X under Prefernces!",
          date: this.mockDate(2, 'hours'),
          replies: [
            {
              id: "13",
              username: "User A",
              message: "This is a reply by User A!",
              date: this.mockDate(0, 'seconds'),
            },
            {
              id: "14",
              username: "User B",
              message: "This is a reply by User B!",
              date: this.mockDate(30, 'seconds'),
            },
            {
              id: "15",
              username: "User C",
              message: "This is a reply by User C!",
              date: this.mockDate(20, 'minutes'),
            }
          ]
        }
      ]
    };

    sectionIds.forEach((sectionId) => {
      const commentSection$ = this.sections.get(sectionId);
      const commentSection = commentSection$?.value;

      if (commentSection) {
        commentSection.comments = commentSections[sectionId] ?? [];
        commentSection$.next(commentSection);
      }
    });

    this.updateDrawer();
  }

  updateSection(sectionId: string): void {
    const section$ = this.sections.get(sectionId);
    section$?.next(section$.value);
  }

  updateDrawer(): void {
    this.sections = new Map(this.sections);
  }

  getNewComment(sectionId: string): Comment {
    return {
      id: sectionId,
      username: 'Anonymous',
      message: '',
      replies: [],
      isNew: true
    }
  }

  getFirstComment(sectionId: string): Comment | undefined {
    return this.sections.get(sectionId)?.value.comments?.[0];
  }

  addComment(sectionId: string): void {
    const section$ = this.sections.get(sectionId)
    const section = section$?.value;
    if(!section || section.comments[0]?.isNew) {
      return;
    }

    section.comments.unshift(this.getNewComment(sectionId));

    section$.next(section);

    this.updateDrawer();
  }

  cancelComment(sectionId: string): void {
    const section$ = this.sections.get(sectionId)
    const section = section$?.value;
    if(!section) {
      return;
    }

    section.comments.shift();

    section$.next(section);

    this.updateDrawer();
  }

  commentIndex = 16; // temp
  sendComment(comment: Comment): Observable<Comment> {
    comment.id = `${this.commentIndex++}`;
    comment.isNew = false;
    comment.date = new Date();

    return of(comment);
  }
}
