import { AfterViewInit, Component, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { faCheckCircle, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { ContactService } from './contact.service';

declare global {
  interface Window {
    turnstile: any;
  }
}

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styles: []
})
export class ContactComponent implements AfterViewInit {

  contactForm: FormGroup;

  iconPlane = faPaperPlane;
  iconSuccess = faCheckCircle;

  turnstileToken: string = '';
  turnstileWidgetId: any;

  isSubmitting = false;
  isSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private translate: TranslateService,
    private contactService: ContactService
  ) {
    this.contactForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, this.emailValidator]],
      mensaje: ['', [
        Validators.required,
        this.minLengthValidator(10),
        Validators.maxLength(100),
        this.noWhitespaceValidator,
        Validators.pattern(/^(?!.*\b(script|select|insert|delete|update|drop|--|;)\b).*$/i)
      ]]
    });
  }

  ngAfterViewInit(): void {
    this.initTurnstileWithRetry();
  }

  private initTurnstileWithRetry(attempt: number = 0): void {
    const RETRY_DELAY = 500;

    if (typeof window.turnstile === 'undefined') {
      setTimeout(() => this.initTurnstileWithRetry(attempt + 1), RETRY_DELAY);
      return;
    }

    this.renderTurnstile();
  }

  private renderTurnstile(): void {
    const container = document.getElementById('turnstile-container');
    if (!container) return;

    // Limpiar contenedor solo si ya hay un widget
    if (this.turnstileWidgetId && window.turnstile) {
      window.turnstile.remove(this.turnstileWidgetId);
    }

    this.turnstileWidgetId = window.turnstile.render(container, {
      sitekey: '0x4AAAAAABialvmqysu6WBzx',
      callback: (token: string) => {
        this.contactForm.get('turnstileToken')?.setValue(token);
        this.turnstileToken = token;
      }
    });
  }

  get nombre() { return this.contactForm.get('nombre')!; }
  get email() { return this.contactForm.get('email')!; }
  get mensaje() { return this.contactForm.get('mensaje')!; }

  onSubmit() {
    if (this.contactForm.invalid || !this.turnstileToken) {
      this.toastr.warning('Completa el captcha para continuar.');
      return;
    }

    this.isSubmitting = true;
    this.isSubmitted = false;

    const datos = {
      nombre: this.nombre.value,
      email: this.email.value,
      mensaje: this.mensaje.value,
      turnstileToken: this.turnstileToken
    };

    this.contactService.enviarMensaje(datos).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.isSubmitted = true;
        this.toastr.success(
          this.translate.instant('TOAST.SUCCESS_MESSAGE'),
          this.translate.instant('TOAST.SUCCESS_TITLE')
        );
        setTimeout(() => this.isSubmitted = false, 3000);
        this.contactForm.reset();
        this.turnstileToken = '';
        window['turnstile'].reset(this.turnstileWidgetId);
      },
      error: (err) => {
        this.isSubmitting = false;

        if (err.status === 429) {
          this.toastr.warning(err?.error?.message || '⏳ Límite alcanzado', '¡Demasiadas solicitudes!');
          return;
        }

        this.toastr.error(
          err?.error?.message || this.translate.instant('TOAST.ERROR_MESSAGE'),
          this.translate.instant('TOAST.ERROR_TITLE')
        );
      }
    });
  }

  // Validación personalizada para email
  emailValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const email = control.value;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email && !emailRegex.test(email)) {
      return { 'emailInvalid': true };
    }
    return null;
  }

  // Validación personalizada (mínimo 10 caracteres y no solo espacios)
  minLengthValidator(min: number) {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const value = control.value || '';
      if (value.trim().length < min) {
        return { 'minLength': true };
      }
      return null;
    };
  }

  // Validación para evitar solo espacios en blanco
  noWhitespaceValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const value = (control.value || '').toString(); // seguridad extra si el valor no es string
    const isWhitespace = value.trim().length === 0;
    return isWhitespace ? { 'whitespace': true } : null;
  }

}
