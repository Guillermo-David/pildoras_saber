export interface PagedResponse {
    data: any[]; // Idealmente, sustituye any[] por un tipo específico, como Pildora[]
    total: number;
    page: number;
    pageSize: number;
}