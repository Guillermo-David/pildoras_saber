-- CreateTable
CREATE TABLE "Etiqueta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Secuencia" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PildoraEtiquetas" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_PildoraEtiquetas_A_fkey" FOREIGN KEY ("A") REFERENCES "Etiqueta" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PildoraEtiquetas_B_fkey" FOREIGN KEY ("B") REFERENCES "Pildora" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pildora" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "pasoSecuencia" INTEGER,
    "idSecuencia" INTEGER,
    CONSTRAINT "Pildora_idSecuencia_fkey" FOREIGN KEY ("idSecuencia") REFERENCES "Secuencia" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Pildora" ("contenido", "id", "idSecuencia", "pasoSecuencia", "titulo") SELECT "contenido", "id", "idSecuencia", "pasoSecuencia", "titulo" FROM "Pildora";
DROP TABLE "Pildora";
ALTER TABLE "new_Pildora" RENAME TO "Pildora";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_PildoraEtiquetas_AB_unique" ON "_PildoraEtiquetas"("A", "B");

-- CreateIndex
CREATE INDEX "_PildoraEtiquetas_B_index" ON "_PildoraEtiquetas"("B");
