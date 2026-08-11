import { ChangeDetectionStrategy, Component } from '@angular/core';
import { faBusinessTime, faGraduationCap, faIdCardAlt } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { CertCardComponent } from '@app/shared/components/cert-card/cert-card.component';
import { ResumenCardComponent } from '@app/shared/components/resumen-card/resumen-card.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FaIconComponent, CertCardComponent, ResumenCardComponent, TranslatePipe]
})
export class ResumenComponent {
  readonly iconStudy = faGraduationCap;
  readonly iconBusiness = faBusinessTime;
  readonly iconResumen = faIdCardAlt;
}
