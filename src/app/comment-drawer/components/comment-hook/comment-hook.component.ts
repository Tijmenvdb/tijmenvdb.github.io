import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CommentElementDirective } from '../../../comment-drawer/directives/comment-element.directive';
import { CommentElementService } from '../../services/comment-element.service';
import { CommentDataService } from '../../services/comment-data.service';
import { CommentSection } from '../../models/comment.models';

@Component({
  selector: 'app-comment-hook',
  imports: [CommentElementDirective],
  templateUrl: './comment-hook.component.html',
  styleUrl: './comment-hook.component.scss'
})
export class CommentHookComponent implements OnInit, OnDestroy, OnChanges {

  @Input()
  sectionId!: string;

  @Input()
  title: string = '';

  @Input()
  order: number = 0;

  section$!: BehaviorSubject<CommentSection>;

  isEmpty: boolean = false;

  constructor(private dataService: CommentDataService, private elementService: CommentElementService) { }

  ngOnInit() {
    this.section$ = this.dataService.initHook(this.sectionId, this.title, this.order);

    this.section$.subscribe((section) => {
      this.isEmpty = !section.comments.length || (section.comments.length == 1 && !!section.comments[0].isNew);
    });
  }

  ngOnDestroy(): void {
    this.dataService.destroyHook(this.sectionId)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(!this.section$) {
      return;
    }

    var section = this.section$.value;

    section.title = this.title;
    section.order = this.order;

    this.section$.next(section);

    if(changes['order'].previousValue != changes['order'].currentValue) {
      this.dataService.updateDrawer();
    }
  }

  onClick() {
    this.dataService.isDrawerOpen = true;

    if(this.isEmpty) {
      this.dataService.addComment(this.sectionId);
    }

    const section = this.section$.value;
    const commentId = section.comments[0].id;

    setTimeout(() => this.elementService.focusSection(this.sectionId, commentId), 1);
  }
}
