import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../data-access/auth.service';
import { Router } from '@angular/router';
import { AuthStateService } from 'src/app/shared/data-access/auth.state.service';

type SignUpForm = {
  identifier: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
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

  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _authStateService = inject(AuthStateService);

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      identifier: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6)],
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

  Submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { identifier, password, confirmPassword } = this.form.getRawValue();

    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    this._authService.signUp(identifier, password, confirmPassword).subscribe({
      next: (res) => {
        if (res.access_token) this._authStateService.setSession({ access_token: res.access_token });

        // Redirigir al dashboard
        this._router.navigateByUrl('/dashboard');
        
      },
      error: (err) => {
        console.error('Error signup:', err);
        alert('No se pudo crear el usuario');
      },
    });
  }
}