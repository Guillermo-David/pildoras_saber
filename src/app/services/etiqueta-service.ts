import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Etiqueta } from '../models/etiqueta';
import { PagedResponse } from '../interfaces/paged-response';

@Injectable({
  providedIn: 'root'
})
export class EtiquetaService {
    private apiUrl = 'http://localhost:3000/api/etiquetas';

  constructor(private http: HttpClient) { }

  getEtiquetas(page: number, size: number, sort: string, order: string, filters: { [key: string]: string }): Observable<PagedResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort)
      .set('order', order);

    // Aplicar los filtros activos
    Object.keys(filters).forEach(key => {
      params = params.set(key, filters[key]);
    });

    return this.http.get<PagedResponse>(this.apiUrl, { params });
  }
  
  getEtiqueta(id: number): Observable<Etiqueta> {
    return this.http.get<Etiqueta>(`${this.apiUrl}/${id}`);
  }

  createEtiqueta(etiqueta: Etiqueta): Observable<Etiqueta> {
    return this.http.post<Etiqueta>(this.apiUrl, etiqueta);
  }

  updateEtiqueta(etiqueta: Etiqueta): Observable<Etiqueta> {
    return this.http.put<Etiqueta>(`${this.apiUrl}/${etiqueta.id}`, etiqueta);
  }

  deleteEtiqueta(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}