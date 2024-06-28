import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CotizacionPdfService {

  pdfCotizacion = environment.pdfCotizacion;

  constructor(private http: HttpClient) { }


  generatePdfCotizacion(id: number): Observable<{ url: string }> {
    return this.http.get<{ url: string }>(`${this.pdfCotizacion}generatepdf/${id}`);
  }

}
