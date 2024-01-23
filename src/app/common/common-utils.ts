import { Subject } from "rxjs";

export class CommonUtils {
  static PERIODICIDAD_CHECK_JWT = 60000;
  static TOOLTIP_DELAY = 500;
  static DEBOUNCE_DELAY = 500;
  static ACCORDION_DEFAULT_INDEX: number = -1;

  static OPCIONES_FILTRO_SI_NO = [
    { label: 'Sí', value: 'si' },
    { label: 'No', value: 'no' }
  ];
  static MOVIMIENTO_DETALLE_COLUMNS_WIDTH = {
    'comentario': 30,
    'entrada': 15,
    'salida': 15,
    'ubicacionOrigen': 20,
    'ubicacionDestino': 20
  };
  static MOVIMIENTO_COLUMNS_WIDTH = {
    'inventario.id': 5,
    'inventario.marca.nombre': 10,
    'inventario.modelo': 10,
    'comentario': 25,
    'entrada': 10,
    'salida': 10,
    'ubicacionOrigen': 15,
    'ubicacionDestino': 15
  };

  static MOVIMIENTO_DETALLE_COLUMNS = [
    { field: 'comentario', header: 'Comentario', type: 'text' },
    { field: 'ubicacionOrigen.nombre', header: 'Ubicación origen', type: 'text' },
    { field: 'ubicacionDestino.nombre', header: 'Ubicación destino', type: 'text' },
    { field: 'entrada', header: 'Entrada', type: 'date' },
    { field: 'salida', header: 'Salida', type: 'date' },
  ];
  static MOVIMIENTO_COLUMNS = [
    { field: 'inventario.id', header: 'ID Inventario', type: 'number' },
    { field: 'inventario.marca.nombre', header: 'Marca', type: 'text' },
    { field: 'inventario.modelo', header: 'Modelo', type: 'text' },
    { field: 'comentario', header: 'Comentario', type: 'text' },
    { field: 'ubicacionOrigen.nombre', header: 'Ubicación origen', type: 'text' },
    { field: 'ubicacionDestino.nombre', header: 'Ubicación destino', type: 'text' },
    { field: 'entrada', header: 'Entrada', type: 'date' },
    { field: 'salida', header: 'Salida', type: 'date' },
  ];
  static HISTORICO_COLUMNS = [
    { field: 'entidadId', header: 'ID Entidad', type: 'text' },
    { field: 'tipoEntidad', header: 'Entidad', type: 'text' },
    { field: 'atributo', header: 'Atributo', type: 'text' },
    { field: 'tipoAccion', header: 'Acción', type: 'text' },
    { field: 'fecha', header: 'Fecha', type: 'date' },
    { field: 'valorOriginal', header: 'Valor Anterior', type: 'text' },
    { field: 'valorNuevo', header: 'Valor Nuevo', type: 'text' },
    { field: 'editor.username', header: 'Editor', type: 'text' }
  ];
  static INVENTARIO_COLUMNS = [
    { field: 'id', header: 'ID' },
    { field: 'marca.nombre', header: 'Marca' },
    { field: 'modelo', header: 'Modelo' },
    { field: 'numSerie', header: 'Nº Serie' },
    { field: 'numInvInterno', header: 'Nº Inv. Interno' },
    { field: 'numInvUV', header: 'Nº Inv. UV' },
    { field: 'comentario', header: 'Comentario' },
    { field: 'reserva', header: 'Reserva' },
    { field: 'isDisponible', header: 'Disponible' },
    { field: 'tipos', header: 'Tipos' },
    { field: 'ubicacion.nombre', header: 'Ubicación' },
    { field: 'fechaAdquisicion', header: 'Adquisición' }
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