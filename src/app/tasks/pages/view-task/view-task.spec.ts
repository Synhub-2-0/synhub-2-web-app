import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTask } from './view-task';

describe('ViewTask', () => {
  let component: ViewTask;
  let fixture: ComponentFixture<ViewTask>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewTask]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTask);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
