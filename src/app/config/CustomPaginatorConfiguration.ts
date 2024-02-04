import { MatPaginatorIntl } from "@angular/material/paginator";


//Actualmente no se usa
export function CustomPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();

  // customPaginatorIntl.itemsPerPageLabel = 'Resultados por página:';

  return customPaginatorIntl;
  
}