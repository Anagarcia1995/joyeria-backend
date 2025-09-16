const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/userModel");

// Registro de usuario
const signup = async (req, res) => {
  const { nombre, correo, contraseña, rol } = req.body;

  try {
    const usuarioExistente = await Usuario.findOne({ correo });
    if (usuarioExistente) {
      return res.status(400).json({ msg: "El correo ya está registrado" });
    }

    const rolAsignado = rol === "admin" ? "admin" : "user";
    const nuevoUsuario = new Usuario({
      nombre,
      correo,
      contraseña,
      rol: rolAsignado,
    });
    await nuevoUsuario.save();

    const token = jwt.sign(
      { id: nuevoUsuario._id, rol: nuevoUsuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(201).json({
      msg: "Usuario registrado exitosamente",
      token,
      usuario: {
        _id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo,
        rol: nuevoUsuario.rol,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al registrar el usuario" });
  }
};

// Login de usuario
const login = async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({ msg: "Usuario no encontrado" });
    }

    const esValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!esValida) {
      return res.status(400).json({ msg: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      msg: "Login exitoso",
      token,
      usuario: {
        _id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al iniciar sesión" });
  }
};

// Obtener todos los usuarios
const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.status(200).json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener los usuarios" });
  }
};

// Obtener un usuario por ID
const obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener el usuario" });
  }
};

// Actualizar usuario
const actualizarUsuario = async (req, res) => {
  try {
    const { nombre, correo, contraseña } = req.body;

    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

    if (nombre) usuario.nombre = nombre;
    if (correo) usuario.correo = correo;
    if (contraseña) usuario.contraseña = contraseña; // se encripta con pre-save hook

    await usuario.save();

    res.status(200).json({ msg: "Usuario actualizado exitosamente", usuario });
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar el usuario" });
  }
};

// Eliminar usuario
const eliminarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

    res.status(200).json({ msg: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar el usuario" });
  }
};

module.exports = {
  signup,
  login,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario,
};
