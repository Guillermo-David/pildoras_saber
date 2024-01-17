import { Component } from '@angular/core';
import { Pildora } from 'src/app/models/pildora';
import { PildoraService } from 'src/app/services/pildora-service';

@Component({
  selector: 'app-pildora-list',
  templateUrl: './pildora-list.component.html',
  styleUrls: ['./pildora-list.component.css']
})
export class PildoraListComponent {
  pildoras: Pildora[] = [];

  constructor(private pildoraService: PildoraService) { }

  ngOnInit() {
    this.getPildoras();
  }

  getPildoras(): void {
    this.pildoraService.getPildoras().subscribe({
      next: (data) => {
        this.pildoras = data;
      },
      error: (error) => {
        console.error('Error al obtener las píldoras:', error);
      }
    });
  }
}
