import { CanActivateFn, Router } from '@angular/router';
import { AuthStateService } from '../data-access/auth.state.service';
import { inject } from '@angular/core';

export const privateGuard = (): CanActivateFn => {
  return () => {
    const AuthState = inject(AuthStateService);
    if (!AuthState.isAuthenticated()) {
      console.log('Hola');
      AuthState.logOut();
      return false;
    }

    return true;
  };
};
export const publicGuard = (): CanActivateFn => {
  return () => {
    const AuthState = inject(AuthStateService);
    const router = inject(Router);
    const session = AuthState.getSession();
    console.log('Hola');

    if (session) {
      router.navigateByUrl('/dashboard');
      return false;
    }

    return true;
  };
};
