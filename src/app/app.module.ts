import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { PildoraListModule } from './features/pildora/pildora-list/pildora-list.module';
import { HttpClientModule } from '@angular/common/http';
import { PildoraDetailModule } from './features/pildora/pildora-detail/pildora-detail.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AppRoutingModule } from './app-routing.module';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomPaginator } from './config/CustomPaginatorConfiguration';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    PildoraListModule,
    PildoraDetailModule,
  ],
  providers: [
    provideAnimationsAsync(),
    { provide: MatPaginatorIntl, useValue: CustomPaginator() }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
