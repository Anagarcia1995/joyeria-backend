Este es el backend de la web de una joyería, construido con Node.js, Express y MongoDB, que permite gestionar productos, usuarios, favoritos y cesta de compras. Incluye autenticación por JWT y control de roles (admin y usuario).



Tecnologías utilizadas
Node.js
Express.js
MongoDB (con Mongoose)
JWT para autenticación
bcryptjs para encriptar contraseñas
CORS para permitir peticiones desde el frontend



Las contraseñas nunca se guardan en texto plano, siempre se encriptan con bcrypt.

Los endpoints de favoritos y cesta se manejan con IDs de productos para mantener la relación con los usuarios.


