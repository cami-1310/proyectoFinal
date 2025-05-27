import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PadreBusquedaComponent } from './padre-busqueda.component';

describe('PadreBusquedaComponent', () => {
  let component: PadreBusquedaComponent;
  let fixture: ComponentFixture<PadreBusquedaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PadreBusquedaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PadreBusquedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
