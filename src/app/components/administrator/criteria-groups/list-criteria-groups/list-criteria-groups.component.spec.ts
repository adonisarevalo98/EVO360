import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCriteriaGroupsComponent } from './list-criteria-groups.component';

describe('ListCriteriaGroupsComponent', () => {
  let component: ListCriteriaGroupsComponent;
  let fixture: ComponentFixture<ListCriteriaGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCriteriaGroupsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCriteriaGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
