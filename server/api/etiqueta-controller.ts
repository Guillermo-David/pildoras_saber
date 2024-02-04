import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// Obtener todas las etiquetas
router.get('/', async (req: Request, res: Response) => {
    // Leer los parámetros de paginación de la petición o usar valores predeterminados
    const page: number = parseInt(req.query['page'] as string) || 0;
    const pageSize: number = parseInt(req.query['pageSize'] as string) || 10;

    try {
        const skip: number = page * pageSize;

        // Obtener las etiquetas con paginación
        const etiquetas = await prisma.etiqueta.findMany({
            take: pageSize,
            skip: skip,
            orderBy: {
                nombre: 'asc', // Ordena las etiquetas alfabéticamente por nombre
            },
        });

        // Opcional: Obtener el total de registros para informar al cliente el total de páginas
        const total = await prisma.etiqueta.count();

        res.json({
            data: etiquetas,
            total: total,
            page: page,
            pageSize: pageSize,
            totalPages: Math.ceil(total / pageSize)
        });
    } catch (error) {
        res.status(500).send({ error: (error as Error).message || 'Error al obtener las etiquetas' });
    }
});


// Obtener una etiqueta por ID
router.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const etiqueta = await prisma.etiqueta.findUnique({
            where: { id: Number(id) },
        });
        if (etiqueta) {
            res.json(etiqueta);
        } else {
            res.status(404).send({ error: 'Etiqueta no encontrada' });
        }
    } catch (error) {
        res.status(500).send({ error: (error as Error).message || 'Error al obtener la etiqueta' });
    }
});

// Crear una nueva etiqueta
router.post('/', async (req: Request, res: Response) => {
    const { nombre } = req.body;
    try {
        const nuevaEtiqueta = await prisma.etiqueta.create({
            data: { nombre },
        });
        res.json(nuevaEtiqueta);
    } catch (error) {
        res.status(500).send({ error: (error as Error).message || 'Error al crear la etiqueta' });
    }
});

// Actualizar una etiqueta
router.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nombre } = req.body;
    try {
        const etiquetaActualizada = await prisma.etiqueta.update({
            where: { id: Number(id) },
            data: { nombre },
        });
        res.json(etiquetaActualizada);
    } catch (error) {
        res.status(500).send({ error: (error as Error).message || 'Error al actualizar la etiqueta' });
    }
});

// Eliminar una etiqueta
router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.etiqueta.delete({
            where: { id: Number(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).send({ error: (error as Error).message || 'Error al eliminar la etiqueta' });
    }
});

export default router;
