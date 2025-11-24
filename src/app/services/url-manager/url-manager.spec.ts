import { TestBed } from '@angular/core/testing';

import { UrlManager } from './url-manager';

describe('UrlManager', () => {
  let service: UrlManager;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UrlManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
