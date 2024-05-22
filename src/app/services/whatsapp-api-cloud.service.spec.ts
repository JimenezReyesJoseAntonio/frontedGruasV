import { TestBed } from '@angular/core/testing';

import { WhatsappApiCloudService } from './whatsapp-api-cloud.service';

describe('WhatsappApiCloudService', () => {
  let service: WhatsappApiCloudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WhatsappApiCloudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
