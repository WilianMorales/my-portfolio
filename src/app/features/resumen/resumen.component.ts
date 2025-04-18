import { Component } from '@angular/core';
import { faBusinessTime, faGraduationCap, faIdCardAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styles: ''
})
export class ResumenComponent {
  iconStudy = faGraduationCap;
  iconBusiness = faBusinessTime;
  iconResumen = faIdCardAlt;
}
