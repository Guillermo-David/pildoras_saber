-- CreateTable
CREATE TABLE "Pildora" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "pasoSecuencia" INTEGER,
    "idSecuencia" INTEGER
);
