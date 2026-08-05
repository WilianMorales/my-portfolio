import { ChangeDetectionStrategy, Component } from '@angular/core';
import { faTerminal } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FaIconComponent, TranslatePipe]
})
export class FooterComponent {
  readonly currentYear: number = new Date().getFullYear();
  readonly name: string = 'Wilian Morales';
  readonly iconTerminal = faTerminal;
}
