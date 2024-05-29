import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ExcelServiciosService } from '../../services/excel-servicios.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-excel-servicios',
  templateUrl: './excel-servicios.component.html',
  styleUrl: './excel-servicios.component.css',
  providers: [MessageService]

})
export class ExcelServiciosComponent implements OnInit  {
  form: FormGroup;
  startDate: string;
  endDate: string;
  day: string;


  constructor(
    private fb: FormBuilder,
     private excelService: ExcelServiciosService,
     private messageService: MessageService,
    ) {
    this.form = this.fb.group({
      dateOption: ['day'],
      day: [''],
      startDate: [''],
      endDate: ['']
    });
  }
  ngOnInit(): void {
  }

  exportarExcel(day?: string, startDate?: string, endDate?: string) {
    const params = { day, startDate, endDate };
    this.excelService.downloadExcel(params).subscribe((response: Blob) => {
      const url = window.URL.createObjectURL(response);
      const a = document.createElement('a');
      a.href = url;
      // Asignar nombre al archivo basado en los parámetros
      let filename = 'servicios.xlsx';
      if (day) {
        filename = `servicios_${day}.xlsx`;
      } else if (startDate && endDate) {
        filename = `servicios_${startDate}_to_${endDate}.xlsx`;
      }
      a.download = filename;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Error downloading the file', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ingrese la fecha' });
    });
  }


}
