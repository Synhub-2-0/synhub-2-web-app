import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsMemberComponent } from './requests-member.component';

describe('RequestsMemberComponent', () => {
  let component: RequestsMemberComponent;
  let fixture: ComponentFixture<RequestsMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestsMemberComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestsMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
