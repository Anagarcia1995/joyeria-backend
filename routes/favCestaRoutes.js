const express = require('express');
const {
  obtenerFavoritos,
  agregarAFavoritos,
  quitarDeFavoritos,
  tenerCesta,
  agregarACesta,
  quitarDeCesta,
  actualizarCantidadCesta
} = require('../controllers/favCestaController');
const verificarToken = require('../middleware/auth');

const router = express.Router();

// Favoritos
router.post('/favoritos', verificarToken, agregarAFavoritos);   // Añadir favorito
router.delete('/favoritos', verificarToken, quitarDeFavoritos); // Quitar favorito
router.get('/favoritos', verificarToken, obtenerFavoritos);     // Listar favoritos

// Cesta
router.post('/cesta', verificarToken, agregarACesta);   // Añadir producto a la cesta
router.delete('/cesta', verificarToken, quitarDeCesta); // Quitar producto de la cesta
router.get('/cesta', verificarToken, tenerCesta);     // Listar productos de la cesta
router.put('/cesta', verificarToken, actualizarCantidadCesta);

module.exports = router;
