import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id: number;
  username: string;
  email: string;
  iat: number;
  exp: number;
}

export interface User {
  id: string;
  email: string;
  username: string;
}

export interface UserResponse {
  id: string;
  email: string;
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private _http = inject(HttpClient);

  // Obtener todos los usuarios
  getUsers(): Observable<User[]> {
    return this._http.get<UserResponse[]>(`${environment.API_URL}/users`).pipe(
      map((response) => {
        /* console.log('Respuesta del backend:', response); */
        return response.map(
          (user): User => ({
            id: user.id,
            email: user.email,
            username: user.username ?? '',
          })
        );
      }),
      tap(/* value => console.log('Usuarios procesados:', value) */)
    );
  }

  // Actualizar usuario
  updateUser(id: string, data: Partial<User>): Observable<User> {
    return this._http.put<User>(`${environment.API_URL}/users/${id}`, data);
  }

  // Eliminar usuario
  deleteUser(id: string): Observable<void> {
    return this._http.delete<void>(`${environment.API_URL}/users/${id}`);
  }
  //extraer usuario del backend
  getUsernameFromToken(): string | null {
    const session = localStorage.getItem('session');

    if (!session) return null;

    try {
      const { access_token } = JSON.parse(session);
      const decoded: DecodedToken = jwtDecode(access_token);
      return decoded.username;
    } catch (error) {
      console.error('Error decodificando token:', error);
      return null;
    }
  }
}
