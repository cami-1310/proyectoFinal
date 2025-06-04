import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltasPruebaComponent } from './altas-prueba.component';

describe('AltasPruebaComponent', () => {
  let component: AltasPruebaComponent;
  let fixture: ComponentFixture<AltasPruebaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AltasPruebaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AltasPruebaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
