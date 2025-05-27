import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaAPIComponent } from './vista-api.component';

describe('VistaAPIComponent', () => {
  let component: VistaAPIComponent;
  let fixture: ComponentFixture<VistaAPIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VistaAPIComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VistaAPIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
