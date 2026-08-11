import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { faCheckCircle, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { ContactService } from './contact.service';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  emailFormatValidator,
  minLengthTrimmedValidator,
  noWhitespaceValidator,
  NO_SQL_INJECTION_REGEX
} from './contact-form.validators';

interface TurnstileRenderOptions {
  sitekey: string;
  callback: (token: string) => void;
}

interface Turnstile {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile: Turnstile;
  }
}

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NgClass, FaIconComponent, TranslatePipe, NgOptimizedImage]
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);
  private readonly toastr = inject(ToastrService);
  private readonly translate = inject(TranslateService);
  private readonly contactService = inject(ContactService);

  readonly contactForm = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email, emailFormatValidator]],
    mensaje: [
      '',
      [
        Validators.required,
        minLengthTrimmedValidator(10),
        Validators.maxLength(100),
        noWhitespaceValidator,
        Validators.pattern(NO_SQL_INJECTION_REGEX)
      ]
    ]
  });

  readonly iconPlane = faPaperPlane;
  readonly iconSuccess = faCheckCircle;

  readonly isVerifying = signal(false);
  readonly isSubmitting = signal(false);
  readonly isSubmitted = signal(false);

  private turnstileToken = '';
  private turnstileWidgetId?: string;

  get nombre() {
    return this.contactForm.get('nombre')!;
  }
  get email() {
    return this.contactForm.get('email')!;
  }
  get mensaje() {
    return this.contactForm.get('mensaje')!;
  }

  onSubmit(): void {
    if (this.contactForm.invalid || this.isVerifying() || this.isSubmitting()) {
      return;
    }

    this.isVerifying.set(true);
    this.initTurnstileWithRetry();
  }

  private initTurnstileWithRetry(attempt = 0): void {
    const RETRY_DELAY = 150;
    const MAX_ATTEMPTS = 40;

    const container = document.getElementById('turnstile-container');

    if (typeof window.turnstile === 'undefined' || !container) {
      if (attempt >= MAX_ATTEMPTS) {
        this.isVerifying.set(false);
        this.toastr.error(
          this.translate.instant('TOAST.ERROR_MESSAGE'),
          this.translate.instant('TOAST.ERROR_TITLE')
        );
        return;
      }
      setTimeout(() => this.initTurnstileWithRetry(attempt + 1), RETRY_DELAY);
      return;
    }

    this.renderTurnstile(container);
  }

  private renderTurnstile(container: HTMLElement): void {
    this.turnstileWidgetId = window.turnstile.render(container, {
      sitekey: '0x4AAAAAABialvmqysu6WBzx',
      callback: (token: string) => {
        this.turnstileToken = token;
        this.sendMessage();
      }
    });
  }

  private sendMessage(): void {
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
        this.isVerifying.set(false);
        this.isSubmitted.set(true);
        this.toastr.success(
          this.translate.instant('TOAST.SUCCESS_MESSAGE'),
          this.translate.instant('TOAST.SUCCESS_TITLE')
        );
        setTimeout(() => this.isSubmitted.set(false), 3000);
        this.contactForm.reset();
        this.resetTurnstile();
      },
      error: err => {
        this.isSubmitting.set(false);
        this.isVerifying.set(false);
        this.resetTurnstile();

        if (err.status === 429) {
          this.toastr.warning(
            err?.error?.message || '⏳ Límite alcanzado',
            '¡Demasiadas solicitudes!'
          );
          return;
        }

        this.toastr.error(
          err?.error?.message || this.translate.instant('TOAST.ERROR_MESSAGE'),
          this.translate.instant('TOAST.ERROR_TITLE')
        );
      }
    });
  }

  private resetTurnstile(): void {
    this.turnstileToken = '';
    if (this.turnstileWidgetId && window.turnstile) {
      window.turnstile.remove(this.turnstileWidgetId);
    }
    this.turnstileWidgetId = undefined;
  }
}
