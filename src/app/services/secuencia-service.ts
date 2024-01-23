import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Secuencia } from '../models/secuencia';
import { PagedResponse } from '../interfaces/paged-response';

@Injectable({
  providedIn: 'root'
})
export class SecuenciaService {
    private apiUrl = 'http://localhost:3000/api/secuencias';

  constructor(private http: HttpClient) { }

  getSecuencias(page: number, size: number, sort: string, order: string, filters: { [key: string]: string }): Observable<PagedResponse> {
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
  

  getSecuencia(id: number): Observable<Secuencia> {
    return this.http.get<Secuencia>(`${this.apiUrl}/${id}`);
  }

  createSecuencia(secuencia: Secuencia): Observable<Secuencia> {
    return this.http.post<Secuencia>(this.apiUrl, secuencia);
  }

  updateSecuencia(secuencia: Secuencia): Observable<Secuencia> {
    return this.http.put<Secuencia>(`${this.apiUrl}/${secuencia.id}`, secuencia);
  }

  deleteSecuencia(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}