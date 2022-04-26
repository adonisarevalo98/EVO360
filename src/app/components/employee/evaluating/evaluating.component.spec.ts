import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluatingComponent } from './evaluating.component';

describe('EvaluatingComponent', () => {
  let component: EvaluatingComponent;
  let fixture: ComponentFixture<EvaluatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluatingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
