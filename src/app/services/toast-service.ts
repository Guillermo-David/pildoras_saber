import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonUtils } from '../common/common-utils';

@Injectable({
    providedIn: 'root',
})
export class ToastService {
    constructor(private snackBar: MatSnackBar) { }

    showToast(mensaje: string, duracion: number = CommonUtils.TOAST_DURATION) {
        this.snackBar.open(mensaje, 'Cerrar', {
            duration: duracion,
            horizontalPosition: 'end',
            verticalPosition: 'top',
        });
    }
}
