import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PildoraListModule } from './features/pildora/pildora-list/pildora-list.module';
import { HttpClientModule } from '@angular/common/http';
import { PildoraDetailModule } from './features/pildora/pildora-detail/pildora-detail.module';

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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
