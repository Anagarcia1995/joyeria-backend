const express = require('express');
const {
  crearProducto,
  obtenerProductos,
  actualizarProducto,
  eliminarProducto
} = require('../controllers/productController');

const verificarToken = require('../middleware/auth');
const verificarAdmin = require('../middleware/admin');

const router = express.Router();

// Lectura pública (si prefieres que requiera login, añade verificarToken aquí también)
router.get('/', obtenerProductos);

// Solo administradores para crear/actualizar/eliminar
router.post('/', verificarToken, verificarAdmin, crearProducto);
router.patch('/:id', verificarToken, verificarAdmin, actualizarProducto);
router.delete('/:id', verificarToken, verificarAdmin, eliminarProducto);

module.exports = router;
