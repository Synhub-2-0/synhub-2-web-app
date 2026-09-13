import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationsLeaderComponent } from './invitations-leader.component';

describe('InvitationsLeaderComponent', () => {
  let component: InvitationsLeaderComponent;
  let fixture: ComponentFixture<InvitationsLeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvitationsLeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvitationsLeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
