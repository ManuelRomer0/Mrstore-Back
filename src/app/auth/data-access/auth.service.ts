import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StorageService } from 'src/app/shared/data-access/storage.service';
import { LoginResponse } from './auth.models';
import { AuthStateService } from 'src/app/shared/data-access/auth.state.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LogInDto, SignUpDto } from 'src/app/shared/dto/auth.dto';

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

  signUp(body: SignUpDto) {
    return this.signUpRequest(body).pipe(
      this.setStorage({ ...body, rememberMe: true })
    );
  }

  private signUpRequest(body: SignUpDto): Observable<LoginResponse> {
    return this._http.post<LoginResponse>(
      `${environment.API_URL}/auth/sign-up`,
      body
    );
  }

  logIn(body: LogInDto) {
    return this.logInRequest(body.identifier, body.password)
      .pipe(this.setStorage(body))
      .subscribe();
  }

  private logInRequest(
    identifier: string,
    password: string
  ): Observable<LoginResponse> {
    return this._http.post<LoginResponse>(
      `${environment.API_URL}/auth/log-in`,
      { identifier, password }
    );
  }

  private setStorage(body) {
    return map((res: LoginResponse) => {
      const userData = this.jwtHelper.decodeToken(res.access_token);
      if (body.rememberMe) {
        if (res.access_token) {
          this._authStateService.setRemember({
            access_token: res.access_token,
          });

          localStorage.setItem('user', JSON.stringify(userData));
        }

        this._router.navigateByUrl('/dashboard');
      } else {
        if (res.access_token) {
          this._authStateService.setSession({
            access_token: res.access_token,
          });

          sessionStorage.setItem('user', JSON.stringify(userData));
        }

        this._router.navigateByUrl('/dashboard');
      }

      return res;
    });
  }
}
