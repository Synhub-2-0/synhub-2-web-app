import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestCardListComponent } from './request-card-list.component';

describe('RequestCardListComponent', () => {
  let component: RequestCardListComponent;
  let fixture: ComponentFixture<RequestCardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestCardListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
