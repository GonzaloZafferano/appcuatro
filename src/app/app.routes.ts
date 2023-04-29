import { Routes } from '@angular/router';
import { HomePage } from './home/home.page';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';

export const routes: Routes = [  
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  }, 
  {
    path: 'registro',
    loadComponent: () => import('./components/registro/registro.component').then((m) => m.RegistroComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'splash',
    loadComponent: () => import('./splash/splash.page').then( m => m.SplashPage)
  },
  {
    path: 'facil',
    loadComponent: () => import('./components/facil/facil.component').then( m => m.FacilComponent)
  },
  {
    path: 'ganadorfacil',
    loadComponent: () => import('./components/listafacil/listafacil.component').then( m => m.ListafacilComponent)
  },
  {
    path: 'medio',
    loadComponent: () => import('./components/medio/medio.component').then( m => m.MedioComponent)
  },
  {
    path: 'dificil',
    loadComponent: () => import('./components/dificil/dificil.component').then( m => m.DificilComponent)
  },
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full',
  },
  {
    path: 'error',
    loadComponent: () => import('./components/error/error.component').then((m) => m.ErrorComponent),
  },
  {
    path: '**',
    redirectTo: '/error'
  },
];
