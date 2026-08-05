import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Certificado } from '../../interfaces/certificado.interface';

@Component({
  selector: 'app-cert-card',
  templateUrl: './cert-card.component.html',
  styleUrls: ['./cert-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertCardComponent {
  readonly certificado = input.required<Certificado>();
  readonly viewCredText = input('');
}
