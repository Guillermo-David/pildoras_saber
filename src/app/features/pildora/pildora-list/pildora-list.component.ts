import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Pagination } from 'src/app/models/pagination';
import { Pildora } from 'src/app/models/pildora';
import { PildoraService } from 'src/app/services/pildora-service';
import { Etiqueta } from 'src/app/models/etiqueta';
import { MatPaginator } from '@angular/material/paginator';
import { EtiquetaService } from 'src/app/services/etiqueta-service';
import { Observable, map, debounceTime, Subject } from 'rxjs';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelectChange } from '@angular/material/select';
import { ConfirmarBorradoComponent } from '../confirmar-borrado/confirmar-borrado.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from 'src/app/services/toast-service';
import { CommonUtils } from 'src/app/common/common-utils';


@Component({
  selector: 'app-pildora-list',
  templateUrl: './pildora-list.component.html',
  styleUrls: ['./pildora-list.component.css']
})
export class PildoraListComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('saveButtonEdit') saveButtonEdit!: ElementRef;
  @ViewChild('saveButtonNew') saveButtonNew!: ElementRef;

  pildoras: Pildora[] = [];
  etiquetas: Etiqueta[] = [];
  dataSource = new MatTableDataSource<Pildora>();

  displayedColumns: string[] = ['titulo', 'contenido', 'etiquetas', 'acciones'];

  //Paginacion, ordenacion y filtrado
  paging: Pagination = new Pagination();
  currentSortField: string = 'titulo';
  currentSortOrder: string = 'asc';
  itemsPerPageLabel: string = "Resultados por página";
  activeFilters: { [key: string]: string } = {};
  selectedEtiqueta: string = '';
  filtroTituloSubject = new Subject<string>();
  filtroContenidoSubject = new Subject<string>();
  filtroTitulo: string = '';
  filtroContenido: string = '';

  constructor(
    private pildoraService: PildoraService,
    private etiquetaService: EtiquetaService,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    private toastService: ToastService,
  ) {
    this.filtroTituloSubject.pipe(
      debounceTime(CommonUtils.DEBOUNCE_DELAY)
    ).subscribe({
      next: (valor) => {
        this.filtroTitulo = valor;
        this.applyFilter();
      }
    });
    this.filtroContenidoSubject.pipe(
      debounceTime(CommonUtils.DEBOUNCE_DELAY)
    ).subscribe({
      next: (valor) => {
        this.filtroContenido = valor;
        this.applyFilter();
      }
    });
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.cargarEtiquetas();
  }

  actualizarDatos(): void {
    const paginaActual = this.paginator ? this.paginator.pageIndex : 0;
    const tamanoPagina = this.paginator ? this.paginator.pageSize : 10;

    this.pildoraService.getPildoras(paginaActual, tamanoPagina, this.currentSortField, this.currentSortOrder, this.activeFilters).subscribe({
      next: (resultados) => {
        this.dataSource.data = resultados.data;
        if (this.paginator) {
          this.paginator.length = resultados.total;
          this.cdr.detectChanges();
        }
      },
      error: (error) => console.error('Error al obtener datos de píldoras:', error),
    });
  }

  cargarEtiquetas(): void {
    this.etiquetaService.getEtiquetas().subscribe({
      next: (etiquetas) => {
        this.etiquetas = etiquetas.data;
      },
      error: (error) => console.error('Error al obtener etiquetas', error),
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

  onKeyup(event: MatSelectChange) {
    // const target = event.target as HTMLInputElement;
    this.applyFilter();
  }

  onFiltroTituloChanged(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.filtroTituloSubject.next(target.value);
  }

  onFiltroContenidoChanged(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.filtroContenidoSubject.next(target.value);
  }

  // Asume que hay un método que se llama cuando cambia la selección del mat-select
  onEtiquetaSelected(event: MatSelectChange): void {
    const etiquetaSeleccionada = event.value;
    // Actualiza el filtro basado en la etiqueta seleccionada
    this.activeFilters['etiqueta'] = etiquetaSeleccionada;

    // Llama a cargarDatosFiltrados para aplicar el filtro
    this.actualizarDatos();
  }

  applyFilter() {
    const filtroTitulo = this.filtroTitulo.trim().toLowerCase();
    const filtroContenido = this.filtroContenido.trim().toLowerCase();
    const filtroEtiqueta = !!this.selectedEtiqueta ? this.selectedEtiqueta : '';

    this.activeFilters = {
      titulo: filtroTitulo,
      contenido: filtroContenido,
      etiqueta: filtroEtiqueta,
    };

    this.actualizarDatos();
  }

  clearFilters() {
    this.activeFilters = {};
    this.paging.page = 0;
    this.getPildoras(this.paging.page, this.paging.size);

    if (this.filtroTitulo || this.selectedEtiqueta || this.filtroContenido) {
      this.filtroTitulo = '';
      this.filtroContenido = '';
      this.selectedEtiqueta = '';
    }
  }

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
      this.actualizarDatos();
      this.paging.page = this.paginator.pageIndex;
      this.paging.size = this.paginator.pageSize;

      // Llama a cargarDatosFiltrados para reflejar la paginación y los filtros actuales.
      // this.cargarDatosFiltrados();
    });

    this.sort.sortChange.subscribe((sortState: Sort) => {
      this.currentSortField = sortState.active;
      this.currentSortOrder = sortState.direction;
      this.actualizarDatos();
    });

    this.actualizarDatos();
  }

  editarPildora(pildora: any) {
    this.router.navigateByUrl("/edicion/" + pildora.id);
  }

  confirmarBorrarPildora(pildora: any) {
    const dialogRef = this.dialog.open(ConfirmarBorradoComponent, {
      width: '250px',
      data: { titulo: pildora.titulo } // Pasa los datos necesarios
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.pildoraService.deletePildora(pildora.id).subscribe({
          next: (response) => {
            this.toastService.showToast('Píldora borrada con éxito');
            this.actualizarDatos();
          },
          error: (error) => {
            this.toastService.showToast('Error al borrar la píldora: ' + error);
          }
        });
      }
    });
  }
}
