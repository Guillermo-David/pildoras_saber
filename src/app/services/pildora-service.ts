import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pildora } from '../models/pildora';
import { Etiqueta } from '../models/etiqueta';
import { PagedResponse } from '../interfaces/paged-response';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PildoraService {
  private apiUrl = 'http://localhost:3000/api/pildoras';

  constructor(private http: HttpClient) { }

  getPildoras(page: number, size: number, currentSortField: string, currentSortOrder: string, activeFilters: { [key: string]: string }): Observable<PagedResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', currentSortField)
      .set('sortOrder', currentSortOrder);

    Object.keys(activeFilters).forEach(key => {
      params = params.set(key, activeFilters[key]);
    });

    return this.http.get<PagedResponse>(this.apiUrl, { params }).pipe(
      map(response => {
        const transformedData = response.data.map(pildora => ({
          ...pildora,
          etiquetas: pildora.etiquetas.map((etiqueta: any) => new Etiqueta(etiqueta.id, etiqueta.nombre))
        }));
        return {
          ...response,
          content: transformedData
        };
      })
    );
  }

  getPildora(id: number): Observable<Pildora> {
    return this.http.get<Pildora>(`${this.apiUrl}/${id}`);
  }

  createPildora(pildora: Pildora): Observable<Pildora> {
    return this.http.post<Pildora>(this.apiUrl, pildora);
  }

  updatePildora(pildora: Pildora): Observable<Pildora> {
    return this.http.put<Pildora>(`${this.apiUrl}/${pildora.id}`, pildora);
  }

  deletePildora(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  addEtiquetaToPildora(pildoraId: number, etiquetaId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${pildoraId}/etiqueta/${etiquetaId}`, {});
  }

  removeEtiquetaFromPildora(pildoraId: number, etiquetaId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${pildoraId}/etiqueta/${etiquetaId}`);
  }
}
