import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { faCheckCircle, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { ContactService } from './contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styles: []
})
export class ContactComponent {

  contactForm: FormGroup;

  iconPlane = faPaperPlane;
  iconSuccess = faCheckCircle;

  isSubmitting = false;
  isSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private translate: TranslateService,
    private recaptchaV3Service: ReCaptchaV3Service,
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

  get nombre() { return this.contactForm.get('nombre')!; }
  get email() { return this.contactForm.get('email')!; }
  get mensaje() { return this.contactForm.get('mensaje')!; }

  onSubmit() {
    if (this.contactForm.invalid) return;

    this.isSubmitting = true;
    this.isSubmitted = false;

    // Ejecutar reCAPTCHA v3 antes de enviar
    this.recaptchaV3Service.execute('submit')
      .subscribe({
        next: (token) => {
          this.enviarFormularioFinal(token);
        },
        error: (err) => {
          console.error('Error en reCAPTCHA', err);
          this.isSubmitting = false;
          this.toastr.error('Error al verificar el captcha');
        }
      });
  }

  enviarFormularioFinal(recaptchaToken: string) {
    const datos = {
      nombre: this.nombre.value,
      email: this.email.value,
      mensaje: this.mensaje.value,
      recaptchaToken: recaptchaToken
    };

    this.contactService.enviarMensaje(datos).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.isSubmitted = true;

        const title = this.translate.instant('TOAST.SUCCESS_TITLE');
        const message = this.translate.instant('TOAST.SUCCESS_MESSAGE');

        this.toastr.success(message, title);

        setTimeout(() => this.isSubmitted = false, 3000);
        this.contactForm.reset();
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error enviando formulario', err);

        // Asegúrate de loguear el error para que sea más fácil de identificar
        console.log("Detalles del error:", err);

        const title = this.translate.instant('TOAST.ERROR_TITLE');
        const message = this.translate.instant('TOAST.ERROR_MESSAGE');

        this.toastr.error(`${message} - ${err.message}`, title);  // Mostrar el mensaje de error de la respuesta
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
