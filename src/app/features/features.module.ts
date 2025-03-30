import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';

import { FeaturesComponent } from './features.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { SkillsComponent } from './skills/skills.component';

@NgModule({
  declarations: [
    FeaturesComponent,
    HomeComponent,
    AboutComponent,
    SkillsComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FontAwesomeModule,
    RouterModule.forChild([
      { path: 'home', component: HomeComponent },
      { path: 'about-me', component: AboutComponent },
      { path: 'skills', component: SkillsComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ])
  ]
})
export class FeaturesModule { }
