import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksLeaderComponent } from './tasks-leader.component';

describe('TasksLeaderComponent', () => {
  let component: TasksLeaderComponent;
  let fixture: ComponentFixture<TasksLeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksLeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksLeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
