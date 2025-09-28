const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  crearProducto,
  obtenerProductos,
  actualizarProducto,
  eliminarProducto
} = require('../controllers/productController');

const verificarToken = require('../middleware/auth');
const verificarAdmin = require('../middleware/admin');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads')); // ../uploads
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
    cb(null, unique);
  }
});
const fileFilter = (req, file, cb) => {
  // aceptar solo imágenes
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Sólo se permiten imágenes.'), false);
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB límite


// Lectura pública (si prefieres que requiera login, añade verificarToken aquí también)
router.get('/', obtenerProductos);

// Solo administradores para crear/actualizar/eliminar
router.post('/', verificarToken, verificarAdmin, upload.single('imagen'), crearProducto);
router.patch('/:id', verificarToken, verificarAdmin, upload.single('imagen'), actualizarProducto);
router.delete('/:id', verificarToken, verificarAdmin, eliminarProducto);

module.exports = router;
