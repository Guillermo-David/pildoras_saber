import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtiquetaDetailComponent } from './etiqueta-detail.component';

describe('EtiquetaDetailComponent', () => {
  let component: EtiquetaDetailComponent;
  let fixture: ComponentFixture<EtiquetaDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EtiquetaDetailComponent]
    });
    fixture = TestBed.createComponent(EtiquetaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
