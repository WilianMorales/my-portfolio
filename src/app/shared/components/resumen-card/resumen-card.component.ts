import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ResumenItem } from '@app/shared/models/resumen-item.interface';

@Component({
  selector: 'app-resumen-card',
  templateUrl: './resumen-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumenCardComponent {
  readonly item = input.required<ResumenItem>();
}
