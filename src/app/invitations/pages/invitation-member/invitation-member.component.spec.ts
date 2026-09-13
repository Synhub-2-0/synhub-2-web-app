import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationMemberComponent } from './invitation-member.component';

describe('InvitationMemberComponent', () => {
  let component: InvitationMemberComponent;
  let fixture: ComponentFixture<InvitationMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvitationMemberComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvitationMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
