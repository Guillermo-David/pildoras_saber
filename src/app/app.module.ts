import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PildoraListComponent } from './features/pildora/pildora-list/pildora-list.component';
import { PildoraDetailComponent } from './features/pildora/pildora-detail/pildora-detail.component';
import { SecuenciaDetailComponent } from './features/secuencia/secuencia-detail/secuencia-detail.component';
import { SecuenciaListComponent } from './features/secuencia/secuencia-list/secuencia-list.component';
import { EtiquetaListComponent } from './features/etiqueta/etiqueta-list/etiqueta-list.component';
import { EtiquetaDetailComponent } from './features/etiqueta/etiqueta-detail/etiqueta-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    PildoraListComponent,
    PildoraDetailComponent,
    SecuenciaDetailComponent,
    SecuenciaListComponent,
    EtiquetaListComponent,
    EtiquetaDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
