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

    getEtiquetas(page: number = 0, pageSize: number = 10): Observable<{data: Etiqueta[], total: number, page: number, pageSize: number, totalPages: number}> {
      // Crear los parámetros de la petición basados en la paginación
      let params = new HttpParams()
        .set('page', page.toString())
        .set('pageSize', pageSize.toString());
  
      // Incluir los parámetros en la solicitud HTTP
      return this.http.get<{data: Etiqueta[], total: number, page: number, pageSize: number, totalPages: number}>(this.apiUrl, { params });
    }

    // Obtener una etiqueta por ID
    getEtiqueta(id: number): Observable<Etiqueta> {
        return this.http.get<Etiqueta>(`${this.apiUrl}/${id}`);
    }

    // Crear una nueva etiqueta
    createEtiqueta(etiqueta: Etiqueta): Observable<Etiqueta> {
        return this.http.post<Etiqueta>(this.apiUrl, etiqueta);
    }

    // Actualizar una etiqueta existente
    updateEtiqueta(etiqueta: Etiqueta): Observable<Etiqueta> {
        return this.http.put<Etiqueta>(`${this.apiUrl}/${etiqueta.id}`, etiqueta);
    }

    // Eliminar una etiqueta
    deleteEtiqueta(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }
}
