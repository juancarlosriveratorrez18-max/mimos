import express from "express";
import {getUsuarios, getUsuarioPorId, updateUsuario, deleteUsuario} from "../controllers/user.js";

const router = express.Router();
router.get('/', getUsuarios);
router.get('/:id', getUsuarioPorId);
router.put('/:id', updateUsuario);
router.delete('/:id', deleteUsuario);

export default router;