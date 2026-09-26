import { Component } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {CreateGroupRequest} from '@app/groups/model/requests/create-group.request';
import {LeaderGroupService} from '@app/groups/services/leader-group.service';
import {Router} from '@angular/router';

function imageUrlValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;
  const pattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)$/i;
  return pattern.test(value) ? null : { invalidImageUrl: true };
}

@Component({
  selector: 'app-create-group',
  imports: [MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    MatIconModule],
  templateUrl: './create-group.component.html',
  styles: ``
})
export class CreateGroupComponent {
  createGroupForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, private leaderGroupService : LeaderGroupService, private router: Router) {
    this.createGroupForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      imgUrl: ['', [Validators.required, imageUrlValidator]]
    });
  }

  onSubmit(): void {
    if (this.createGroupForm.invalid) return;

    const name = this.createGroupForm.value.name ?? '';
    const description = this.createGroupForm.value.description ?? '';
    const imgUrl = this.createGroupForm.value.imgUrl ?? '';


    this.leaderGroupService.createGroup(new CreateGroupRequest(name, imgUrl, description)).subscribe({
      next: () => {
        this.router.navigate(['leaders/my-group']).then();
      },
      error: (err) => {
        console.error('Error creating group', err);
      }
    })
    this.submitted = true;
  }
}
