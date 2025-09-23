import { TestBed } from '@angular/core/testing';

import { ForgeApiService } from './forge-api';

describe('ForgeApi', () => {
  let service: ForgeApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ForgeApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
