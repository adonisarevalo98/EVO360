import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDeniedComponent } from './company-denied.component';

describe('CompanyDeniedComponent', () => {
  let component: CompanyDeniedComponent;
  let fixture: ComponentFixture<CompanyDeniedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyDeniedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDeniedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
