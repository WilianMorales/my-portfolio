import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { faSun, faMoon, faBars, faTimes, faUser, faHome, faBriefcase, faCode, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgClass } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

export interface Menu {
  path: string;
  icon: IconProp;
  labelKey: string;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FaIconComponent, RouterLink, NgClass, TranslatePipe]
})
export class NavbarComponent {
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);

  readonly iconBars = faBars;
  readonly iconTimes = faTimes;
  readonly iconSol = faSun;
  readonly iconLuna = faMoon;

  readonly menuLinks: Menu[] = [
    { path: '/home', icon: faHome, labelKey: 'nav.home' },
    { path: '/about-me', icon: faUser, labelKey: 'nav.about' },
    { path: '/skills', icon: faCode, labelKey: 'nav.skills' },
    { path: '/projects', icon: faBriefcase, labelKey: 'nav.projects' },
    { path: '/contact', icon: faEnvelope, labelKey: 'nav.contact' }
  ];

  readonly idioma = signal(localStorage.getItem('idioma') || 'es');
  readonly esModoOscuro = signal(localStorage.getItem('modoOscuro') !== 'false');
  readonly menuAbierto = signal(false);

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.router.url)
    ),
    { initialValue: this.router.url }
  );

  constructor() {
    this.translate.use(this.idioma());
    this.aplicarModoOscuro();
  }

  isActive(path: string): boolean {
    return this.currentUrl() === path;
  }

  toggleMenu(): void {
    this.menuAbierto.update(abierto => !abierto);
  }

  cambiarIdioma(): void {
    const nuevoIdioma = this.idioma() === 'es' ? 'en' : 'es';
    this.idioma.set(nuevoIdioma);
    this.translate.use(nuevoIdioma);
    localStorage.setItem('idioma', nuevoIdioma);
  }

  toggleModoOscuro(): void {
    this.esModoOscuro.update(oscuro => !oscuro);
    localStorage.setItem('modoOscuro', this.esModoOscuro().toString());
    this.aplicarModoOscuro();
  }

  private aplicarModoOscuro(): void {
    if (this.esModoOscuro()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  cerrarMenu(event: Event): void {
    const target = event.target as HTMLElement;
    if (target.tagName === 'A' || target.closest('a')) {
      this.menuAbierto.set(false);
    }
  }
}
