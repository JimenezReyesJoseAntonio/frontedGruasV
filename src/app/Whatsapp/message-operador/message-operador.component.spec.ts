import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageOperadorComponent } from './message-operador.component';

describe('MessageOperadorComponent', () => {
  let component: MessageOperadorComponent;
  let fixture: ComponentFixture<MessageOperadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MessageOperadorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MessageOperadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
