import { Component, OnInit, inject } from '@angular/core';
import {
  DashboardService,
  User as DashboardUser,
} from './data-access/dashboard.service';
import { AuthStateService } from '../shared/data-access/auth.state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrls: [],
  imports: [],
})
export class Dashboard implements OnInit {
  private dashboardService = inject(DashboardService);
  private authStateService = inject(AuthStateService);
  private router = inject(Router);

  users: DashboardUser[] = [];
  loading = true;
  errorMessage = '';

  //propiedad para el username de la sesión actual
  username: string = '';

  ngOnInit(): void {
    this.loadUsers();
    this.loadSessionUser();
  }

  loadUsers() {
    this.dashboardService.getUsers().subscribe({
      next: (users) => {
        console.log(users);
        this.users = users.map((u) => ({
          ...u,
          username: u.username ?? 'Sin username', // nunca null
        }));
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando usuarios:', error);
        this.errorMessage = 'No se pudo cargar la lista de usuarios.';
        this.loading = false;
      },
    });
  }
ñ
  // Cargar el username de la sesión actual
  loadSessionUser() {
    const session = this.authStateService.getSession();

    if (!session) {
      console.warn('No hay sesión activa');
      return;
    }

    try {
      const payload = JSON.parse(atob(session.access_token.split('.')[1]));
      this.username = payload.username ?? 'Usuario'; // valor por defecto
    } catch (error) {
      console.error('Error leyendo el token:', error);
      this.username = 'Usuario';
    }
  }

  logout() {
    this.authStateService.logOut();
    this.router.navigateByUrl('/log-in');
  }
}
