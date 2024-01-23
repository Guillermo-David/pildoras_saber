import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { PaginatorModule } from 'primeng/paginator';
import { PildoraListComponent } from './pildora-list.component';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { AccordionModule } from 'primeng/accordion';
import { SelectButtonModule } from 'primeng/selectbutton';

@NgModule({
  declarations: [PildoraListComponent],
  exports: [PildoraListComponent],
  imports: [
    CommonModule,
    RouterModule,
    BreadcrumbModule,
    TableModule,
    MenuModule,
    FormsModule,
    ToastModule,
    TooltipModule,
    PaginatorModule,
    CardModule,
    ButtonModule,
    MultiSelectModule,
    CheckboxModule,
    AccordionModule,
    SelectButtonModule
  ],
  providers: [MessageService],
})
export class PildoraListModule {}


