import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditValidationComponent } from './edit-validation.component';

describe('EditValidationComponent', () => {
  let component: EditValidationComponent;
  let fixture: ComponentFixture<EditValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditValidationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
