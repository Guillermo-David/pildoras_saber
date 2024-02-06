import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Environment } from 'src/app/environment/environment';
import { PagedResponse } from 'src/app/interfaces/paged-response';
import { Etiqueta } from 'src/app/models/etiqueta';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-pildora-detail',
  templateUrl: './pildora-detail.component.html',
  styleUrls: ['./pildora-detail.component.css'],
})
export class PildoraDetailComponent implements AfterViewInit {

  pildoraForm!: FormGroup;
  etiquetas: Etiqueta[] = [];

  newPildoraTitulo: string = '';
  newPildoraContenido: string = '';
  newPildoraEtiquetas: Etiqueta[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient) {
    this.pildoraForm = this.fb.group({
      titulo: ['', Validators.required],
      etiqueta: [null, Validators.required],
      contenido: ['', Validators.required]
    });
  }

  ngOnInit(): void {

    this.pildoraForm = this.fb.group({
      titulo: ['', Validators.required],
      etiquetas: [[], null],
      contenido: ['', Validators.required]
    });
    this.getOtros();

    // Cargar las etiquetas para el dropdown aquí
    this.etiquetas = [
      // ... tus etiquetas
    ];
  }

  ngAfterViewInit(): void {
    
  }

  onSubmit() {
    if (this.pildoraForm.valid) {
      // Procesa los datos del formulario
      console.log(this.pildoraForm.value);
    }
  }

  getOtros() {
    const etiquetas$ = this.http.get<PagedResponse>(`${Environment.apiUrl}/etiquetas?page=0&size=-1&sortBy=nombre&sortOrder=asc`);

    forkJoin([etiquetas$]).subscribe((responses) => {
      this.etiquetas = responses[0].data;
    });
  }
}

