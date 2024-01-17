import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Etiqueta } from '../models/etiqueta';

@Injectable({
  providedIn: 'root'
})
export class EtiquetaService {
    private apiUrl = 'http://localhost:3000/api/etiquetas';

  constructor(private http: HttpClient) { }

  getEtiquetas(limit?: number, offset?: number, orderBy?: string, orderDirection?: 'ASC' | 'DESC'): Observable<Etiqueta[]> {
    const params = new HttpParams()
      .set('limit', limit ? limit.toString() : '')
      .set('offset', offset ? offset.toString() : '')
      .set('orderBy', orderBy ? orderBy : '')
      .set('orderDirection', orderDirection ? orderDirection : '');
  
    return this.http.get<Etiqueta[]>(this.apiUrl, { params });
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