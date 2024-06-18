import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaServicioComponent } from './busqueda-servicio.component';

describe('BusquedaServicioComponent', () => {
  let component: BusquedaServicioComponent;
  let fixture: ComponentFixture<BusquedaServicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BusquedaServicioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BusquedaServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
