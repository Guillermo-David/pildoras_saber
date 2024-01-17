const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./pildoras.db', (err: Error | null) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Conectado a la base de datos.');
    }
});

db.serialize(() => {

    db.run(`DROP TABLE IF EXISTS PildoraEtiqueta`);
    db.run(`DROP TABLE IF EXISTS Etiqueta`);
    db.run(`DROP TABLE IF EXISTS Secuencia`);
    db.run(`DROP TABLE IF EXISTS Pildora`);
    
    // Crear tabla Secuencia
    db.run(`CREATE TABLE IF NOT EXISTS Secuencia (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL
    )`);

    // Crear tabla Pildora con una clave foránea que referencia a Secuencia
    db.run(`CREATE TABLE IF NOT EXISTS Pildora (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        contenido TEXT NOT NULL,
        pasoSecuencia INTEGER,
        idSecuencia INTEGER,
        FOREIGN KEY (idSecuencia) REFERENCES Secuencia(id)
    )`);

    // Crear tabla Etiqueta
    db.run(`CREATE TABLE IF NOT EXISTS Etiqueta (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL
    )`);

    // Crear tabla de unión PildoraEtiqueta para la relación muchos a muchos
    db.run(`CREATE TABLE IF NOT EXISTS PildoraEtiqueta (
        idPildora INTEGER,
        idEtiqueta INTEGER,
        FOREIGN KEY (idPildora) REFERENCES Pildora(id),
        FOREIGN KEY (idEtiqueta) REFERENCES Etiqueta(id),
        PRIMARY KEY (idPildora, idEtiqueta)
    )`);
});

db.close((err: Error | null) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Cerrando la conexión a la base de datos.');
});
