import { TestBed } from '@angular/core/testing';

import { EvaluationManagerGuard } from './evaluation-manager.guard';

describe('EvaluationManagerGuard', () => {
  let guard: EvaluationManagerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(EvaluationManagerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
