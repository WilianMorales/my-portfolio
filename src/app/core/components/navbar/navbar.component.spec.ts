import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  beforeEach(async () => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');

    await TestBed.configureTestingModule({
      imports: [NavbarComponent, TranslateModule.forRoot()],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  function crear() {
    const fixture = TestBed.createComponent(NavbarComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('debe crearse correctamente', () => {
    const fixture = crear();
    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('idioma', () => {
    it('debe iniciar en español por defecto cuando no hay valor guardado en localStorage', () => {
      const fixture = crear();
      expect(fixture.componentInstance.idioma()).toBe('es');
    });

    it('debe respetar el idioma guardado previamente en localStorage', () => {
      localStorage.setItem('idioma', 'en');
      const fixture = crear();
      expect(fixture.componentInstance.idioma()).toBe('en');
    });

    it('cambiarIdioma() debe alternar entre "es" y "en" y persistirlo en localStorage', () => {
      const fixture = crear();
      const componente = fixture.componentInstance;

      expect(componente.idioma()).toBe('es');

      componente.cambiarIdioma();
      expect(componente.idioma()).toBe('en');
      expect(localStorage.getItem('idioma')).toBe('en');

      componente.cambiarIdioma();
      expect(componente.idioma()).toBe('es');
      expect(localStorage.getItem('idioma')).toBe('es');
    });

    it('el botón de idioma debe invocar cambiarIdioma() al hacer click', () => {
      const fixture = crear();
      const spy = vi.spyOn(fixture.componentInstance, 'cambiarIdioma');

      const boton = fixture.nativeElement.querySelector(
        'button[aria-label="nav.changeLanguage"]'
      ) as HTMLButtonElement;
      boton.click();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('modo oscuro', () => {
    it('debe iniciar en modo oscuro por defecto y aplicar la clase "dark" al elemento raíz', () => {
      const fixture = crear();
      expect(fixture.componentInstance.esModoOscuro()).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('debe respetar el modo claro guardado previamente en localStorage', () => {
      localStorage.setItem('modoOscuro', 'false');
      const fixture = crear();
      expect(fixture.componentInstance.esModoOscuro()).toBe(false);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('toggleModoOscuro() debe alternar el estado, persistirlo y actualizar la clase "dark"', () => {
      const fixture = crear();
      const componente = fixture.componentInstance;

      expect(componente.esModoOscuro()).toBe(true);

      componente.toggleModoOscuro();
      expect(componente.esModoOscuro()).toBe(false);
      expect(localStorage.getItem('modoOscuro')).toBe('false');
      expect(document.documentElement.classList.contains('dark')).toBe(false);

      componente.toggleModoOscuro();
      expect(componente.esModoOscuro()).toBe(true);
      expect(localStorage.getItem('modoOscuro')).toBe('true');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('el checkbox de modo oscuro debe invocar toggleModoOscuro() al cambiar', () => {
      const fixture = crear();
      const spy = vi.spyOn(fixture.componentInstance, 'toggleModoOscuro');

      const checkbox = fixture.nativeElement.querySelector(
        'input[type="checkbox"]'
      ) as HTMLInputElement;
      checkbox.dispatchEvent(new Event('change'));

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('menú móvil', () => {
    it('toggleMenu() debe alternar el estado de menuAbierto', () => {
      const fixture = crear();
      const componente = fixture.componentInstance;

      expect(componente.menuAbierto()).toBe(false);
      componente.toggleMenu();
      expect(componente.menuAbierto()).toBe(true);
      componente.toggleMenu();
      expect(componente.menuAbierto()).toBe(false);
    });

    it('cerrarMenu() debe cerrar el menú solo si el click proviene de un enlace <a>', () => {
      const fixture = crear();
      const componente = fixture.componentInstance;
      componente.toggleMenu();
      expect(componente.menuAbierto()).toBe(true);

      const divFalso = document.createElement('div');
      componente.cerrarMenu({ target: divFalso } as unknown as Event);
      expect(componente.menuAbierto()).toBe(true);

      const enlace = document.createElement('a');
      componente.cerrarMenu({ target: enlace } as unknown as Event);
      expect(componente.menuAbierto()).toBe(false);
    });
  });

  describe('isActive', () => {
    it('debe devolver true cuando la ruta coincide con la url actual', () => {
      const fixture = crear();
      expect(fixture.componentInstance.isActive('/')).toBe(true);
    });

    it('debe devolver false cuando la ruta no coincide con la url actual', () => {
      const fixture = crear();
      expect(fixture.componentInstance.isActive('/contact')).toBe(false);
    });
  });
});
