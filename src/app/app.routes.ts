import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.page').then( m => m.DashboardPage)
  },
  {
    path: 'adicionar',
    loadComponent: () => import('./adicionar/adicionar.page').then( m => m.AdicionarPage)
  },
  {
    path: 'detalhe/:id',
    loadComponent: () => import('./detalhe/detalhe.page').then( m => m.DetalhePage)
  },
  {
    path: 'editar/:id',
    loadComponent: () => import('./editar/editar.page').then( m => m.EditarPage)
  },
];
