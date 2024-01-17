import express from 'express';
import sqlite3 from 'sqlite3';

const router = express.Router();
const db = new sqlite3.Database('./pildoras.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Conectado a la base de datos de etiquetas.');
});

// GET: Obtener todas las etiquetas
router.get('/', (req, res) => {
    const limit = req.query['limit'] ? parseInt(req.query['limit'].toString()) : 10; // Default 10
    const offset = req.query['offset'] ? parseInt(req.query['offset'].toString()) : 0; // Default 0
    const orderBy = typeof req.query['orderBy'] === 'string' ? req.query['orderBy'] : 'nombre'; // Default 'nombre'
    const orderDirection = req.query['orderDirection'] === 'DESC' ? 'DESC' : 'ASC'; // Default 'ASC'
    const nombre = typeof req.query['nombre'] === 'string' ? req.query['nombre'] : null;

    let sql = `SELECT * FROM Etiqueta E`;
    
    const params = [];
    if(nombre) {
        sql += ` WHERE E.nombre LIKE ?`;
        params.push(`%${nombre}%`);
    }

    sql += `ORDER BY ${orderBy} ${orderDirection} LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json(rows);
    });
});

// GET: Obtener una etiqueta por ID
router.get('/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM Etiqueta WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json(row);
    });
});

// POST: Crear una nueva etiqueta
router.post('/', (req, res) => {
    const { nombre } = req.body;
    db.run('INSERT INTO Etiqueta (nombre) VALUES (?)', [nombre], function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "id": this.lastID });
    });
});

// PUT: Actualizar una etiqueta
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const { nombre } = req.body;
    db.run('UPDATE Etiqueta SET nombre = ? WHERE id = ?', [nombre, id], function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "message": "Éxito", "changes": this.changes });
    });
});

// DELETE: Eliminar una etiqueta
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM Etiqueta WHERE id = ?', id, function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "message": "Eliminada", "changes": this.changes });
    });
});

export default router;
