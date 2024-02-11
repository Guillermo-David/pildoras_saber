import { Component, Inject } from '@angular/core';
import { CrearEtiquetaComponent } from '../../crear-etiqueta/crear-etiqueta.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmar-borrado',
  templateUrl: './confirmar-borrado.component.html',
  styleUrl: './confirmar-borrado.component.css'
})
export class ConfirmarBorradoComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmarBorradoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { titulo: string }
  ) { }

  // Método para cerrar el diálogo
  cerrarDialogo(): void {
    this.dialogRef.close();
  }

  // Método para confirmar el borrado
  confirmarBorrado(): void {
    this.dialogRef.close(true); // Pasar 'true' para indicar confirmación
  }
}
