import { TestBed } from '@angular/core/testing';

import { DenyManagerGuard } from './deny-manager.guard';

describe('DenyManagerGuard', () => {
  let guard: DenyManagerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DenyManagerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
