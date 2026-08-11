import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import {
  faCertificate,
  faBookOpen,
  faArrowUpRightFromSquare
} from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Certificado } from '@app/shared/models/certificado.interface';

@Component({
  selector: 'app-cert-card',
  templateUrl: './cert-card.component.html',
  styleUrls: ['./cert-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FaIconComponent]
})
export class CertCardComponent {
  readonly certificado = input.required<Certificado>();
  readonly viewCredText = input('');

  readonly iconViewCred = faArrowUpRightFromSquare;

  private readonly certificationKeywords = ['certif'];

  readonly isCertification = computed(() =>
    this.certificationKeywords.some(keyword =>
      this.certificado().tipo.toLowerCase().includes(keyword)
    )
  );

  readonly typeIcon = computed(() => (this.isCertification() ? faCertificate : faBookOpen));
}
