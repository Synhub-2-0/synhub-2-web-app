import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberTaskItem } from './member-task-item';

describe('MemberTaskItem', () => {
  let component: MemberTaskItem;
  let fixture: ComponentFixture<MemberTaskItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberTaskItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberTaskItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
