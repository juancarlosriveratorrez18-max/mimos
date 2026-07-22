import express from 'express';
import { listarHelados, obtenerHelado, obtenerPorCat, crear, editar, eliminar } from '../controllers/heladoControllers.js';
import {verificarToken, verificarAdmin} from '../middleware/authMiddleware.js';

const router = express.Router();

// GET - Obtener todos
router.get('/helados', listarHelados);

// GET - Obtener por ID
router.get('/helados/:id', obtenerHelado);

// GET - Obtener por categoría
router.get('/helados/categoria/:categoria', obtenerPorCat);

// Rutas privadas 
// POST - Crear helado
router.post('/helados', verificarToken, verificarAdmin, crear);

// PUT - Actualizar helado
router.put('/helados/:id', verificarToken, verificarAdmin, editar);

// DELETE - Eliminar helado
router.delete('/helados/:id', verificarToken, verificarAdmin, eliminar);

export default router;