import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDeniedComponent } from './employee-denied.component';

describe('EmployeeDeniedComponent', () => {
  let component: EmployeeDeniedComponent;
  let fixture: ComponentFixture<EmployeeDeniedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeDeniedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeDeniedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
