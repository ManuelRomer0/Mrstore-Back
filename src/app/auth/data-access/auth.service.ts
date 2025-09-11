import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StorageService } from 'src/app/shared/data-access/storage.service';
import { LoginResponse } from './auth.models';
import { AuthStateService } from 'src/app/shared/data-access/auth.state.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _http = inject(HttpClient);
  private _storage = inject(StorageService);

  constructor(
    private readonly _authStateService: AuthStateService,
    private readonly _router: Router,
    private readonly jwtHelper: JwtHelperService
  ) {}

  signUp(
    identifier: string,
    password: string,
    confirmPassword: string
  ): Observable<LoginResponse> {
    return this._http.post<LoginResponse>(
      `${environment.API_URL}/auth/sign-up`,
      {
        identifier,
        password,
        confirmPassword,
      }
    );
  }

  logIn(identifier: string, password: string, rememberMe: boolean) {
    return this.logInRequest(identifier, password).subscribe({
      next: (res) => {
        if (rememberMe) {
          if (res.access_token) {
            this._authStateService.setRemember({
              access_token: res.access_token,
            });

            const userData = this.jwtHelper.decodeToken(res.access_token);
            localStorage.setItem('user', JSON.stringify(userData));
          }

          this._router.navigateByUrl('/dashboard');
        } else {
          if (res.access_token) {
            this._authStateService.setSession({
              access_token: res.access_token,
            });
          }

          this._router.navigateByUrl('/dashboard');
        }
      },
      error: (err) => {
        console.error('Error login:', err);
        alert('Credenciales incorrectas');
      },
    });
  }

  private logInRequest(
    identifier: string,
    password: string
  ): Observable<{ access_token: string }> {
    return this._http.post<{ access_token: string }>(
      `${environment.API_URL}/auth/log-in`,
      { identifier, password }
    );
  }
}
