import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentTask } from './comment-task';

describe('CommentTask', () => {
  let component: CommentTask;
  let fixture: ComponentFixture<CommentTask>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentTask]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentTask);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
