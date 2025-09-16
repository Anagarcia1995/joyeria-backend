const Usuario = require("../models/userModel");

// Obtener favoritos
const obtenerFavoritos = async (req, res) => {
  const id = req.usuarioId;

  try {
    const usuario = await Usuario.findById(id).populate("favoritos");

    if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

    res.status(200).json(usuario.favoritos);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener los favoritos" });
  }
};

// Agregar a favoritos
const agregarAFavoritos = async (req, res) => {
  const id = req.usuarioId;
  const { productoId } = req.body;

  try {
    const usuario = await Usuario.findById(id);
    if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

    if (usuario.rol === "admin") {
      return res.status(403).json({ msg: "Los administradores no pueden modificar favoritos." });
    }

    if (!usuario.favoritos.includes(productoId)) {
      usuario.favoritos.push(productoId);
      await usuario.save();
      return res.status(200).json({ msg: "Producto añadido a favoritos" });
    }

    res.status(400).json({ msg: "Producto ya está en favoritos" });
  } catch (error) {
    res.status(500).json({ msg: "Error al añadir producto a favoritos" });
  }
};

// Quitar de favoritos
const quitarDeFavoritos = async (req, res) => {
  const id = req.usuarioId;
  const { productoId } = req.body;

  try {
    const usuario = await Usuario.findById(id);
    if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

    usuario.favoritos = usuario.favoritos.filter(
      (fav) => fav.toString() !== productoId
    );
    await usuario.save();

    res.status(200).json({ msg: "Producto eliminado de favoritos" });
  } catch (error) {
    res.status(500).json({ msg: "Error al quitar producto de favoritos" });
  }
};

// Obtener cesta

const obtenerCesta = async (req, res) => {
  const id = req.usuarioId;

  try {
    const usuario = await Usuario.findById(id).populate("cesta.productoId");

    if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

    res.status(200).json(usuario.cesta);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener la cesta" });
  }
};

// Agregar a cesta
const agregarACesta = async (req, res) => {
  const id = req.usuarioId;
  const { productoId, cantidad } = req.body;

  try {
    const usuario = await Usuario.findById(id);
    if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

    if (usuario.rol === "admin") {
      return res.status(403).json({ msg: "Los administradores no pueden modificar la cesta." });
    }

    const productoEnCesta = usuario.cesta.find(
      (item) => item.productoId.toString() === productoId
    );

    if (productoEnCesta) {
      productoEnCesta.cantidad += cantidad;
    } else {
      usuario.cesta.push({ productoId, cantidad });
    }

    await usuario.save();
    res.status(200).json({ msg: "Producto añadido a la cesta" });
  } catch (error) {
    res.status(500).json({ msg: "Error al añadir producto a la cesta" });
  }
};

// Quitar de cesta
const quitarDeCesta = async (req, res) => {
  const id = req.usuarioId;
  const { productoId } = req.body;

  try {
    const usuario = await Usuario.findById(id);
    if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

    usuario.cesta = usuario.cesta.filter(
      (item) => item.productoId.toString() !== productoId
    );
    await usuario.save();

    res.status(200).json({ msg: "Producto eliminado de la cesta" });
  } catch (error) {
    res.status(500).json({ msg: "Error al quitar producto de la cesta" });
  }
};



module.exports = {
  obtenerFavoritos,
  agregarAFavoritos,
  quitarDeFavoritos,
  obtenerCesta,
  agregarACesta,
  quitarDeCesta
};
