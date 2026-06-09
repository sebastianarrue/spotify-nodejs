const express = require('express');
const songController = require('../controllers/song');
const isAuth = require('../middlewares/is-auth');
const isAdmin = require('../middlewares/is-admin');
const upload = require('../middlewares/upload');

const router = express.Router();

/**
 * @openapi
 * /songs:
 *   get:
 *     summary: Obtener lista de canciones con paginación
 *     tags: [Songs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *     responses:
 *       '200':
 *         description: Lista de canciones devuelta con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 songs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       album:
 *                         type: string
 *                       author:
 *                         type: string
 *                       imageUrl:
 *                         type: string
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *       '401':
 *         description: No autorizado
 */
router.get('/', isAuth, songController.getSongs);

/**
 * @openapi
 * /songs/create:
 *   post:
 *     summary: Crear una nueva canción (solo admin)
 *     tags: [Songs]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - album
 *               - author
 *             properties:
 *               title:
 *                 type: string
 *                 example: Bohemian Rhapsody
 *               album:
 *                 type: string
 *                 example: A Night at the Opera
 *               author:
 *                 type: string
 *                 example: Queen
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Imagen de la canción
 *     responses:
 *       '201':
 *         description: Canción creada exitosamente
 *       '401':
 *         description: No autorizado
 *       '403':
 *         description: Acción permitida solo para administradores
 */
router.post(
    '/create', 
    isAuth, 
    isAdmin, 
    upload.single('image'),
    songController.createSong
);

/**
 * @openapi
 * /songs/edit/{id}:
 *   put:
 *     summary: Editar una canción existente (solo admin)
 *     tags: [Songs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la canción
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Bohemian Rhapsody
 *               album:
 *                 type: string
 *                 example: A Night at the Opera
 *               author:
 *                 type: string
 *                 example: Queen
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Imagen de la canción
 *     responses:
 *       '200':
 *         description: Canción actualizada exitosamente
 *       '401':
 *         description: No autorizado
 *       '403':
 *         description: Acción permitida solo para administradores
 *       '404':
 *         description: Canción no encontrada
 */
router.put(
    '/edit/:id', 
    isAuth, 
    isAdmin, 
    upload.single('image'), 
    songController.editSong
);

/**
 * @openapi
 * /songs/delete/{id}:
 *   delete:
 *     summary: Eliminar una canción (solo admin)
 *     tags: [Songs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la canción
 *     responses:
 *       '200':
 *         description: Canción eliminada exitosamente
 *       '401':
 *         description: No autorizado
 *       '403':
 *         description: Acción permitida solo para administradores
 *       '404':
 *         description: Canción no encontrada
 */
router.delete('/delete/:id', isAuth, isAdmin, songController.deleteSong);

module.exports = router;