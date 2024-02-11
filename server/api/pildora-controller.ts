import * as express from 'express';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

router.get('/', async (req, res) => {
  const { page, size, sortBy, sortOrder, titulo, contenido, etiqueta } = req.query;

  // Parsear parámetros de paginación
  const pageNumber = parseInt(page as string) || 0;
  const pageSize = parseInt(size as string) || 10;

  // Parsear parámetros de ordenación
  const orderBy = sortBy ? {
    [sortBy as string]: sortOrder === 'desc' ? 'desc' : 'asc',
  } : undefined;

  // Construir condiciones de filtrado
  let where: Prisma.PildoraWhereInput = {
    titulo: titulo ? { contains: titulo as string } : undefined,
    contenido: contenido ? { contains: contenido as string } : undefined,
  };

  // Filtrar por nombre de etiqueta, si se proporciona
  if (etiqueta) {
    where = {
      ...where,
      etiquetas: {
        some: {
          nombre: {
            contains: etiqueta as string,
          },
        },
      },
    };
  }

  try {
    const pildoras = await prisma.pildora.findMany({
      where,
      skip: pageNumber * pageSize,
      take: pageSize,
      orderBy,
      include: {
        etiquetas: true, // Incluir las etiquetas en la respuesta para verificar el filtrado
      },
    });

    const totalPildoras = await prisma.pildora.count({ where });

    res.json({
      data: pildoras,
      total: totalPildoras,
      pageNumber,
      pageSize,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: (error as Error).message || 'Error al obtener las pildoras' });
  }
  // catch (error: unknown) {
  //     if (error instanceof Error) {
  //         console.error("Error completo:", error);
  //         res.status(500).send({ error: error.message });
  //     } else {
  //         console.error("Error desconocido:", error);
  //         res.status(500).send({ error: 'Error al obtener las píldoras' });
  //     }
  // }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pildora = await prisma.pildora.findUnique({
      where: { id: Number(id) },
      include: { etiquetas: true }, // Incluir relaciones si es necesario
    });
    if (pildora) {
      res.json(pildora);
    } else {
      res.status(404).send({ message: 'Píldora no encontrada' });
    }
  } catch (error) {
    res.status(500).send({ error: 'Error al obtener la píldora' });
  }
});

router.post('/:pildoraId/etiqueta/:etiquetaId', async (req, res) => {
  const { pildoraId, etiquetaId } = req.params;
  try {
    const pildora = await prisma.pildora.update({
      where: { id: Number(pildoraId) },
      data: {
        etiquetas: {
          connect: { id: Number(etiquetaId) }, // Conecta una etiqueta existente
        },
      },
    });
    res.json(pildora);
  } catch (error) {
    res.status(500).send({ error: 'Error al añadir la etiqueta a la píldora' });
  }
});

router.post('/', async (req, res) => {
  const { titulo, contenido, pasoSecuencia, idSecuencia, etiquetas } = req.body;
  try {
    const nuevaPildora = await prisma.pildora.create({
      data: {
        titulo,
        contenido,
        pasoSecuencia,
        idSecuencia,
        etiquetas: {
          connect: etiquetas.map((id: number) => ({ id }))
        }
      },
    });
    res.status(201).json(nuevaPildora);
  } catch (error) {
    res.status(500).send({ error: 'Error al crear la píldora' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, contenido, pasoSecuencia, idSecuencia } = req.body;
  try {
    const pildoraActualizada = await prisma.pildora.update({
      where: { id: Number(id) },
      data: {
        titulo,
        contenido,
        pasoSecuencia,
        idSecuencia,
        // Ajustar para relaciones si es necesario
      },
    });
    res.json(pildoraActualizada);
  } catch (error) {
    res.status(500).send({ error: 'Error al actualizar la píldora' });
  }
});

router.delete('/:pildoraId/etiqueta/:etiquetaId', async (req, res) => {
  const { pildoraId, etiquetaId } = req.params;
  try {
    const pildora = await prisma.pildora.update({
      where: { id: Number(pildoraId) },
      data: {
        etiquetas: {
          disconnect: { id: Number(etiquetaId) }, // Desconecta la etiqueta
        },
      },
    });
    res.json(pildora);
  } catch (error) {
    res.status(500).send({ error: 'Error al remover la etiqueta de la píldora' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Intentando borrar la píldora con ID: ${id}`);
  try {
    await prisma.pildora.delete({
      where: { id: Number(id) },
    });
    res.status(204).send(); // No Content
  } catch (error) {
    console.error('Error al eliminar la píldora:', error);
    res.status(500).send({ error: 'Error al eliminar la píldora' });
  }
});

export default router;
