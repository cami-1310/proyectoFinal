import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroComentariosComponent } from './registro-comentarios.component';

describe('RegistroComentariosComponent', () => {
  let component: RegistroComentariosComponent;
  let fixture: ComponentFixture<RegistroComentariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroComentariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroComentariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
