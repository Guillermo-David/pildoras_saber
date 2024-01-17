interface PildoraConEtiquetas {
    id: number;
    titulo: string;
    contenido: string;
    idSecuencia: number | null;
    pasoSecuencia: number | null;
    etiquetas: { id: number; nombre: string }[];
}
