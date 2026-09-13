import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoGroupDisplayComponent } from './no-group-display.component';

describe('NoGroupDisplayComponent', () => {
  let component: NoGroupDisplayComponent;
  let fixture: ComponentFixture<NoGroupDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoGroupDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoGroupDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
