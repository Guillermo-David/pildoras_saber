import { MatSnackBar } from "@angular/material/snack-bar";
import { Subject } from "rxjs";

export class CommonUtils {
  static PERIODICIDAD_CHECK_JWT = 60000;
  static TOOLTIP_DELAY = 500;
  static DEBOUNCE_DELAY = 500;
  static TOAST_DURATION = 4000;
  static ACCORDION_DEFAULT_INDEX: number = -1;

  static OPCIONES_FILTRO_SI_NO = [
    { label: 'Sí', value: 'si' },
    { label: 'No', value: 'no' }
  ];

  static parseFecha(fecha: Date | null): Date | null {
    if (fecha === null) {
      // Retorna null o maneja el caso de manera diferente
      return null;
    }
    // Obtener la fecha seleccionada y su desplazamiento de zona horaria
    let fechaSeleccionada = new Date(fecha);
    let desplazamiento = fechaSeleccionada.getTimezoneOffset();

    // Crear una nueva fecha que represente la medianoche en UTC para la fecha seleccionada
    return new Date(fechaSeleccionada.getTime() - desplazamiento * 60 * 1000);
  }
}