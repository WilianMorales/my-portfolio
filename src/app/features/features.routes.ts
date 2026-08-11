import { Routes } from '@angular/router';

export const FEATURES_ROUTES: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
    data: { seo: 'home' }
  },
  {
    path: 'about-me',
    loadComponent: () => import('./about/about.component').then(m => m.AboutComponent),
    data: { seo: 'about' }
  },
  {
    path: 'skills',
    loadComponent: () => import('./skills/skills.component').then(m => m.SkillsComponent),
    data: { seo: 'skills' }
  },
  {
    path: 'projects',
    loadComponent: () => import('./projects/projects.component').then(m => m.ProjectsComponent),
    data: { seo: 'projects' }
  },
  {
    path: 'contact',
    loadComponent: () => import('./contact/contact.component').then(m => m.ContactComponent),
    data: { seo: 'contact' }
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];
