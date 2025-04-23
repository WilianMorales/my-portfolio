import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { faSun, faMoon, faBars, faTimes, faUser, faHome, faBriefcase, faCode, faTerminal, faIdCard, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface Menu {
  path: string;
  icon: IconProp;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  idioma: string = 'es';

  // Iconos de FontAwesome
  iconBars = faBars;
  iconTimes = faTimes;
  iconSol = faSun;
  iconLuna = faMoon;

  menuLinks: Menu[] = [
    { path: '/home', icon: faHome },
    { path: '/about-me', icon: faUser },
    { path: '/skills', icon: faCode },
    { path: '/projects', icon: faBriefcase },
    { path: '/contact', icon: faEnvelope }
  ];

  esModoOscuro: boolean = false;
  menuAbierto: boolean = false;

  constructor(private translate: TranslateService, private router: Router) {
    this.idioma = localStorage.getItem('idioma') || 'es';
    this.translate.use(this.idioma);
    this.esModoOscuro = localStorage.getItem('modoOscuro') === 'true';
    this.aplicarModoOscuro();
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  cambiarIdioma() {
    this.idioma = this.idioma === 'es' ? 'en' : 'es';
    this.translate.use(this.idioma);
    localStorage.setItem('idioma', this.idioma);
  }

  toggleModoOscuro() {
    this.esModoOscuro = !this.esModoOscuro;
    localStorage.setItem('modoOscuro', this.esModoOscuro.toString());
    this.aplicarModoOscuro();
  }

  aplicarModoOscuro() {
    if (this.esModoOscuro) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
  cerrarMenu(event: Event) {
    // Verifica si el clic ocurrió en un <a>
    const target = event.target as HTMLElement;
    if (target.tagName === 'A' || target.closest('a')) {
      this.menuAbierto = false;
    }
  }

}
