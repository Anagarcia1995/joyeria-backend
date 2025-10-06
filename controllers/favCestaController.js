const Usuario = require("../models/userModel");

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

const agregarAFavoritos = async (req, res) => {
  const id = req.usuarioId;
  const { productoId } = req.body;

  try {
    const usuario = await Usuario.findById(id);
    if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

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

const tenerCesta = async (req, res) => {
  const id = req.usuarioId;

  try {
    // Buscamos el usuario y poblamos la cesta
    const usuario = await Usuario.findById(id).populate("cesta.productoId");

    if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

    // Transformamos la cesta para que el frontend reciba toda la info y la URL completa de la imagen
    const cestaTransformada = usuario.cesta
      .filter(item => item.productoId)
      .map(item => ({
        _id: item.productoId._id,
        nombre: item.productoId.nombre,
        descripcion: item.productoId.descripcion,
        precio: item.productoId.precio,
        imagen: item.productoId.imagen 
                 ? `http://localhost:5000/${item.productoId.imagen}` 
                 : null,
        cantidad: item.cantidad
      }));

    res.status(200).json(cestaTransformada);

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener la cesta" });
  }
};




const agregarACesta = async (req, res) => {
  const id = req.usuarioId;
  const { productoId, cantidad } = req.body;

  try {
    const usuario = await Usuario.findById(id);
    if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

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

const actualizarCantidadCesta = async (req, res) => {
  const id = req.usuarioId;
  const {productoId, accion} = req.body;

  try {
    const usuario = await Usuario.findById(id);
    if (!usuario) return res.status(404).json({msg: "Usuario no encontrado"});

    const productoEnCesta = usuario.cesta.find(
      (item) => item.productoId.toString() === productoId
    );
    if (!productoEnCesta) {
      return res.status(404).json({msg: "Producto no esta en la cesta"});
    }
    if (accion === "incrementar") {
      productoEnCesta.cantidad += 1;
    } else if (accion === "decrementar" && productoEnCesta.cantidad > 1) {
      productoEnCesta.cantidad -= 1;
    }
    await usuario.save();

    res.status(200).json({
      msg:"Cantidad actualizada",
      producto: {
        _id: productoEnCesta.productoId,
        cantidad: productoEnCesta.cantidad
      }
    });
  } catch (error) {
    console.error.apply(error);
    res.status(500).json({ msg: "Error al actualizar la cantidad"});
  }
};


module.exports = {
  obtenerFavoritos,
  agregarAFavoritos,
  quitarDeFavoritos,
  tenerCesta,
  agregarACesta,
  quitarDeCesta,
  actualizarCantidadCesta
};
