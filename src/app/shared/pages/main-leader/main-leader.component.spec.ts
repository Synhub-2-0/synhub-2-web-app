import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainLeaderComponent } from './main-leader.component';

describe('MainLeaderComponent', () => {
  let component: MainLeaderComponent;
  let fixture: ComponentFixture<MainLeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainLeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainLeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
