import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private sessionKey = 'session';
  private rememberKey = 'rememberedIdentifier';

  constructor(
    private readonly jwtHelper: JwtHelperService,
    private readonly _router: Router
  ) {}

  setSession(session: { access_token: string}) {
    sessionStorage.setItem(this.sessionKey, JSON.stringify(session));
  }

  getSession() {
    const session =
      sessionStorage.getItem(this.sessionKey) ||
      localStorage.getItem(this.sessionKey);
    return session ? JSON.parse(session) : null;
  }

  logOut() {
    sessionStorage.clear();
    localStorage.clear();
    this._router.navigateByUrl('/log-in');
  }

  setRemember(session: { access_token: string }) {
    localStorage.setItem(this.sessionKey, JSON.stringify(session));
    localStorage.setItem('rememberMe', 'true');
  }

  getRememberedIdentifier(): string | null {
    return localStorage.getItem(this.rememberKey);
  }
  isLoggedIn(): boolean {
    return !!this.getSession();
  }

  isAuthenticated(): boolean {
    return !this.jwtHelper.isTokenExpired(AuthStateService.token);
  }

  public static get token(): any {
    const jwt =
      localStorage.getItem('session') || sessionStorage.getItem('session');
    return jwt ? JSON.parse(jwt).access_token : null;
  }
  clearSession() {
    localStorage.removeItem(this.sessionKey);
  }
}

