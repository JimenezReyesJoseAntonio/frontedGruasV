import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { API } from '../common/api-resource';
import { HttpClient } from '@angular/common/http';
import { WhatsappCloudAPIRequest } from '../Whatsapp/interfaces/whatsapp-cloud-api-request.interface';
import { Observable } from 'rxjs';
import { WhatsappCloudAPIResponse } from '../Whatsapp/interfaces/whatsapp-cloud-api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class WhatsappApiCloudService {

  private apiUrl = environment.apiUrl + API.consumeTemplate;

  constructor(private http: HttpClient) { }

  sendMessage(whatsappCloudApiRequest: WhatsappCloudAPIRequest): Observable<WhatsappCloudAPIResponse> {
    console.log(whatsappCloudApiRequest);
    return this.http.post<WhatsappCloudAPIResponse>(this.apiUrl, whatsappCloudApiRequest);
  }
  



}
