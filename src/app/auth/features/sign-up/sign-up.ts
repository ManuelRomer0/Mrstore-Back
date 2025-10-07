import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../data-access/auth.service';
import { Router } from '@angular/router';
import { AuthStateService } from 'src/app/shared/data-access/auth.state.service';
import { SignUpDto } from 'src/app/shared/dto/auth.dto';

type SignUpForm = {
  username: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
};

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.html',
  styles: ``,
})
export default class SignUp implements OnInit {
  form!: FormGroup<SignUpForm>;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly authStateService: AuthStateService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group<SignUpForm>({
      username: this.fb.control(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
      email: this.fb.control(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.email,
      ]),
      password: this.fb.control(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPassword: this.fb.control(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
    });
  }

  Submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const signUpDto = this.form.getRawValue() as SignUpDto;

    if (signUpDto.password !== signUpDto.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    this.authService.signUp(signUpDto).subscribe({
      next: (_) => {},
      error: (err) => {
        console.error('Error signup:', err);
        alert('No se pudo crear el usuario');
      },
    });
  }
}
