import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ContactComponent } from './contact.component';

interface TurnstileRenderOptions {
  sitekey: string;
  callback: (token: string) => void;
}

describe('ContactComponent', () => {
  let httpMock: HttpTestingController;
  let toastrSuccessSpy: ReturnType<typeof vi.fn>;
  let toastrErrorSpy: ReturnType<typeof vi.fn>;
  let toastrWarningSpy: ReturnType<typeof vi.fn>;
  let turnstileCallback: (token: string) => void;
  let contenedorTurnstile: HTMLDivElement;

  beforeEach(async () => {
    toastrSuccessSpy = vi.fn();
    toastrErrorSpy = vi.fn();
    toastrWarningSpy = vi.fn();

    window.turnstile = {
      render: (_container: HTMLElement, options: TurnstileRenderOptions) => {
        turnstileCallback = options.callback;
        return 'widget-id-fake';
      },
      remove: vi.fn()
    };

    contenedorTurnstile = document.createElement('div');
    contenedorTurnstile.id = 'turnstile-container';
    document.body.appendChild(contenedorTurnstile);

    await TestBed.configureTestingModule({
      imports: [ContactComponent, TranslateModule.forRoot()],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ToastrService,
          useValue: {
            success: toastrSuccessSpy,
            error: toastrErrorSpy,
            warning: toastrWarningSpy
          }
        }
      ]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    Reflect.deleteProperty(window, 'turnstile');
    document.getElementById('cf-turnstile-script')?.remove();
    contenedorTurnstile.remove();
  });

  function crear() {
    const fixture = TestBed.createComponent(ContactComponent);
    fixture.detectChanges();
    return fixture;
  }

  function llenarFormularioValido(fixture: ReturnType<typeof crear>) {
    fixture.componentInstance.contactForm.setValue({
      nombre: 'Wilian Morales',
      email: 'wilian@dominio.com',
      mensaje: 'Hola, quiero contactarte para un proyecto interesante.'
    });
  }

  it('debe crearse correctamente', () => {
    const fixture = crear();
    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('validez del formulario', () => {
    it('el formulario debe ser inválido cuando está vacío', () => {
      const fixture = crear();
      expect(fixture.componentInstance.contactForm.invalid).toBe(true);
    });

    it('el campo nombre debe ser inválido si está vacío', () => {
      const fixture = crear();
      const { nombre } = fixture.componentInstance;
      nombre.setValue('');
      expect(nombre.hasError('required')).toBe(true);
    });

    it('el campo email debe marcar error "emailInvalid" con un formato incorrecto', () => {
      const fixture = crear();
      const { email } = fixture.componentInstance;
      email.setValue('correo-no-valido');
      expect(email.errors?.['emailInvalid']).toBe(true);
    });

    it('el campo email debe ser válido con un correo bien formado', () => {
      const fixture = crear();
      const { email } = fixture.componentInstance;
      email.setValue('persona@dominio.com');
      expect(email.valid).toBe(true);
    });

    it('el campo mensaje debe fallar minLength con menos de 10 caracteres útiles', () => {
      const fixture = crear();
      const { mensaje } = fixture.componentInstance;
      mensaje.setValue('corto');
      expect(mensaje.hasError('minLength')).toBe(true);
    });

    it('el campo mensaje debe fallar whitespace si solo contiene espacios', () => {
      const fixture = crear();
      const { mensaje } = fixture.componentInstance;
      mensaje.setValue('             ');
      expect(mensaje.hasError('whitespace')).toBe(true);
    });

    it('el campo mensaje debe fallar el patrón anti SQL-injection con palabras prohibidas', () => {
      const fixture = crear();
      const { mensaje } = fixture.componentInstance;
      mensaje.setValue('quiero hacer un DROP TABLE aqui mismo');
      expect(mensaje.hasError('pattern')).toBe(true);
    });

    it('el formulario debe ser válido con datos correctos', () => {
      const fixture = crear();
      llenarFormularioValido(fixture);
      expect(fixture.componentInstance.contactForm.valid).toBe(true);
    });
  });

  describe('onSubmit', () => {
    it('no debe hacer nada si el formulario es inválido', () => {
      const fixture = crear();
      fixture.componentInstance.onSubmit();
      expect(fixture.componentInstance.isVerifying()).toBe(false);
    });

    it('debe activar isVerifying() y renderizar el widget de Turnstile con datos válidos', () => {
      const fixture = crear();
      llenarFormularioValido(fixture);

      fixture.componentInstance.onSubmit();

      expect(fixture.componentInstance.isVerifying()).toBe(true);
      expect(turnstileCallback).toBeDefined();
    });

    it('debe enviar el mensaje al backend y mostrar éxito cuando Turnstile resuelve el token', () => {
      const fixture = crear();
      llenarFormularioValido(fixture);

      fixture.componentInstance.onSubmit();
      turnstileCallback('token-de-prueba');

      const peticion = httpMock.expectOne('https://send-email.willian-moralesch.workers.dev/');
      expect(peticion.request.method).toBe('POST');
      expect(peticion.request.body).toEqual({
        nombre: 'Wilian Morales',
        email: 'wilian@dominio.com',
        mensaje: 'Hola, quiero contactarte para un proyecto interesante.',
        turnstileToken: 'token-de-prueba'
      });

      peticion.flush({ ok: true });

      expect(fixture.componentInstance.isSubmitting()).toBe(false);
      expect(fixture.componentInstance.isSubmitted()).toBe(true);
      expect(toastrSuccessSpy).toHaveBeenCalledTimes(1);
      expect(fixture.componentInstance.contactForm.pristine).toBe(true);
    });

    it('debe mostrar un warning cuando el backend responde 429 (rate limit)', () => {
      const fixture = crear();
      llenarFormularioValido(fixture);

      fixture.componentInstance.onSubmit();
      turnstileCallback('token-de-prueba');

      const peticion = httpMock.expectOne('https://send-email.willian-moralesch.workers.dev/');
      peticion.flush(
        { message: 'Límite alcanzado' },
        { status: 429, statusText: 'Too Many Requests' }
      );

      expect(toastrWarningSpy).toHaveBeenCalledTimes(1);
      expect(toastrErrorSpy).not.toHaveBeenCalled();
    });

    it('debe mostrar un error genérico cuando el backend falla con otro código', () => {
      const fixture = crear();
      llenarFormularioValido(fixture);

      fixture.componentInstance.onSubmit();
      turnstileCallback('token-de-prueba');

      const peticion = httpMock.expectOne('https://send-email.willian-moralesch.workers.dev/');
      peticion.flush(
        { message: 'Error interno' },
        { status: 500, statusText: 'Internal Server Error' }
      );

      expect(toastrErrorSpy).toHaveBeenCalledTimes(1);
      expect(fixture.componentInstance.isSubmitting()).toBe(false);
    });
  });
});
