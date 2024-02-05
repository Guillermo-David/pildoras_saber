import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Pagination } from 'src/app/models/pagination';
import { Pildora } from 'src/app/models/pildora';
import { PildoraService } from 'src/app/services/pildora-service';
import { Etiqueta } from 'src/app/models/etiqueta';
import { MatPaginator } from '@angular/material/paginator';
import { EtiquetaService } from 'src/app/services/etiqueta-service';
import { Observable, forkJoin, map } from 'rxjs';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-pildora-list',
  templateUrl: './pildora-list.component.html',
  styleUrls: ['./pildora-list.component.css']
})
export class PildoraListComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  //
  @ViewChild('saveButtonEdit') saveButtonEdit!: ElementRef;
  @ViewChild('saveButtonNew') saveButtonNew!: ElementRef;
  // @ViewChild('filtroTitulo') filtroTitulo!: ElementRef;
  // @ViewChild('filtroContenido') filtroContenido!: ElementRef;
  // @ViewChild('filtroEtiqueta') filtroEtiqueta!: ElementRef;

  pildoras: Pildora[] = [];
  etiquetas: Etiqueta[] = [];
  dataSource = new MatTableDataSource<Pildora>();

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
  selectedEtiqueta: string = '';
  filtroTitulo: string = '';
  // textoInputsFiltros: { [key: string]: any } = {};
  // opcionesFiltroBoolean = CommonUtils.OPCIONES_FILTRO_SI_NO;

  constructor(
    private pildoraService: PildoraService,
    private etiquetaService: EtiquetaService,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.cargarDatos();
  }

  cargarDatos() {
    forkJoin({
      pildoras: this.getPildoras(this.paging.page, this.paging.size),
      etiquetas: this.getEtiquetas()
    }).subscribe({
      next: ({ pildoras, etiquetas }) => {
        this.pildoras = pildoras.data;
        this.etiquetas = etiquetas.data;
        this.dataSource.data = pildoras.data;

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
    return this.pildoraService.getPildoras(page, size, this.currentSortField, this.currentSortOrder, this.activeFilters).pipe(
      map(response => {
        if (this.paginator) {
          this.paginator.length = response.total;
          this.paginator.pageIndex = page;
          this.paginator.pageSize = size;
        }
        return { data: response.data, total: response.total };
      })
    );
  }

  getEtiquetas(): Observable<{ data: Etiqueta[] }> {
    return this.etiquetaService.getEtiquetas(0, Number.MAX_SAFE_INTEGER);
  }

  onKeyup(event: Event) {
    // const target = event.target as HTMLInputElement;
    this.applyFilter();
  }


  applyFilter() {
    // Usa directamente las propiedades del componente en lugar de intentar acceder a elementos del DOM.
    const filtroTitulo = this.filtroTitulo.trim().toLowerCase();
    const filtroEtiqueta = this.selectedEtiqueta;
  
    this.activeFilters = {
      titulo: filtroTitulo,
      etiqueta: filtroEtiqueta,
    };
  
    this.cargarDatosFiltrados();
  }
  



cargarDatosFiltrados(): void {
  const paginaActual = this.paginator.pageIndex;
  const tamanoPagina = this.paginator.pageSize;

  this.pildoraService.getPildoras(paginaActual, tamanoPagina, this.currentSortField, this.currentSortOrder, this.activeFilters).subscribe({
    next: (resultados) => {
      this.dataSource.data = resultados.data;
      // Actualiza el paginador dentro de una zona segura para garantizar la detección de cambios.
      this.cdr.detectChanges();
      setTimeout(() => {
        this.paginator.length = resultados.total;
      });
    },
    error: (error) => console.error('Error al obtener datos filtrados:', error),
    complete: () => console.log('Carga de datos filtrados completada.')
  });
}

clearFilters() {
  this.activeFilters = {};
  this.paging.page = 0;
  this.getPildoras(this.paging.page, this.paging.size);

  if (this.filtroTitulo || this.selectedEtiqueta) {
    this.filtroTitulo = '';
    this.selectedEtiqueta = '';
  }
}

// resetFiltersValue() {
//   return {
//     titulo: '',
//     contenido: '',
//     etiquetas: '',
//   };
// }

onSortChange(e: any) {
  console.log(e);
}

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

ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
  this.cdr.detectChanges(); // Asegura que los cambios se detecten antes de la suscripción.

  this.paginator.page.subscribe(() => {
    // Actualiza los parámetros de paginación basándose en el estado actual del paginador.
    this.paging.page = this.paginator.pageIndex;
    this.paging.size = this.paginator.pageSize;

    // Llama a cargarDatosFiltrados para reflejar la paginación y los filtros actuales.
    this.cargarDatosFiltrados();
  });

  this.sort.sortChange.subscribe((sortState: Sort) => {
    this.currentSortField = sortState.active;
    this.currentSortOrder = sortState.direction;
    this.cargarDatos();
  });

  // Inicializa la carga de datos aquí si es necesario, 
  // pero asegúrate de que no interfiera con las actualizaciones del paginador.
}
  
}
