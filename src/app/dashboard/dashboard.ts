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

  // Cargar el username de la sesión actual
  loadSessionUser() {
    this.username = JSON.parse(
      (localStorage.getItem('user') || sessionStorage.getItem('user'))!
    ).username;
  }

  logout() {
    this.authStateService.logOut();
    this.router.navigateByUrl('/log-in');
  }
}
