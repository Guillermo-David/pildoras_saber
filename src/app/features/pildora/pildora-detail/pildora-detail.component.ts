import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Environment } from 'src/app/environment/environment';
import { PagedResponse } from 'src/app/interfaces/paged-response';
import { Etiqueta } from 'src/app/models/etiqueta';
import { forkJoin, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CrearEtiquetaComponent } from '../../crear-etiqueta/crear-etiqueta.component';
import { PildoraService } from 'src/app/services/pildora-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast-service';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-pildora-detail',
  templateUrl: './pildora-detail.component.html',
  styleUrls: ['./pildora-detail.component.css'],
})
export class PildoraDetailComponent implements OnInit, AfterViewInit {
  @ViewChild('editor') editor!: ElementRef;

  pildoraForm!: FormGroup;
  etiquetas: Etiqueta[] = [];

  newPildoraTitulo: string = '';
  newPildoraContenido: string = '';
  newPildoraEtiquetas: Etiqueta[] = [];

  inicioSeleccion: number = 0;
  finSeleccion: number = 0;


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public dialog: MatDialog,
    private pildoraService: PildoraService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
  ) { }

  ngOnInit(): void {

    this.pildoraForm = this.fb.group({
      titulo: ['', Validators.required],
      etiquetas: this.fb.array([]),
      contenido: ['', Validators.required]
    });

    this.getOtros();

    this.route.paramMap.pipe(
      switchMap(params => {
        const pildoraIdStr = params.get('id');
        const pildoraId = pildoraIdStr ? +pildoraIdStr : 0;
        if (pildoraId > 0) {
          return this.pildoraService.getPildora(pildoraId);
        } else {
          // Si no hay un id válido, puedes retornar un observable que emita un valor predeterminado
          // o manejar este caso de alguna otra manera.
          return of(null);
        }
      })
    ).subscribe(pildora => {
      if (pildora) {
        this.pildoraForm.patchValue({
          titulo: pildora.titulo,
          contenido: pildora.contenido
        });
        const etiquetasFormArray = this.pildoraForm.get('etiquetas') as FormArray;
        etiquetasFormArray.clear();
        let contador = 1;
        pildora.etiquetas.forEach(etiqueta => {
          etiquetasFormArray.push(this.fb.control(contador));
          contador++;
          // etiquetasFormArray.push(this.fb.control(etiqueta.id));
        });
      } else {
        // Manejar el caso de una nueva píldora o un id no válido
        this.pildoraForm.reset();
        this.pildoraForm.patchValue({
          titulo: '',
          contenido: ''
        });
        const etiquetasFormArray = this.pildoraForm.get('etiquetas') as FormArray;
        etiquetasFormArray.clear();
      }
    });
  }

  compararEtiquetas(etiqueta1: any, etiqueta2: any): boolean {
    return !!etiqueta1 && !!etiqueta2 ? etiqueta1.id === etiqueta2.id : etiqueta1 === etiqueta2;
    // return etiqueta1 === etiqueta2;
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

  actualizarPosicionSeleccion(event: Event) {
    const elemento = event.target as HTMLTextAreaElement;
    this.inicioSeleccion = elemento.selectionStart ?? 0;
    this.finSeleccion = elemento.selectionEnd ?? 0;
  }
  // actualizarPosicionSeleccion(event: Event) {
  //   let elemento: HTMLTextAreaElement;

  //   if (event instanceof KeyboardEvent) {
  //     elemento = event.target as HTMLTextAreaElement;
  //   } else if (event instanceof MouseEvent) {
  //     elemento = (event.target as HTMLElement).closest('textarea') as HTMLTextAreaElement;
  //   }

  //   if (!elemento) return;

  //   this.inicioSeleccion = elemento.selectionStart ?? 0;
  //   this.finSeleccion = elemento.selectionEnd ?? 0;
  // }


  aplicarEstilo(prefijo: string, sufijo: string) {
    const contenidoControl = this.pildoraForm.get('contenido') as FormControl;
    if (!contenidoControl) return;

    const valorActual = contenidoControl.value;
    let nuevoTexto = '';
    let posicionCursor = 0;

    if (this.inicioSeleccion === this.finSeleccion) {
      // No hay selección de texto
      nuevoTexto = prefijo + sufijo;
      posicionCursor = this.inicioSeleccion + prefijo.length; // Posición entre el prefijo y el sufijo
    } else {
      // Hay texto seleccionado
      const textoSeleccionado = valorActual.substring(this.inicioSeleccion, this.finSeleccion);
      nuevoTexto = prefijo + textoSeleccionado + sufijo;
      posicionCursor = this.inicioSeleccion + nuevoTexto.length; // Posición después del texto modificado
    }

    contenidoControl.setValue(
      valorActual.substring(0, this.inicioSeleccion) + nuevoTexto + valorActual.substring(this.finSeleccion)
    );

    this.posicionarCursor(posicionCursor);
  }

  posicionarCursor(posicion: number) {
    setTimeout(() => {
      const textarea: HTMLTextAreaElement = this.editor.nativeElement;
      textarea.focus();
      textarea.setSelectionRange(posicion, posicion);
    }, 0);
  }

  insertarEnlace() {
    // Aquí puedes abrir un MatDialog para obtener el texto y la URL del usuario
    // o simplemente insertar un placeholder que el usuario puede editar
    this.aplicarEstilo('[texto del enlace](', ')');
  }
}

