import { Pildora } from "./pildora";

export class Secuencia {
    id: number;
    nombre: string;
    // pildoras?: Pildora[];

    // constructor(id: number, nombre: string, pildoras?: Pildora[]) {
    constructor(id: number, nombre: string) {
        this.id = id;
        this.nombre = nombre;
        // this.pildoras = pildoras;
    }
}
