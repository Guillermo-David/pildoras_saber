import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PildoraDataService {
    private pildoraSource = new BehaviorSubject<any>(null);
    pildoraActual = this.pildoraSource.asObservable();

    constructor() { }

    cambiarPildora(pildora: any) {
        this.pildoraSource.next(pildora);
    }
}
