import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetpswdComponent } from './resetpswd.component';

describe('ResetpswdComponent', () => {
  let component: ResetpswdComponent;
  let fixture: ComponentFixture<ResetpswdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetpswdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetpswdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
