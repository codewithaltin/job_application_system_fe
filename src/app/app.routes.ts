import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { ApplicantsListComponent } from './components/applicants-list/applicants-list.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { authGuard } from './guards/auth.guard';
import { EmployerProfileComponent } from './components/employer-profile/employer-profile.component';
import { ApplicantProfileComponent } from './components/applicant-profile/applicant-profile.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent, canActivate: [authGuard] },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
        children: [
          { path: 'applicants-list', component: ApplicantsListComponent },
        ],
      },
      {
        path: 'profile/applicant/:id',
        component: ApplicantProfileComponent,
      },
      {
        path: 'profile/employer/:id',
        component: EmployerProfileComponent,
      },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
