import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private servicioCreadoSource = new Subject<void>();

  servicioCreado$ = this.servicioCreadoSource.asObservable();

  emitServicioCreado(): void {
    this.servicioCreadoSource.next();
  }
}
