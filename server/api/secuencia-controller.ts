import * as express from 'express';
import * as sqlite3 from 'sqlite3';

const router = express.Router();
const db = new sqlite3.Database('./prisma/pildoras.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Conectado a la base de datos de secuencias.');
});

// GET: Obtener todas las secuencias
router.get('/', (req, res) => {
    const size = req.query['size'] ? parseInt(req.query['size'].toString()) : 10; // Default 10
    const page = req.query['page'] ? parseInt(req.query['page'].toString()) : 0; // Default 0
    const offset = page * size;
    const orderBy = typeof req.query['sort'] === 'string' ? req.query['sort'] : 'id'; // Default 'id'
    const orderDirection = req.query['order'] === 'DESC' ? 'DESC' : 'ASC'; // Default 'ASC'
    const nombre = typeof req.query['nombre'] === 'string' ? req.query['nombre'] : null;

    let baseSql = `FROM Secuencia S`;
    const params: (string | number)[] = [];
    if (nombre) {
        baseSql += ` WHERE S.nombre LIKE ?`;
        params.push(`%${nombre}%`);
    }

    // Consulta para obtener el total de registros
    let countSql = `SELECT COUNT(*) as total ${baseSql}`;
    
    // Primero, obtener el total de registros
    db.get(countSql, params, (err, countResult: CountResult) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        
        const total = countResult.total;
        let dataSql = `SELECT * ${baseSql}`;

        if (size !== -1) {
            const offset = page * size;
            dataSql += ` ORDER BY ${orderBy} ${orderDirection} LIMIT ? OFFSET ?`;
            params.push(size, offset);
        } else {
            dataSql += ` ORDER BY ${orderBy} ${orderDirection}`;
        }

        db.all(dataSql, params, (err, rows) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }

            // Enviar la respuesta paginada
            res.json({
                content: rows,
                pageable: size !== -1 ? {
                    pageNumber: offset / size,
                    pageSize: size,
                    offset: offset,
                    sort: { empty: false, sorted: true, unsorted: false },
                    paged: true,
                    unpaged: false
                } : null,
                last: size !== -1 ? (page + 1) * size >= total : true,
                totalPages: size !== -1 ? Math.ceil(total / size) : 1,
                size: size,
                number: offset / size,
                sort: { empty: false, sorted: true, unsorted: false },
                first: size !== -1 ? page === 0 : true,
                numberOfElements: rows.length,
                empty: rows.length === 0
            });
        });
    });
});

// GET: Obtener una secuencia por ID
router.get('/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM Secuencia WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json(row);
    });
});

// POST: Crear una nueva secuencia
router.post('/', (req, res) => {
    const { nombre } = req.body;
    db.run('INSERT INTO Secuencia (nombre) VALUES (?)', [nombre], function (err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "id": this.lastID
        });
    });
});

// PUT: Actualizar una secuencia
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const { nombre } = req.body;
    db.run('UPDATE Secuencia SET nombre = ? WHERE id = ?', [nombre, id], function (err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "message": "Éxito", "changes": this.changes });
    });
});

// DELETE: Eliminar una secuencia
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM Secuencia WHERE id = ?', id, function (err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "message": "Eliminada", "changes": this.changes });
    });
});

export default router;