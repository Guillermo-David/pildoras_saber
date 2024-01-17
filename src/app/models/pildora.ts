import { Etiqueta } from "./etiqueta";

export class Pildora {
    id: number;
    titulo: string;
    contenido: string;
    idSecuencia?: number; // Opcional, dependiendo de si quieres exponer esta relación
    pasoSecuencia?: number;
    etiquetas?: Etiqueta[];

    constructor(id: number, titulo: string, contenido: string, idSecuencia?: number, etiquetas?: Etiqueta[], pasoSecuencia?: number) {
        this.id = id;
        this.titulo = titulo;
        this.contenido = contenido;
        this.idSecuencia = idSecuencia;
        this.etiquetas = etiquetas;
        this.pasoSecuencia = pasoSecuencia;
    }
}
