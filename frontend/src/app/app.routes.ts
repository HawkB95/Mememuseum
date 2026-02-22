import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
    title: 'MEMEMUSEUM - Home'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent),
    title: 'MEMEMUSEUM - Login'
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent),
    title: 'MEMEMUSEUM - Registrazione'
  },
  {
    path: 'upload',
    loadComponent: () => import('./components/upload/upload.component').then(m => m.UploadComponent),
    title: 'MEMEMUSEUM - Carica Meme',
    canActivate: [authGuard]
  },
  {
    path: 'meme/:id',
    loadComponent: () => import('./components/meme-detail/meme-detail.component').then(m => m.MemeDetailComponent),
    title: 'MEMEMUSEUM - Dettaglio Meme'
  },
  {
    path: 'meme-of-the-day',
    loadComponent: () => import('./components/meme-of-the-day/meme-of-the-day.component').then(m => m.MemeOfTheDayComponent),
    title: 'MEMEMUSEUM - Meme del Giorno'
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];