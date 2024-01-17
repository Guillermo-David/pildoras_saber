import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pildora } from '../models/pildora';

@Injectable({
  providedIn: 'root'
})
export class PildoraService {
    private apiUrl = 'http://localhost:3000/api/pildoras';

  constructor(private http: HttpClient) { }

  getPildoras(limit?: number, offset?: number, orderBy?: string, orderDirection?: 'ASC' | 'DESC'): Observable<Pildora[]> {
    const params = new HttpParams()
      .set('limit', limit ? limit.toString() : '')
      .set('offset', offset ? offset.toString() : '')
      .set('orderBy', orderBy ? orderBy : '')
      .set('orderDirection', orderDirection ? orderDirection : '');
  
    return this.http.get<Pildora[]>(this.apiUrl, { params });
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
