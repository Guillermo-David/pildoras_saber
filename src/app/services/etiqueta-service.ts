import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Etiqueta } from '../models/etiqueta';
import { PagedResponse } from '../interfaces/paged-response';

@Injectable({
    providedIn: 'root'
})
export class EtiquetaService {
    private apiUrl = 'http://localhost:3000/api/etiquetas';

    constructor(private http: HttpClient) { }

    getEtiquetas(page: number = 0, pageSize: number = 10, activeFilters: { [key: string]: string } = {}): Observable<PagedResponse> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('pageSize', pageSize.toString());

        // Aplicar filtros activos a los parámetros de la petición
        Object.keys(activeFilters).forEach(key => {
            if (activeFilters[key]) {
                params = params.set(key, activeFilters[key]);
            }
        });

        return this.http.get<PagedResponse>(this.apiUrl, { params }).pipe(
            map(response => {
                const transformedData = response.data.map(etiqueta => new Etiqueta(etiqueta.id, etiqueta.nombre));
                return {
                    ...response,
                    data: transformedData
                };
            })
        );
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
