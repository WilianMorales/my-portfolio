import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ContactRequest } from './contact-request.interface';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly http = inject(HttpClient);

  enviarMensaje(data: ContactRequest) {
    return this.http.post('https://send-email.willian-moralesch.workers.dev/', data);
  }
}
