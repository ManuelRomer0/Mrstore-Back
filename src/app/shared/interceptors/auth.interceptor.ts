import { inject, Injectable, NgZone } from '@angular/core';
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthStateService } from '../data-access/auth.state.service';
import { Router } from '@angular/router';

@Injectable()
export class authInterceptor implements HttpInterceptor {
    
        private _authStateService = inject(AuthStateService);
        private _router = inject(Router);
        private _ngZone = inject(NgZone);
   

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const session = this._authStateService.getSession();
        const clonedReq = session
            ? req.clone({
                setHeaders: { Authorization: `Bearer ${session.access_token}` },
            })
            : req;

        return next.handle(clonedReq).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    this._authStateService.clearSession();
                    this._ngZone.run(() => this._router.navigate(['/log-in']));
                }
                return throwError(() => error);
            })
        );
    }
}