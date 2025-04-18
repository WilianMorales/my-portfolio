import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cert-card',
  templateUrl: './cert-card.component.html',
  styleUrls: ['./cert-card.component.css'],
})
export class CertCardComponent {
  @Input() certificado: any;
  @Input() viewCredText: string = '';
}
