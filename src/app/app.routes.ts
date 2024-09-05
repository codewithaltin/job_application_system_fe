import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { ApplicantsListComponent } from './components/applicants-list/applicants-list.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { authGuard } from './guards/auth.guard';
import { CreateJobListingComponent } from './components/create-job-listing/create-job-listing.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
        children: [
          { path: 'applicants-list', component: ApplicantsListComponent },
          { path: 'create-job-listing', component: CreateJobListingComponent },
        ],
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
    ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
