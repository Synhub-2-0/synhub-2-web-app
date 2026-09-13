import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaderTaskItem } from './leader-task-item';

describe('LeaderTaskItem', () => {
  let component: LeaderTaskItem;
  let fixture: ComponentFixture<LeaderTaskItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaderTaskItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaderTaskItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
