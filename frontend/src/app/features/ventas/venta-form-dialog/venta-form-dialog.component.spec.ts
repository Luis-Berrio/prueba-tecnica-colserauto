import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentaFormDialogComponent } from './venta-form-dialog.component';

describe('VentaFormDialogComponent', () => {
  let component: VentaFormDialogComponent;
  let fixture: ComponentFixture<VentaFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentaFormDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentaFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
