import { TestBed } from '@angular/core/testing';

import { DomUtils } from './dom-utils';

describe('DomUtils', () => {
  let service: DomUtils;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DomUtils);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
