import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyGroupMemberComponent } from './my-group-member.component';

describe('MyGroupMemberComponent', () => {
  let component: MyGroupMemberComponent;
  let fixture: ComponentFixture<MyGroupMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyGroupMemberComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyGroupMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
