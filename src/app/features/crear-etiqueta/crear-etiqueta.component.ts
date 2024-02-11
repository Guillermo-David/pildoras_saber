import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EtiquetaService } from 'src/app/services/etiqueta-service';
import { ToastService } from 'src/app/services/toast-service';

@Component({
  selector: 'app-crear-etiqueta',
  templateUrl: './crear-etiqueta.component.html',
  styleUrl: './crear-etiqueta.component.css'
})
export class CrearEtiquetaComponent {
  etiquetaForm: FormGroup;

  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<CrearEtiquetaComponent>,
    private etiquetaService: EtiquetaService,
    private toastService: ToastService
  ) {

    this.etiquetaForm = this.fb.group({
      nombre: ['', [Validators.required]] // Validación para requerir el nombre
    });
  }

  guardar() {
    if (this.etiquetaForm.valid) {
      const nombreEtiqueta = this.etiquetaForm.get('nombre')?.value;

      const activeFilters = { nombre: nombreEtiqueta };

      this.etiquetaService.getEtiquetas(0, 10, activeFilters).subscribe(respuesta => {
        if (respuesta.data && respuesta.data.length === 0) {
          this.etiquetaService.createEtiqueta({
            nombre: nombreEtiqueta,
            id: 0
          }).subscribe({
            next: (nuevaEtiqueta) => {
              console.log('Etiqueta creada:', nuevaEtiqueta);
              this.toastService.showToast('Etiqueta creada con éxito');
              this.dialogRef.close(nuevaEtiqueta);
            },
            error: (error) => {
              console.error('Error al crear la etiqueta:', error);
              this.toastService.showToast('Error al crear la etiqueta');
            }
          });
        } else {
          this.toastService.showToast('Ya existe una etiqueta con ese nombre');
        }
      });
    }
  }



  cancelar() {
    this.dialogRef.close();
  }
}
