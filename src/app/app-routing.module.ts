import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PildoraListComponent } from './features/pildora/pildora-list/pildora-list.component';
import { PildoraDetailComponent } from './features/pildora/pildora-detail/pildora-detail.component';

const routes: Routes = [
  { path: '', component: PildoraListComponent },
  { path: 'edicion', component: PildoraDetailComponent },
  { path: 'edicion/:id', component: PildoraDetailComponent },
  { path: '**', redirectTo: '' }  // Esta siempre al final!
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
