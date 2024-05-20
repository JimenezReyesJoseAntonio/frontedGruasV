import { TestBed } from '@angular/core/testing';

import { ExcelOperadoresService } from './excel-operadores.service';

describe('ExcelOperadoresService', () => {
  let service: ExcelOperadoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExcelOperadoresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
