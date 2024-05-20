import { TestBed } from '@angular/core/testing';

import { ExcelGruasService } from './excel-gruas.service';

describe('ExcelGruasService', () => {
  let service: ExcelGruasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExcelGruasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
