import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PildoraListComponent } from './pildora-list.component';

describe('PildoraListComponent', () => {
  let component: PildoraListComponent;
  let fixture: ComponentFixture<PildoraListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PildoraListComponent]
    });
    fixture = TestBed.createComponent(PildoraListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
