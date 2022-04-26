import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriteriaGroupsComponent } from './criteria-groups.component';

describe('CriteriaGroupsComponent', () => {
  let component: CriteriaGroupsComponent;
  let fixture: ComponentFixture<CriteriaGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CriteriaGroupsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CriteriaGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
