import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ContactService {

  constructor(private http: HttpClient) {}

  enviarMensaje(data: any) {
    return this.http.post('https://message-store-api.up.railway.app/api/contact', data);
  }
}
