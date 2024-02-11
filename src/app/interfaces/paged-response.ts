export interface PagedResponse {
    data: any[]; // Idealmente, sustituye any[] por un tipo específico, como Pildora[]
    total: number;
    pageNumber: number;
    pageSize: number;
}