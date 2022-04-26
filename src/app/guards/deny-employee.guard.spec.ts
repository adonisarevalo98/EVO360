import { TestBed } from '@angular/core/testing';

import { DenyEmployeeGuard } from './deny-employee.guard';

describe('DenyEmployeeGuard', () => {
  let guard: DenyEmployeeGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DenyEmployeeGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
