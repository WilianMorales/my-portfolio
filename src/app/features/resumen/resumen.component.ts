import { Component } from '@angular/core';
import { faBusinessTime, faGraduationCap, faIdCardAlt, faIdCardClip } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrl: './resumen.component.css'
})
export class ResumenComponent {
  iconStudy = faGraduationCap;
  iconBusiness = faBusinessTime;
  iconResumen = faIdCardAlt;
}
