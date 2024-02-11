import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearEtiquetaComponent } from './crear-etiqueta.component';

describe('CrearEtiquetaComponent', () => {
  let component: CrearEtiquetaComponent;
  let fixture: ComponentFixture<CrearEtiquetaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearEtiquetaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrearEtiquetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
