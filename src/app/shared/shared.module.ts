import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ProjectCardComponent } from './components/project-card/project-card.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { CertCardComponent } from './components/cert-card/cert-card.component';
import { NoimagePipe } from './pipe/noimage.pipe';


@NgModule({
  declarations: [
    ProjectCardComponent,
    CertCardComponent,
    NoimagePipe
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    TranslateModule,
    NgOptimizedImage
  ],
  exports: [
    ProjectCardComponent,
    CertCardComponent
  ]
})
export class SharedModule { }
