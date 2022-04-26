import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEmploymentComponent } from './list-employment.component';

describe('ListEmploymentComponent', () => {
  let component: ListEmploymentComponent;
  let fixture: ComponentFixture<ListEmploymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEmploymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmploymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
