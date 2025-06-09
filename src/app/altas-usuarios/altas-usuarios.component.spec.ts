import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltasUsuariosComponent } from './altas-usuarios.component';

describe('AltasUsuariosComponent', () => {
  let component: AltasUsuariosComponent;
  let fixture: ComponentFixture<AltasUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AltasUsuariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AltasUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
