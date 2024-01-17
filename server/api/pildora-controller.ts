import express from 'express';
import sqlite3 from 'sqlite3';

const router = express.Router();
const db = new sqlite3.Database('./pildoras.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Conectado a la base de datos de píldoras.');
});

// GET: Obtener todas las píldoras
router.get('/', (req, res) => {
    const limit = req.query['limit'] ? parseInt(req.query['limit'].toString()) : 10; // Default 10
    const offset = req.query['offset'] ? parseInt(req.query['offset'].toString()) : 0; // Default 0
    const orderBy = typeof req.query['orderBy'] === 'string' ? req.query['orderBy'] : 'id'; // Default 'id'
    const orderDirection = req.query['orderDirection'] === 'DESC' ? 'DESC' : 'ASC'; // Default 'ASC'
    const titulo = typeof req.query['titulo'] === 'string' ? req.query['titulo'] : null;
    const nombreEtiqueta = typeof req.query['nombreEtiqueta'] === 'string' ? req.query['nombreEtiqueta'] : null;

    let sql = `SELECT P.*, E.nombre as nombreEtiqueta, E.id as idEtiqueta
               FROM Pildora P 
               LEFT JOIN PildoraEtiqueta PE ON P.id = PE.idPildora 
               LEFT JOIN Etiqueta E ON PE.idEtiqueta = E.id`;

    const params = [];
    let whereClauses = [];

    if (titulo) {
        whereClauses.push(`P.titulo LIKE ?`);
        params.push(`%${titulo}%`);
    }

    if (nombreEtiqueta) {
        whereClauses.push(`E.nombre = ?`);
        params.push(nombreEtiqueta);
    }

    if (whereClauses.length > 0) {
        sql += ` WHERE ` + whereClauses.join(' AND ');
    }

    sql += ` ORDER BY ${orderBy} ${orderDirection} LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    db.all(sql, params, (err, rows: PildoraRow[]) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }

        const pildoras = rows.reduce((acc: { [key: number]: PildoraConEtiquetas }, row: PildoraRow) => {
            if (!acc[row.id]) {
                acc[row.id] = {
                    id: row.id,
                    titulo: row.titulo,
                    contenido: row.contenido,
                    idSecuencia: row.idSecuencia || null,
                    pasoSecuencia: row.pasoSecuencia || null,
                    etiquetas: []
                };
            }

            if (row.idEtiqueta !== null && row.nombreEtiqueta !== null) {
                acc[row.id].etiquetas.push({ id: row.idEtiqueta, nombre: row.nombreEtiqueta });
            }

            return acc;
        }, {});

        res.json(Object.values(pildoras));
    });
});



// GET: Obtener una píldora por ID
router.get('/:id', (req, res) => {
    const id = req.params.id;
    const sql = `SELECT P.*, E.nombre as nombreEtiqueta, E.id as idEtiqueta
                 FROM Pildora P 
                 LEFT JOIN PildoraEtiqueta PE ON P.id = PE.idPildora 
                 LEFT JOIN Etiqueta E ON PE.idEtiqueta = E.id 
                 WHERE P.id = ?`;
    db.all(sql, [id], (err, rows: PildoraRow[]) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }

        if (rows.length === 0) {
            res.status(404).json({ "error": "Píldora no encontrada" });
            return;
        }

        const pildora: PildoraConEtiquetas = rows.reduce((acc: PildoraConEtiquetas, row: PildoraRow) => {
            if (!acc.etiquetas) acc.etiquetas = [];
            if (row.idEtiqueta !== null && row.nombreEtiqueta !== null) {
                acc.etiquetas.push({ id: row.idEtiqueta, nombre: row.nombreEtiqueta });
            }
            return acc;
        }, {
            id: rows[0].id,
            titulo: rows[0].titulo,
            contenido: rows[0].contenido,
            idSecuencia: rows[0].idSecuencia || null,
            pasoSecuencia: rows[0].pasoSecuencia || null,
            etiquetas: []
        });

        res.json(pildora);
    });
});



// POST: Crear una nueva píldora
router.post('/', (req, res) => {
    const { titulo, contenido, pasoSecuencia, idSecuencia } = req.body;
    db.run('INSERT INTO Pildora (titulo, contenido, pasoSecuencia, idSecuencia) VALUES (?, ?, ?, ?)', [titulo, contenido, pasoSecuencia, idSecuencia], function (err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "id": this.lastID });
    });
});

// PUT: Actualizar una píldora
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const { titulo, contenido, pasoSecuencia, idSecuencia } = req.body;
    db.run('UPDATE Pildora SET titulo = ?, contenido = ?, pasoSecuencia = ?, idSecuencia = ? WHERE id = ?', [titulo, contenido, pasoSecuencia, idSecuencia, id], function (err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "message": "Éxito", "changes": this.changes });
    });
});

// DELETE: Eliminar una píldora
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM Pildora WHERE id = ?', id, function (err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "Eliminada", "changes":

                this.changes
        });
    });
});

// Añadir etiqueta a una píldora
router.post('/:pildoraId/etiqueta/:etiquetaId', (req, res) => {
    const { pildoraId, etiquetaId } = req.params;
    db.run('INSERT INTO PildoraEtiqueta (idPildora, idEtiqueta) VALUES (?, ?)', [pildoraId, etiquetaId], function (err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "success": true, "message": "Etiqueta añadida a la píldora" });
    });
});

// Eliminar etiqueta de una píldora
router.delete('/:pildoraId/etiqueta/:etiquetaId', (req, res) => {
    const { pildoraId, etiquetaId } = req.params;

    db.run('DELETE FROM PildoraEtiqueta WHERE idPildora = ? AND idEtiqueta = ?', [pildoraId, etiquetaId], function (err) {
        if (err) {
            res.status
                (400).json({ "error": err.message });
            return;
        }
        if (this.changes > 0) {
            res.json({ "success": true, "message": "Etiqueta eliminada de la píldora" });
        } else {
            res.json({ "success": false, "message": "No se encontró la relación para eliminar" });
        }
    });
});

export default router;
