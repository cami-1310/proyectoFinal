import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchLocalComponent } from './switch-local.component';

describe('SwitchLocalComponent', () => {
  let component: SwitchLocalComponent;
  let fixture: ComponentFixture<SwitchLocalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchLocalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwitchLocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
