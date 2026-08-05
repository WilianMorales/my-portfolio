import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FaIconComponent, TranslatePipe, NgOptimizedImage]
})
export class HomeComponent {
  readonly iconCode = faCode;
  readonly iconLinkedin = faLinkedin;
  readonly iconGithub = faGithub;
}
