import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { PildoraDetailComponent } from './pildora-detail.component';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [PildoraDetailComponent],
  exports: [PildoraDetailComponent],
  imports: [
    CommonModule,
    RouterModule,
    BreadcrumbModule,
    ButtonModule,
    FormsModule,
    InputTextareaModule,
    InputTextModule,
    MultiSelectModule,
    BrowserAnimationsModule,
  ],
  providers: [MessageService],
})
export class PildoraDetailModule {}