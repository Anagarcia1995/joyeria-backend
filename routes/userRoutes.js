const express = require('express');
const {
  signup,
  login,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario,
} = require('../controllers/userController');
const verificarToken = require('../middleware/auth');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.get('/', verificarToken, obtenerUsuarios);
router.get('/:id', verificarToken, obtenerUsuarioPorId);
router.patch('/:id', verificarToken, actualizarUsuario);
router.delete('/:id', verificarToken, eliminarUsuario);

module.exports = router;
