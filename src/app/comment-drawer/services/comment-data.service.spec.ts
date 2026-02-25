import { TestBed } from '@angular/core/testing';

import { CommentDataService } from './comment-data.service';

describe('CommentService', () => {
  let service: CommentDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
