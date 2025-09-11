import { Component, inject, OnInit } from '@angular/core';
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

type LoginForm = {
  identifier: FormControl<string>;
  password: FormControl<string>;
  rememberMe: FormControl<boolean>;
};

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './log-in.html',
  styles: ``,
})
export default class LogIn implements OnInit {
  form!: FormGroup<LoginForm>;

  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _authStateService = inject(AuthStateService);

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      identifier: new FormControl(
        this._authStateService.getRememberedIdentifier() || '',
        {
          nonNullable: true,
          validators: [Validators.required, Validators.minLength(3)],
        }
      ),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6)],
      }),
      rememberMe: new FormControl(false, { nonNullable: true }),
    });
  }

  Submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { identifier, password, rememberMe } = this.form.getRawValue();

    this._authService.logIn(identifier, password, rememberMe);
  }
}
