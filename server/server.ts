import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import pildorasController from './api/pildora-controller';
import etiquetasController from './api/etiqueta-controller';
import secuenciasController from './api/secuencia-controller';
import { Server } from 'http';

const app = express();
const port = 3000;
let server: Server | null;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/pildoras', pildorasController);
app.use('/api/etiquetas', etiquetasController);
app.use('/api/secuencias', secuenciasController);

export const start = () => {
    console.log("iniciando servidor");
    app.listen(port, () => {
        console.log(`Servidor corriendo en http://localhost:${port}`);
    });
};

export const stop = () => {
    if (server) {
        server.close();
    }
};

start();