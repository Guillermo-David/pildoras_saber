import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PildoraDetailComponent } from './pildora-detail.component';

describe('PildoraDetailComponent', () => {
  let component: PildoraDetailComponent;
  let fixture: ComponentFixture<PildoraDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PildoraDetailComponent]
    });
    fixture = TestBed.createComponent(PildoraDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
