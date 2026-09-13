import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersLeaderComponent } from './members-leader.component';

describe('MembersLeaderComponent', () => {
  let component: MembersLeaderComponent;
  let fixture: ComponentFixture<MembersLeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembersLeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembersLeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
