import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import LogIn from './auth/features/log-in/log-in';
import SignUp from './auth/features/sign-up/sign-up';
import { Dashboard } from './dashboard/dashboard';
import { privateGuard, publicGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'log-in',
    canActivate: [publicGuard()],
    component: LogIn,
  },
  {
    path: 'sign-up',
    canActivate: [publicGuard()],
    component: SignUp,
  },
  {
    path: 'dashboard',
    canActivate: [privateGuard()],
    component: Dashboard, // usar component directamente
  },
  { path: '', redirectTo: 'log-in', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
