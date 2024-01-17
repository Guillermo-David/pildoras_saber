import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtiquetaListComponent } from './etiqueta-list.component';

describe('EtiquetaListComponent', () => {
  let component: EtiquetaListComponent;
  let fixture: ComponentFixture<EtiquetaListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EtiquetaListComponent]
    });
    fixture = TestBed.createComponent(EtiquetaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
