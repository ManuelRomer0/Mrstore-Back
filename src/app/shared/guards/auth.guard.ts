import { CanActivateFn, Router } from "@angular/router"
import { AuthStateService } from "../data-access/auth.state.service";
import { inject } from "@angular/core";

export const privateGuard = (): CanActivateFn => {
    return () => {
  const AuthState = inject(AuthStateService);
  const router = inject(Router);
  const session = AuthState.getSession ();
  if(session) {
    return true;
  }
  router.navigateByUrl('/log-in')
  return false;
    }
}
export const publicGuard = (): CanActivateFn => {
    return () => {
        const AuthState = inject(AuthStateService);
        const router = inject(Router);
        const session = AuthState.getSession();
        console.log (session);

        if(session) {
            router.navigateByUrl('/dashboard')
            return false;
        }
        
        return true;
    }
}