import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Secuencia } from '../models/secuencia';

@Injectable({
  providedIn: 'root'
})
export class SecuenciaService {
    private apiUrl = 'http://localhost:3000/api/secuencias';

  constructor(private http: HttpClient) { }

  getSecuencias(limit?: number, offset?: number, orderBy?: string, orderDirection?: 'ASC' | 'DESC'): Observable<Secuencia[]> {
    const params = new HttpParams()
      .set('limit', limit ? limit.toString() : '')
      .set('offset', offset ? offset.toString() : '')
      .set('orderBy', orderBy ? orderBy : '')
      .set('orderDirection', orderDirection ? orderDirection : '');
  
    return this.http.get<Secuencia[]>(this.apiUrl, { params });
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