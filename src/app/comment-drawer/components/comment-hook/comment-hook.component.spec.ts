import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentHookComponent } from './comment-hook.component';

describe('CommentHookComponent', () => {
  let component: CommentHookComponent;
  let fixture: ComponentFixture<CommentHookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentHookComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentHookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
