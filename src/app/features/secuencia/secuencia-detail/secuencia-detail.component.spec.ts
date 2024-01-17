import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecuenciaDetailComponent } from './secuencia-detail.component';

describe('SecuenciaDetailComponent', () => {
  let component: SecuenciaDetailComponent;
  let fixture: ComponentFixture<SecuenciaDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SecuenciaDetailComponent]
    });
    fixture = TestBed.createComponent(SecuenciaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
