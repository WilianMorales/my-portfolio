import { ChangeDetectionStrategy, Component } from '@angular/core';
import { faBusinessTime, faGraduationCap, faIdCardAlt } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { CertCardComponent } from '../../shared/components/cert-card/cert-card.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FaIconComponent, CertCardComponent, TranslatePipe]
})
export class ResumenComponent {
  readonly iconStudy = faGraduationCap;
  readonly iconBusiness = faBusinessTime;
  readonly iconResumen = faIdCardAlt;
}
