import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, PLATFORM_ID } from '@angular/core';
import { DrawerComponent } from '../shared/components/drawer/drawer.component';
import { CommentSectionComponent } from './components/comment-section/comment-section.component';
import { SectionOrderPipe } from './pipes/section-order.pipe';
import { CommentElementDirective } from './directives/comment-element.directive';
import { UserProfileServiceService } from '../user-profile-demo/services/user-profile-service.service';
import { CommentDataService } from './services/comment-data.service';
import { BehaviorSubject } from 'rxjs';
import { CommentSection } from './models/comment.models';
import { CommentElementService } from './services/comment-element.service';

@Component({
  selector: 'app-comment-drawer',
  imports: [
    CommonModule,
    DrawerComponent,
    CommentSectionComponent,
    SectionOrderPipe,
    CommentElementDirective
  ],
  templateUrl: './comment-drawer.component.html',
  styleUrl: './comment-drawer.component.scss'
})
export class CommentDrawerComponent {

  isReducedLayout: boolean = false;
  isMobileLayout: boolean = false;

  private reducedMediaQuery?: MediaQueryList;
  private reducedListener = (e: MediaQueryListEvent) => this.isReducedLayout = e.matches;
  private mobileMediaQuery?: MediaQueryList;
  private mobileListener = (e: MediaQueryListEvent) => this.isMobileLayout = e.matches;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    protected dataService: CommentDataService,
    protected elementService: CommentElementService) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.reducedMediaQuery = window.matchMedia('(max-width: 50rem)');
      this.reducedMediaQuery.addEventListener('change', this.reducedListener);
      this.isReducedLayout = this.reducedMediaQuery.matches;

      this.mobileMediaQuery = window.matchMedia('(max-width: 37rem)');
      this.mobileMediaQuery.addEventListener('change', this.mobileListener);
      this.isMobileLayout = this.mobileMediaQuery.matches;
    }
  }

  ngOnDestroy(): void {
    this.reducedMediaQuery?.removeEventListener('change', this.reducedListener);
    this.mobileMediaQuery?.removeEventListener('change', this.mobileListener);
  }

  trackBySectionId(index: number, entry: {sectionId: string, section$: BehaviorSubject<CommentSection>}) {
    return entry.sectionId;
  }
}
