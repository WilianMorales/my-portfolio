import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// o SweetAlert2
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styles: ``
})
export class ContactComponent {

  contactForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
  ) {
    this.contactForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mensaje: ['', Validators.required]
    });
  }

  get nombre() { return this.contactForm.get('nombre')!; }
  get email() { return this.contactForm.get('email')!; }
  get mensaje() { return this.contactForm.get('mensaje')!; }

  onSubmit() {
    if (this.contactForm.invalid) return;

    const data = this.contactForm.value;

    // Reemplazar con tu endpoint real
    this.http.post('https://api.tuservidor.com/contacto', data).subscribe({
      next: () => {
        this.contactForm.reset();
      },
      error: () => {
      }
    });
  }
}
