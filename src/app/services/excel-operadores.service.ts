import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExcelOperadoresService {

  excelURL = environment.excelOpeURL;

  constructor(private httpClient: HttpClient) { }

  downloadExcel() {
    return this.httpClient.get(this.excelURL, { responseType: 'blob' });
  }
}
