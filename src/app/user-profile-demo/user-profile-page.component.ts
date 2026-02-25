import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentHookComponent } from '../comment-drawer/components/comment-hook/comment-hook.component';
import { CommentDrawerComponent } from '../comment-drawer/comment-drawer.component';

@Component({
  selector: 'app-user-profile-page',
  imports: [
    CommonModule,
    CommentHookComponent,
    CommentDrawerComponent
  ],
  templateUrl: './user-profile-page.component.html',
  styleUrl: './user-profile-page.component.scss'
})
export class UserProfilePageComponent {
}
