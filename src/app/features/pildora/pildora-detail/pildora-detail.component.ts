import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Environment } from 'src/app/environment/environment';
import { PagedResponse } from 'src/app/interfaces/paged-response';
import { Etiqueta } from 'src/app/models/etiqueta';
import { forkJoin } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CrearEtiquetaComponent } from '../../crear-etiqueta/crear-etiqueta.component';
import { PildoraService } from 'src/app/services/pildora-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast-service';


@Component({
  selector: 'app-pildora-detail',
  templateUrl: './pildora-detail.component.html',
  styleUrls: ['./pildora-detail.component.css'],
})
export class PildoraDetailComponent implements OnInit, AfterViewInit {

  pildoraForm!: FormGroup;
  etiquetas: Etiqueta[] = [];

  newPildoraTitulo: string = '';
  newPildoraContenido: string = '';
  newPildoraEtiquetas: Etiqueta[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public dialog: MatDialog,
    private pildoraService: PildoraService,
    private router: Router,
    private toastService: ToastService
  ) {
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

      const formData = this.pildoraForm.value;
      const pildoraData = {
        titulo: formData.titulo,
        contenido: formData.contenido,
        etiquetas: formData.etiquetas
        // etiquetas: formData.etiquetas.map((id: number) => ({ id }))
      };

      this.pildoraService.createPildora(pildoraData).subscribe({
        next: (nuevaPildora) => {
          console.log('Píldora creada con éxito:', nuevaPildora);
          this.toastService.showToast('Píldora creada con éxito');
          // Limpia el formulario
          this.resetFormulario();
        },
        error: (error) => {
          this.toastService.showToast('Error al crear la píldora: ' + error);
        }
      });
    }
  }


  getOtros() {
    const etiquetas$ = this.http.get<PagedResponse>(`${Environment.apiUrl}/etiquetas?page=0&size=-1&sortBy=nombre&sortOrder=asc`);

    forkJoin([etiquetas$]).subscribe((responses) => {
      this.etiquetas = responses[0].data;
    });
  }

  abrirModalCrearEtiqueta() {
    const dialogRef = this.dialog.open(CrearEtiquetaComponent, {
      // width: '250px',
      // puedes pasar datos también si es necesario
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.getOtros();
    });
  }

  cancelarFormulario() {
    this.router.navigateByUrl('/');
  }

  resetFormulario() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}

