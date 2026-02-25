import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { CommentElementDirective } from '../../../comment-drawer/directives/comment-element.directive';
import { CommentElementService } from '../../services/comment-element.service';
import { FormsModule } from '@angular/forms';
import { CommentDataService } from '../../services/comment-data.service';
import { Comment } from '../../models/comment.models';
import { DomUtils } from '../../../shared/utils/dom-utils';
import { RelativeTimePipe } from '../../pipes/relative-time.pipe';

@Component({
  selector: 'app-comment-card',
  imports: [CommonModule, CommentElementDirective, FormsModule, RelativeTimePipe],
  templateUrl: './comment-card.component.html',
  styleUrl: './comment-card.component.scss'
})
export class CommentCardComponent {

  @HostListener('focusin', ['$event'])
  focus: Function = this.focusHandler;

  @ViewChild('card') card!: ElementRef<HTMLElement>;

  @Input()
  sectionId!: string;

  @Input()
  comment!: Comment;

  message: string = '';

  showReply = false;

  constructor(private elementService: CommentElementService, private dataService: CommentDataService) { }

  focusHandler() {
    this.elementService.focus(this.sectionId, this.comment.id);
  }

  toggleReplyInput(value: boolean) {
    this.showReply = value;

    if(value) {
      this.elementService.focusComment(this.sectionId, this.comment.id);
    }

    setTimeout(() => DomUtils.getFirstFocusableElement(this.card.nativeElement)?.focus({preventScroll: true}), 1);
  }
  
  onSend() {
    if(!this.message) {
      return;
    }

    this.comment.message = this.message;
    this.dataService.sendComment(this.comment).subscribe((comment) => {
      this.message = '';
      this.comment = comment;
      this.dataService.updateSection(this.sectionId);
      this.elementService.deregisterElement('comment', this.sectionId);
      this.elementService.registerElement('comment', this.card.nativeElement, comment.id);

      setTimeout(() => DomUtils.getFirstFocusableElement(this.card.nativeElement)?.focus({preventScroll: true}), 1);
    });
  }

  onReply() {
    if(!this.message) {
      return;
    }

    var comment = this.dataService.getNewComment(this.sectionId);
    comment.message = this.message;

    this.dataService.sendComment(comment).subscribe((comment) => {
      this.message = '';
      this.showReply = false;
      this.comment.replies.unshift(comment);
      this.dataService.updateSection(this.sectionId);

      setTimeout(() => DomUtils.getFirstFocusableElement(this.card.nativeElement)?.focus({preventScroll: true}), 1);
    });
  }

  onCancel() {
    this.dataService.cancelComment(this.sectionId);
  }
}
