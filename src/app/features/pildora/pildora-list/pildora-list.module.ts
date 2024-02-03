import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PildoraListComponent } from './pildora-list.component';

@NgModule({
  declarations: [PildoraListComponent],
  exports: [PildoraListComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
  ],
  providers: [MessageService],
})
export class PildoraListModule {}


