import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { CommonUtils } from 'src/app/common/common-utils';
import { Environment } from 'src/app/environment/environment';
import { Pagination } from 'src/app/models/pagination';
import { Pildora } from 'src/app/models/pildora';
import { PildoraService } from 'src/app/services/pildora-service';
import { PagedResponse } from 'src/app/interfaces/paged-response';
import { Etiqueta } from 'src/app/models/etiqueta';
import { CustomError } from 'src/app/exceptions/custom-error';

@Component({
  selector: 'app-pildora-list',
  templateUrl: './pildora-list.component.html',
  styleUrls: ['./pildora-list.component.css']
})
export class PildoraListComponent {
  @ViewChild('saveButtonEdit') saveButtonEdit!: ElementRef;
  @ViewChild('saveButtonNew') saveButtonNew!: ElementRef;
  @ViewChild('filtroTitulo') filtroTitulo!: ElementRef;
  @ViewChild('filtroContenido') filtroContenido!: ElementRef;
  @ViewChild('filtroEtiqueta') filtroEtiqueta!: ElementRef;

  pildoras: Pildora[] = [];
  etiquetas: Etiqueta[] = [];

  //Paginacion, ordenacion y filtrado
  paging: Pagination = new Pagination();
  currentSortField: string = 'titulo';
  currentSortOrder: string = 'asc';
  activeFilters: { [key: string]: string } = {};
  textoInputsFiltros: { [key: string]: any } = {};
  // opcionesFiltroBoolean = CommonUtils.OPCIONES_FILTRO_SI_NO;

  //Breadcrumb
  items: MenuItem[] = [];
  home: any;

  //Formulario de creación
  newUbicacionNombre: string = '';
  newUbicacionExterna: boolean = false;
  newPildoraTitulo: string = '';
  newPildoraContenido: string = '';
  newPildoraEtiquetas: Etiqueta[] = [];

  //Flags mostrar botones
  // isCreating: boolean = false;
  editingId: string | null = null;

  //Tooltip
  tooltipDelay = CommonUtils.TOOLTIP_DELAY;

  //Accordion
  activeIndex: number = CommonUtils.ACCORDION_DEFAULT_INDEX;

  constructor(private pildoraService: PildoraService,
    private http: HttpClient,
    private messageService: MessageService,
    private router: Router,
    private el: ElementRef) { }

  ngOnInit() {
    this.getPildoras(this.paging.page, this.paging.size);
  }

  getPildoras(page: number, size: number): void {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', this.currentSortField)
      .set('order', this.currentSortOrder);

    Object.keys(this.activeFilters).forEach(key => {
      params = params.set(key, this.activeFilters[key]);
    });

    this.http
      .get<PagedResponse>(
        `${Environment.apiUrl}/pildoras`, { params })
      .subscribe((response) => {
        this.pildoras = response.content;
        this.paging.totalRecords = response.totalElements;
        this.paging.totalPages = response.totalPages;
        this.paging.firstIndex = page * size;
      });
  }

  clearFilters() {
    this.activeFilters = {};
    this.getPildoras(0, this.paging.size);
    this.textoInputsFiltros = this.resetFiltersValue();

    if (this.filtroTitulo || this.filtroContenido || this.filtroEtiqueta) {
      this.filtroTitulo.nativeElement.value = '';
      this.filtroContenido.nativeElement.value = '';
      this.filtroEtiqueta.nativeElement.value = '';
    }
  }

  resetFiltersValue() {
    return {
      titulo: '',
      contenido: '',
      etiquetas: '',
    };
  }

  onFilter(event: any, field: string) {
    if (event === null) {
      delete this.activeFilters[field];
    } else {
      let filterValue = event.value !== undefined ? event.value : event.target.value;

      if (filterValue !== null && filterValue !== undefined && filterValue !== '') {
        this.activeFilters[field] = filterValue;
      } else {
        delete this.activeFilters[field];
      }
    }
    this.getPildoras(0, this.paging.size);
  }

  onSort(event: TableLazyLoadEvent) {
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
  // onNewRowInit() {
  //   this.isCreating = true;
  // }

  // onNewRowSave(
  //   titulo: string,
  //   contenido: string,
  //   etiquetas: Etiqueta[],
  // ) {
  //   let pil = new Pildora();
  //   pil.titulo = titulo;
  //   pil.contenido = contenido;
  //   pil.etiquetas = etiquetas;

  //   this.http.post<any[]>(`${Environment.apiUrl}/pildoras`, pil).subscribe({
  //     next: (data) => {
  //       this.getPildoras(this.paging.page, this.paging.size);
  //       this.messageService.add({
  //         severity: 'success',
  //         summary: 'Success',
  //         detail: 'Registro añadido',
  //       });
  //       this.resetForm();
  //     },
  //     error: (error: CustomError) => {
  //       this.messageService.add({
  //         severity: 'error',
  //         summary: error.titulo,
  //         detail: error.message ? error.message : 'Error al guardar el registro',
  //       });
  //     },
  //   });
  // }

  // onNewRowCancel() {
  //   this.resetForm();
  // }

  // resetForm() {
  //   this.isCreating = false;
  //   this.newPildoraTitulo = '';
  //   this.newPildoraContenido = '';
  //   this.newPildoraEtiquetas = [];
  // }
}
