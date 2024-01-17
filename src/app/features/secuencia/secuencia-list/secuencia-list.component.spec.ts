import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecuenciaListComponent } from './secuencia-list.component';

describe('SecuenciaListComponent', () => {
  let component: SecuenciaListComponent;
  let fixture: ComponentFixture<SecuenciaListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SecuenciaListComponent]
    });
    fixture = TestBed.createComponent(SecuenciaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
