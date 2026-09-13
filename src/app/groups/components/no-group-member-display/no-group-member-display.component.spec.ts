import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoGroupMemberDisplayComponent } from './no-group-member-display.component';

describe('NoGroupMemberDisplayComponent', () => {
  let component: NoGroupMemberDisplayComponent;
  let fixture: ComponentFixture<NoGroupMemberDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoGroupMemberDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoGroupMemberDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
