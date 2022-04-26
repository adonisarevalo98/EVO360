import { TestBed } from '@angular/core/testing';

import { FreeManagerGuard } from './free-manager.guard';

describe('FreeManagerGuard', () => {
  let guard: FreeManagerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(FreeManagerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
