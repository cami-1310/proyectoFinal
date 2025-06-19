import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadBarraComponent } from './load-barra.component';

describe('LoadBarraComponent', () => {
  let component: LoadBarraComponent;
  let fixture: ComponentFixture<LoadBarraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadBarraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadBarraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
