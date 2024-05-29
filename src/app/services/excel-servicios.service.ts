import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExcelServiciosService {
  excelURL = environment.excelServicios;

  constructor(private httpClient: HttpClient) { }

  downloadExcel(params: { day?: string, startDate?: string, endDate?: string }) {
    let queryParams = '';
    if (params.day) {
      queryParams = `?day=${params.day}`;
    } else if (params.startDate && params.endDate) {
      queryParams = `?startDate=${params.startDate}&endDate=${params.endDate}`;
    }
    console.log(`${this.excelURL}${queryParams}`);

    return this.httpClient.get(`${this.excelURL}${queryParams}`, { responseType: 'blob' });
  }
}
