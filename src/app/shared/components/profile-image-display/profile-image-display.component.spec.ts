import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileImageDisplayComponent } from './profile-image-display.component';

describe('ProfileImageDisplayComponent', () => {
  let component: ProfileImageDisplayComponent;
  let fixture: ComponentFixture<ProfileImageDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileImageDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileImageDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
