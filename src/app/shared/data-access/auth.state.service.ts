import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
    private sessionKey = 'session';
    private rememberKey = 'rememberedIdentifier';

    setSession(session: { access_token: string }) {
        sessionStorage.setItem(this.sessionKey, JSON.stringify(session));
    }

    getSession() {
        const session = sessionStorage.getItem(this.sessionKey);
        return session ? JSON.parse(session) : null;
    }

    clearSession() {
        sessionStorage.removeItem(this.sessionKey);
    }

    setRemember(identifier: string, remember: boolean) {
        if (remember) {
            localStorage.setItem(this.rememberKey, identifier);
        } else {
            localStorage.removeItem(this.rememberKey);
        }
    }

    getRememberedIdentifier(): string | null {
        return localStorage.getItem(this.rememberKey);
    }
    isLoggedIn(): boolean {
        return !!this.getSession();
    }
}
