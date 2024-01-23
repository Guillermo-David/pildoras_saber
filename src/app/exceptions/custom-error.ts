export class CustomError extends Error {
    titulo: string;
    httpStatus: number;
  
    constructor(titulo: string, mensaje: string, httpStatus: number) {
      super(mensaje);
      this.name = 'CustomError';
      this.titulo = titulo;
      this.httpStatus = httpStatus;
    }
  }
  