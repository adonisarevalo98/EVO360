import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerDeniedComponent } from './manager-denied.component';

describe('ManagerDeniedComponent', () => {
  let component: ManagerDeniedComponent;
  let fixture: ComponentFixture<ManagerDeniedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagerDeniedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerDeniedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
