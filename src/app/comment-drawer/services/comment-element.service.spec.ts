import { TestBed } from '@angular/core/testing';

import { CommentElementService } from './comment-element.service';

describe('CommentCoordinationService', () => {
  let service: CommentElementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentElementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
