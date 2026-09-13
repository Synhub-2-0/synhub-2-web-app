import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyGroupLeaderComponent } from './my-group-leader.component';

describe('MyGroupLeaderComponent', () => {
  let component: MyGroupLeaderComponent;
  let fixture: ComponentFixture<MyGroupLeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyGroupLeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyGroupLeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
