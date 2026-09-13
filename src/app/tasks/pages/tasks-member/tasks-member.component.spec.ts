import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksMemberComponent } from './tasks-member.component';

describe('TasksMemberComponent', () => {
  let component: TasksMemberComponent;
  let fixture: ComponentFixture<TasksMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksMemberComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
