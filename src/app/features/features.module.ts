import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { SkillsComponent } from './skills/skills.component';
import { ProjectsComponent } from './projects/projects.component';
import { SharedModule } from '../shared/shared.module';
import { ResumenComponent } from './resumen/resumen.component';
import { ContactComponent } from './contact/contact.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HomeComponent,
    AboutComponent,
    SkillsComponent,
    ProjectsComponent,
    ResumenComponent,
    ContactComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FontAwesomeModule,
    RouterModule.forChild([
      { path: 'home', component: HomeComponent },
      { path: 'about-me', component: AboutComponent },
      { path: 'skills', component: SkillsComponent },
      { path: 'portfolio', component: ProjectsComponent },
      { path: 'contact', component: ContactComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]),
    SharedModule,
    NgOptimizedImage,
    ReactiveFormsModule
  ]
})
export class FeaturesModule { }
