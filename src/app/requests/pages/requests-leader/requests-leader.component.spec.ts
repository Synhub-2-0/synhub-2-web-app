import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsLeaderComponent } from './requests-leader.component';

describe('RequestsLeaderComponent', () => {
  let component: RequestsLeaderComponent;
  let fixture: ComponentFixture<RequestsLeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestsLeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestsLeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
