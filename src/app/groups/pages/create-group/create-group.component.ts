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
  template: `
    <div class="w-full h-full p-4 md:p-8">
      <h2 class="text-xl md:text-2xl font-bold mb-4">Crear Grupo</h2>
      <form [formGroup]="createGroupForm" (ngSubmit)="onSubmit()" class="w-full h-full flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <mat-form-field appearance="fill" class="w-full">
            <mat-label>Nombre del Grupo</mat-label>
            <mat-icon matPrefix style="color: #888;">person</mat-icon>
            <input matInput formControlName="name" placeholder="Nombre Grupo" type="text" required>
            @if (createGroupForm.get('name')?.hasError) {
              <mat-error>
                El nombre es <strong>requerido</strong>
              </mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="fill" class="w-full">
            <mat-label>Descripción del grupo</mat-label>
            <mat-icon matPrefix style="color: #888;">group</mat-icon>
            <textarea matInput formControlName="description" placeholder="Descripción Grupo" type="text" required rows="6"></textarea>
            @if (createGroupForm.get('description')?.hasError) {
              <mat-error>
                La descripción es <strong>requerida</strong>
              </mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="fill" class="w-full">
            <mat-label>Url de la imagen de grupo</mat-label>
            <mat-icon matPrefix style="color: #888;">link</mat-icon>
            <input matInput formControlName="imgUrl" placeholder="Url Imagen Grupo" type="text" required>
            @if (createGroupForm.get('imgUrl')?.hasError('required')) {
              <mat-error>
                El url de la imagen es <strong>requerida</strong>
              </mat-error>
            }
            @if (createGroupForm.get('imgUrl')?.hasError('invalidImageUrl')) {
              <mat-error>
                El url debe ser una imagen válida (.jpg, .jpeg, .png, .gif, .webp, .svg)
              </mat-error>
            }
          </mat-form-field>
        </div>

        <div class="mt-4 flex justify-center items-center pb-8">
          <button
            [disabled]="createGroupForm.invalid"
            class="bg-[#4A90E2] rounded-2xl w-full sm:w-auto text-white text-lg md:text-xl py-3 px-8 shadow-md shadow-gray-400 hover:cursor-pointer hover:bg-[#559df2] transition disabled:bg-gray-400 disabled:cursor-default">
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  `,
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
        this.router.navigate(['leaders/group']).then();
      },
      error: (err) => {
        console.error('Error creating group', err);
      }
    })
    this.submitted = true;
  }
}
