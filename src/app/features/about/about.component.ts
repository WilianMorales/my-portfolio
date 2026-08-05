import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { faUser, faFileArrowDown, faLaptop } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ResumenComponent } from '../resumen/resumen.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FaIconComponent, ResumenComponent, TranslatePipe, NgOptimizedImage]
})
export class AboutComponent {
  readonly iconFileDown = faFileArrowDown;
  readonly iconLaptop = faLaptop;
  readonly iconUser = faUser;

}
