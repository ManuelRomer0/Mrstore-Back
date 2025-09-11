import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { environment } from "../../../environments/environment";   
import { StorageService } from "src/app/shared/data-access/storage.service";
import { LoginResponse } from "./auth.models";


@Injectable({
    providedIn: 'root'
})
export class AuthService { 
    private _http = inject(HttpClient);
    private _storage = inject(StorageService);

   signUp(identifier: string, password: string, confirmPassword: string): Observable<LoginResponse> {
       return this._http.post<LoginResponse>(`${environment.API_URL}/auth/sign-up`, {
    identifier,
    password,
    confirmPassword,
  })}

    logIn(identifier: string, password: string): Observable<{ access_token: string }> {
        return this._http.post<{ access_token: string }>(`${environment.API_URL}/auth/log-in`, { identifier, password });
    }
};
