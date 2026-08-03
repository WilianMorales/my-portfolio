import { Component } from '@angular/core';
import { faBusinessTime, faGraduationCap, faIdCardAlt } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgFor } from '@angular/common';
import { CertCardComponent } from '../../shared/components/cert-card/cert-card.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styles: [],
  imports: [FaIconComponent, NgFor, CertCardComponent, TranslatePipe]
})
export class ResumenComponent {
  iconStudy = faGraduationCap;
  iconBusiness = faBusinessTime;
  iconResumen = faIdCardAlt;
}
