import { AfterViewInit, ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { faCheckCircle, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { ContactService } from './contact.service';
import { NgClass } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  emailFormatValidator,
  minLengthTrimmedValidator,
  noWhitespaceValidator,
  NO_SQL_INJECTION_REGEX,
} from './contact-form.validators';

declare global {
  interface Window {
    turnstile: any;
  }
}

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NgClass, FaIconComponent, TranslatePipe]
})
export class ContactComponent implements AfterViewInit {
  private readonly fb = inject(FormBuilder);
  private readonly toastr = inject(ToastrService);
  private readonly translate = inject(TranslateService);
  private readonly contactService = inject(ContactService);

  readonly contactForm = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email, emailFormatValidator]],
    mensaje: ['', [
      Validators.required,
      minLengthTrimmedValidator(10),
      Validators.maxLength(100),
      noWhitespaceValidator,
      Validators.pattern(NO_SQL_INJECTION_REGEX)
    ]]
  });

  readonly iconPlane = faPaperPlane;
  readonly iconSuccess = faCheckCircle;

  readonly isSubmitting = signal(false);
  readonly isSubmitted = signal(false);

  private turnstileToken = '';
  private turnstileWidgetId: any;

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

    if (this.turnstileWidgetId && window.turnstile) {
      window.turnstile.remove(this.turnstileWidgetId);
    }

    this.turnstileWidgetId = window.turnstile.render(container, {
      sitekey: '0x4AAAAAABialvmqysu6WBzx',
      callback: (token: string) => {
        this.turnstileToken = token;
      }
    });
  }

  get nombre() { return this.contactForm.get('nombre')!; }
  get email() { return this.contactForm.get('email')!; }
  get mensaje() { return this.contactForm.get('mensaje')!; }

  onSubmit(): void {
    if (this.contactForm.invalid || !this.turnstileToken) {
      this.toastr.warning('Completa el captcha para continuar.');
      return;
    }

    this.isSubmitting.set(true);
    this.isSubmitted.set(false);

    const datos = {
      nombre: this.nombre.value,
      email: this.email.value,
      mensaje: this.mensaje.value,
      turnstileToken: this.turnstileToken
    };

    this.contactService.enviarMensaje(datos).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.isSubmitted.set(true);
        this.toastr.success(
          this.translate.instant('TOAST.SUCCESS_MESSAGE'),
          this.translate.instant('TOAST.SUCCESS_TITLE')
        );
        setTimeout(() => this.isSubmitted.set(false), 3000);
        this.contactForm.reset();
        this.turnstileToken = '';
        window.turnstile.reset(this.turnstileWidgetId);
      },
      error: (err) => {
        this.isSubmitting.set(false);

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
}
