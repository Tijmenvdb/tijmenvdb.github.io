import { Component, Input } from '@angular/core';
import { CommentCardComponent } from '../comment-card/comment-card.component';
import { CommonModule } from '@angular/common';
import { CommentElementService } from '../../services/comment-element.service';
import { BehaviorSubject } from 'rxjs';
import { CommentElementDirective } from '../../../comment-drawer/directives/comment-element.directive';
import { CommentSection } from '../../models/comment.models';
import { CommentDataService } from '../../services/comment-data.service';

@Component({
  selector: 'app-comment-section',
  imports: [CommonModule, CommentCardComponent, CommentElementDirective],
  templateUrl: './comment-section.component.html',
  styleUrl: './comment-section.component.scss'
})
export class CommentSectionComponent {
  @Input()
  sectionId!: string;

  @Input()
  section$!: BehaviorSubject<CommentSection>;

  constructor(private dataService: CommentDataService, private elementService: CommentElementService) { }

  onAddComment() {
    this.dataService.addComment(this.sectionId);
    setTimeout(() => this.elementService.focusSection(this.sectionId, this.sectionId), 1);
  }

  onHeaderClick() {
    const commentId = this.section$.value.comments[0].id;
    if(window.innerWidth <= 600) {
      this.dataService.isDrawerOpen = false;
      setTimeout(() => {
        this.elementService.focusHook(this.sectionId, commentId);
      }, 50)
    } else if(window.innerWidth <= 800) {
      this.elementService.focusSection(this.sectionId, commentId);
      this.elementService.scrollToHook(this.sectionId);
    } else {
      this.elementService.focusHook(this.sectionId, commentId);
    }
  }
}
