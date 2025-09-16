const Usuario = require('../models/userModel');

const verificarAdmin = async (req, res, next) => {
  try {
    // Debe existir req.usuarioId del middleware auth
    if (!req.usuarioId) {
      return res.status(401).json({ msg: 'Acceso denegado. No autenticado.' });
    }

    const usuario = await Usuario.findById(req.usuarioId).select('rol');
    if (!usuario) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    if (usuario.rol !== 'admin') {
      return res.status(403).json({ msg: 'Acceso denegado. Se requiere rol de administrador.' });
    }

    next();
  } catch (error) {
    console.error('Error al verificar rol de administrador:', error);
    res.status(500).json({ msg: 'Error al verificar rol de administrador' });
  }
};

module.exports = verificarAdmin;
