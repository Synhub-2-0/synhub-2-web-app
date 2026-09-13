import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoMemberDisplayComponent } from './no-member-display.component';

describe('NoMemberDisplayComponent', () => {
  let component: NoMemberDisplayComponent;
  let fixture: ComponentFixture<NoMemberDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoMemberDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoMemberDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
