
import { Routes } from '@angular/router';

import { Signup } from './signup/signup';
import { Login } from './login/login';
import { Profile } from './profile/profile';
import { Employees } from './employees/employees';

import { authGuard } from './guards/auth.guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'signup',
    component: Signup
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: 'employees',
    component: Employees,
    canActivate: [authGuard]
  },

  {
    path: 'profile',
    component: Profile,
    canActivate: [authGuard]
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];
