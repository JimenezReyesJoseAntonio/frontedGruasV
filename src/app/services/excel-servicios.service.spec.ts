import { TestBed } from '@angular/core/testing';

import { ExcelServiciosService } from './excel-servicios.service';

describe('ExcelServiciosService', () => {
  let service: ExcelServiciosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExcelServiciosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
