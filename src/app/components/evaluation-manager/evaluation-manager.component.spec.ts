import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationManagerComponent } from './evaluation-manager.component';

describe('EvaluationManagerComponent', () => {
  let component: EvaluationManagerComponent;
  let fixture: ComponentFixture<EvaluationManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluationManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
