import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  pdflURL = environment.pdfUrl;

  constructor(private http: HttpClient) { }

  generatePdf(id: number): Observable<HttpResponse<Blob>> {
    const url = this.pdflURL+'generate/'+`${id}`;
    console.log('dowload'+url);

    return this.http.get(url, {
      responseType: 'blob',
      observe: 'response'
    });
  }


  generatePdfCarta(id: number): Observable<{ url: string }> {
    return this.http.get<{ url: string }>(`${this.pdflURL}generatepdf/${id}`);
  }

}

