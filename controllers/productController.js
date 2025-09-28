const Producto = require('../models/productModel');
const path = require('path');

const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio } = req.body;

    // si multer ha guardado archivo, estará en req.file
    let imagenPath = '';
    if (req.file) {
      // guardamos ruta relativa para luego servirla con http://localhost:5000 + imagen
      imagenPath = `/uploads/${req.file.filename}`;
    } else if (req.body.imagen) {
      // opcional: si mandas directamente una URL en body
      imagenPath = req.body.imagen;
    }

    const nuevoProducto = new Producto({
      nombre,
      descripcion,
      precio,
      imagen: imagenPath
    });

    await nuevoProducto.save();
    res.status(201).json({ msg: 'Producto creado exitosamente', producto: nuevoProducto });
  } catch (error) {
    console.error('crearProducto error:', error);
    res.status(500).json({ msg: 'Error al crear el producto' });
  }
};

const obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.find();
    res.status(200).json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener los productos' });
  }
};

const actualizarProducto = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio } = req.body;

  try {
    const productoExistente = await Producto.findById(id);
    if (!productoExistente) {
      return res.status(404).json({ msg: 'Producto no encontrado' });
    }

    // actualizar campos si vienen
    productoExistente.nombre = nombre || productoExistente.nombre;
    productoExistente.descripcion = descripcion || productoExistente.descripcion;
    productoExistente.precio = precio || productoExistente.precio;

    // si multer subió imagen nueva, reemplazar
    if (req.file) {
      productoExistente.imagen = `/uploads/${req.file.filename}`;
    } else if (req.body.imagen) {
      productoExistente.imagen = req.body.imagen;
    }

    await productoExistente.save();
    res.status(200).json({ msg: 'Producto actualizado exitosamente', producto: productoExistente });
  } catch (error) {
    console.error('actualizarProducto error:', error);
    res.status(500).json({ msg: 'Error al actualizar el producto' });
  }
};

const eliminarProducto = async (req, res) => {
  const { id } = req.params;
  try {
    const productoExistente = await Producto.findById(id);
    if (!productoExistente) {
      return res.status(404).json({ msg: 'Producto no encontrado' });
    }

    // opcional: borrar archivo físico de uploads si quieres (fs.unlink)
    await Producto.findByIdAndDelete(id);
    res.status(200).json({ msg: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar el producto' });
  }
};

module.exports = { crearProducto, obtenerProductos, actualizarProducto, eliminarProducto };
