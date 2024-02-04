import { Etiqueta } from "./etiqueta";

export class Pildora {
    id?: number;
    titulo!: string;
    contenido!: string;
    idSecuencia?: number; // Opcional, dependiendo de si quieres exponer esta relación
    pasoSecuencia?: number;
    etiquetas!: Etiqueta[];

}
