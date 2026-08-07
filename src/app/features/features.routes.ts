import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { SkillsComponent } from './skills/skills.component';
import { ProjectsComponent } from './projects/projects.component';
import { ContactComponent } from './contact/contact.component';

export const FEATURES_ROUTES: Routes = [
  { path: 'home', component: HomeComponent, data: { seo: 'home' } },
  { path: 'about-me', component: AboutComponent, data: { seo: 'about' } },
  { path: 'skills', component: SkillsComponent, data: { seo: 'skills' } },
  { path: 'projects', component: ProjectsComponent, data: { seo: 'projects' } },
  { path: 'contact', component: ContactComponent, data: { seo: 'contact' } },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];
