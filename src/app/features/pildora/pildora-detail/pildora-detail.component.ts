import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Environment } from 'src/app/environment/environment';
import { PagedResponse } from 'src/app/interfaces/paged-response';
import { Etiqueta } from 'src/app/models/etiqueta';
import { forkJoin } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CrearEtiquetaComponent } from '../../crear-etiqueta/crear-etiqueta.component';
import { PildoraService } from 'src/app/services/pildora-service';
import { ActivatedRoute, Router } from '@angular/router';
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
    private route: ActivatedRoute,
    private toastService: ToastService,
  ) {
    this.pildoraForm = this.fb.group({
      titulo: ['', Validators.required],
      etiquetas: this.fb.array([]),
      contenido: ['', Validators.required]
    });
  }

  ngOnInit(): void {

    this.pildoraForm = this.fb.group({
      titulo: ['', Validators.required],
      etiquetas: this.fb.array([]),
      contenido: ['', Validators.required]
    });

    this.getOtros();

    this.route.paramMap.subscribe(params => {


      const pildoraIdStr = params.get('id');
      const pildoraId = pildoraIdStr ? +pildoraIdStr : 0; // 0 o cualquier valor por defecto

      if (pildoraId > 0) {
        // Cargar y rellenar el formulario con los datos de la píldora existente
        this.pildoraService.getPildora(pildoraId).subscribe(pildora => {
          this.pildoraForm.patchValue({
            titulo: pildora.titulo,
            contenido: pildora.contenido
          });
          const etiquetasFormArray = this.pildoraForm.get('etiquetas') as FormArray;
          etiquetasFormArray.clear(); // Limpia cualquier valor existente

          // etiquetasFormArray.setValue([1]);
          // etiquetasFormArray.push(this.fb.control(1));
          pildora.etiquetas.forEach(etiqueta => {
            etiquetasFormArray.push(this.fb.control(etiqueta.id));
          });
        });
      } else {
        // Opcional: Preparar el formulario para una nueva píldora
        this.pildoraForm.reset();
        // O establecer valores predeterminados si es necesario
        this.pildoraForm.patchValue({
          titulo: '',
          contenido: ''
        });
        // Asegúrate de que el FormArray para etiquetas esté vacío o configurado con valores predeterminados
        const etiquetasFormArray = this.pildoraForm.get('etiquetas') as FormArray;
        etiquetasFormArray.clear();
      }
    });
  }

  compararEtiquetas(etiqueta1: any, etiqueta2: any): boolean {
    return etiqueta1 && etiqueta2 ? etiqueta1.id === etiqueta2.id : etiqueta1 === etiqueta2;
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

