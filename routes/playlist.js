const express = require('express');
const playlistController = require('../controllers/playlist');
const isAuth = require('../middlewares/is-auth');

const router = express.Router();

/**
 * @openapi
 * /playlists/create:
 *   post:
 *     summary: Crear una nueva playlist
 *     tags: [Playlists]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Mis favoritos
 *               description:
 *                 type: string
 *                 example: Mis canciones favoritas del momento
 *     responses:
 *       '201':
 *         description: Playlist creada exitosamente
 *       '401':
 *         description: No autorizado
 */
router.post('/create', isAuth, playlistController.createPlaylist);

/**
 * @openapi
 * /playlists:
 *   get:
 *     summary: Obtener las playlists del usuario autenticado
 *     tags: [Playlists]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Lista de playlists devuelta con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *       '401':
 *         description: No autorizado
 */
router.get('/', isAuth, playlistController.getPlaylists);

/**
 * @openapi
 * /playlists/{id}:
 *   get:
 *     summary: Obtener una playlist por ID
 *     tags: [Playlists]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la playlist
 *     responses:
 *       '200':
 *         description: Playlist devuelta con éxito
 *       '401':
 *         description: No autorizado
 *       '404':
 *         description: Playlist no encontrada
 */
router.get('/:id', isAuth, playlistController.getPlaylist);

/**
 * @openapi
 * /playlists/add-song:
 *   post:
 *     summary: Agregar una canción a una playlist
 *     tags: [Playlists]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - playlistId
 *               - songId
 *             properties:
 *               playlistId:
 *                 type: string
 *                 example: "1"
 *               songId:
 *                 type: string
 *                 example: "60d5f484f8a4a83b8c8e4f1a"
 *     responses:
 *       '200':
 *         description: Canción agregada a la playlist
 *       '401':
 *         description: No autorizado
 *       '404':
 *         description: Playlist o canción no encontrada
 */
router.post('/add-song', isAuth, playlistController.addSongToPlaylist);

/**
 * @openapi
 * /playlists/edit/{id}:
 *   put:
 *     summary: Editar una playlist existente
 *     tags: [Playlists]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la playlist
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Nueva playlist
 *               description:
 *                 type: string
 *                 example: Nueva descripción
 *     responses:
 *       '200':
 *         description: Playlist actualizada exitosamente
 *       '401':
 *         description: No autorizado
 *       '404':
 *         description: Playlist no encontrada
 */
router.put('/edit/:id', isAuth, playlistController.editPlaylist);

/**
 * @openapi
 * /playlists/remove-song:
 *   delete:
 *     summary: Eliminar una canción de una playlist
 *     tags: [Playlists]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - playlistId
 *               - songId
 *             properties:
 *               playlistId:
 *                 type: string
 *                 example: "1"
 *               songId:
 *                 type: string
 *                 example: "60d5f484f8a4a83b8c8e4f1a"
 *     responses:
 *       '200':
 *         description: Canción eliminada de la playlist
 *       '401':
 *         description: No autorizado
 *       '404':
 *         description: Playlist o canción no encontrada
 */
router.delete('/remove-song', isAuth, playlistController.removeSongFromPlaylist);

/**
 * @openapi
 * /playlists/delete/{id}:
 *   delete:
 *     summary: Eliminar una playlist
 *     tags: [Playlists]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la playlist
 *     responses:
 *       '200':
 *         description: Playlist eliminada exitosamente
 *       '401':
 *         description: No autorizado
 *       '404':
 *         description: Playlist no encontrada
 */
router.delete('/delete/:id', isAuth, playlistController.deletePlaylist);

module.exports = router;