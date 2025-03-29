import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';

import { FeaturesComponent } from './features.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [
    HomeComponent,
    AboutComponent,
    FeaturesComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FontAwesomeModule,
    RouterModule.forChild([
      { path: 'home', component: HomeComponent },
      { path: 'about-me', component: AboutComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ])
  ]
})
export class FeaturesModule { }
