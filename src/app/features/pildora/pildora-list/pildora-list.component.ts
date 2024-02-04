import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Pagination } from 'src/app/models/pagination';
import { Pildora } from 'src/app/models/pildora';
import { PildoraService } from 'src/app/services/pildora-service';
import { PagedResponse } from 'src/app/interfaces/paged-response';
import { Etiqueta } from 'src/app/models/etiqueta';
import { CustomError } from 'src/app/exceptions/custom-error';
import { MatPaginator } from '@angular/material/paginator';
import { EtiquetaService } from 'src/app/services/etiqueta-service';
import { Observable, forkJoin, map } from 'rxjs';


@Component({
  selector: 'app-pildora-list',
  templateUrl: './pildora-list.component.html',
  styleUrls: ['./pildora-list.component.css']
})
export class PildoraListComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  //
  @ViewChild('saveButtonEdit') saveButtonEdit!: ElementRef;
  @ViewChild('saveButtonNew') saveButtonNew!: ElementRef;
  @ViewChild('filtroTitulo') filtroTitulo!: ElementRef;
  @ViewChild('filtroContenido') filtroContenido!: ElementRef;
  @ViewChild('filtroEtiqueta') filtroEtiqueta!: ElementRef;

  pildoras: Pildora[] = [];
  etiquetas: Etiqueta[] = [];

  displayedColumns: string[] = ['titulo', 'contenido', 'pasoSecuencia', 'etiquetas'];



  //Paginacion, ordenacion y filtrado
  paging: Pagination = new Pagination();
  currentSortField: string = 'titulo';
  currentSortOrder: string = 'asc';
  itemsPerPageLabel: string = "Resultados por página";
  // filters = {
  //   titulo: '',
  //   etiqueta: '';
  // }
  activeFilters: { [key: string]: string } = {};
  // textoInputsFiltros: { [key: string]: any } = {};
  // opcionesFiltroBoolean = CommonUtils.OPCIONES_FILTRO_SI_NO;

  constructor(
    private pildoraService: PildoraService,
    private etiquetaService: EtiquetaService,
    private http: HttpClient,
    private router: Router,) { }

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    forkJoin({
      pildoras: this.getPildoras(this.paging.page, this.paging.size),
      etiquetas: this.getEtiquetas() // Asegúrate de que este método devuelva un Observable
    }).subscribe({
      next: ({ pildoras, etiquetas }) => {
        // Actualiza el estado del componente basado en las respuestas
        // Asumiendo que 'pildoras' ya tiene la estructura {data: Pildora[], total: number}
        this.pildoras = pildoras.data; // Actualiza la lista de píldoras
        this.etiquetas = etiquetas.data; // Actualiza la lista de etiquetas

        // Si estás usando paginación para píldoras y necesitas actualizar el paginador
        if (this.paginator) {
          this.paginator.length = pildoras.total;
          this.paginator.pageIndex = this.paging.page;
          this.paginator.pageSize = this.paging.size;
        }
      },
      error: (error) => {
        console.error('Error al obtener píldoras o etiquetas', error);
      },
      complete: () => {
        console.log('Operación de obtención de píldoras y etiquetas completada');
      }
    });
  }

  getPildoras(page: number, size: number): Observable<{ data: Pildora[]; total: number; }> {
    // Asumiendo que pildoraService.getPildoras ya devuelve un Observable<PagedResponse>
    // y que quieres transformar la respuesta antes de devolverla desde este método.
    return this.pildoraService.getPildoras(page, size, this.currentSortField, this.currentSortOrder, this.activeFilters).pipe(
      map(response => {
        // Aquí, asumimos que necesitas actualizar algo basado en la respuesta
        // como el estado de paginación, pero no devuelves nada directamente
        // a `forkJoin`, solo transformas la respuesta para los consumidores del Observable.
        if (this.paginator) {
          // Actualiza el estado del paginator aquí si es necesario
          this.paginator.length = response.total;
          this.paginator.pageIndex = page;
          this.paginator.pageSize = size;
        }
        // Devuelve los datos transformados que serán emitidos por el Observable.
        return { data: response.data, total: response.total };
      })
    );
  }

  getEtiquetas(): Observable<{ data: Etiqueta[] }> {
    return this.etiquetaService.getEtiquetas(0, Number.MAX_SAFE_INTEGER);
  }

  onKeyup(event: Event) {
    const target = event.target as HTMLInputElement;
    this.onFilter(target.value, 'titulo');
  }

  onFilter(event: any, field: string) {
    // Establece o elimina el filtro basado en la entrada del usuario
    const filterValue = event?.value !== undefined ? event.value : event.target?.value;
  
    if (filterValue) {
      this.activeFilters[field] = filterValue;
    } else {
      delete this.activeFilters[field];
    }
  
    // Recarga las píldoras aplicando los filtros actualizados
    this.getPildoras(this.paging.page, this.paging.size);
  }
  

  clearFilters() {
    this.activeFilters = {};
    this.getPildoras(0, this.paging.size);
    // this.textoInputsFiltros = this.resetFiltersValue();

    if (this.filtroTitulo || this.filtroContenido || this.filtroEtiqueta) {
      this.filtroTitulo.nativeElement.value = '';
      this.filtroContenido.nativeElement.value = '';
      this.filtroEtiqueta.nativeElement.value = '';
    }
  }

  // resetFiltersValue() {
  //   return {
  //     titulo: '',
  //     contenido: '',
  //     etiquetas: '',
  //   };
  // }

  onSort(event: any) {
    const sortOrderString = event.sortOrder === 1 ? 'asc' : 'desc'; // 1 para 'asc', -1 para 'desc'
    if (event.sortField && event.sortOrder && (event.sortField !== this.currentSortField || sortOrderString !== this.currentSortOrder)) {
      this.currentSortField = event.sortField as string;
      this.currentSortOrder = sortOrderString;
      this.paging.firstIndex = 0;
      this.paging.page = 0;
      this.getPildoras(this.paging.page, this.paging.size);
    }
  }

  displayEtiquetas(etiquetas: Etiqueta[]): string {
    return etiquetas.map((etiqueta) => etiqueta.nombre).join(', ');
  }

  onPageChange(event: any) {
    this.paging.firstIndex = event.first;
    this.paging.page = event.first / event.rows;
    this.paging.size = event.rows;
    this.getPildoras(this.paging.page, this.paging.size);
  }

  onNewRowInit() {
    this.router.navigateByUrl('/edicion');
  }

  //Al cambiar de 10 registros por pág a 50 o a 100, no se actualizaba hasta que se crea esto:
  ngAfterViewInit() {
    this.paginator.page.subscribe({
      next: (event: any) => {
        // Obtén la página y el tamaño de página del evento
        const page = event.pageIndex;
        const size = event.pageSize;

        // Actualiza la configuración de paginación
        this.paging.page = page;
        this.paging.size = size;

        // Recarga los datos según la nueva configuración
        this.getPildoras(page, size);
      }
    });
  }
}
