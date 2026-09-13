import { Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import {MatInputModule,} from '@angular/material/input';
import {CommonModule} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {AuthService} from '../../services/auth.service';
import {NgxCaptchaModule, ReCaptcha2Component} from 'ngx-captcha';

@Component({
  selector: 'app-sign-up.component',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    MatButtonToggleGroup,
    MatButtonToggle,
    NgxCaptchaModule
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  showPassword = false;
  showConfirmPassword = false;
  siteKey = '6Ldred4rAAAAAEUQavOTWU48abpsm4kFmtSyc3d2';

  @ViewChild('captchaElem') captchaElem?: ReCaptcha2Component;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      imgUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
      role: ['', Validators.required],
      recaptcha: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });
  }

  ngOnInit() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      imgUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
      role: ['', Validators.required],
      recaptcha: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });
  }

  handleSuccess(captchaResponse: string): void {
    // Optionally handle success
  }

  handleReset(): void {
    // Optionally handle reset
  }

  handleExpire(): void {
    this.registerForm.get('recaptcha')?.reset();
  }

  handleLoad(): void {
    // Optionally handle load
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;
    this.submitted = true;

    const formValue = this.registerForm.value;
    const signUpRequest = {
      username: formValue.username,
      name: formValue.name,
      surname: formValue.surname,
      imgUrl: formValue.imgUrl,
      email: formValue.email,
      password: formValue.password,
      roles: [formValue.role === 'leader' ? 'ROLE_LEADER' : 'ROLE_MEMBER'],
      captcha: formValue.recaptcha
    };

    this.authService.signUp(signUpRequest);
  }

  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
}
