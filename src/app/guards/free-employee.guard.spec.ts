import { TestBed } from '@angular/core/testing';

import { FreeEmployeeGuard } from './free-employee.guard';

describe('FreeEmployeeGuard', () => {
  let guard: FreeEmployeeGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(FreeEmployeeGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
