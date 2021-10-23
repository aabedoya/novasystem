import { ObjectId } from 'mongodb';
import { getDB } from '../db/db.js';
import jwt_decode from 'jwt-decode';

const autorizacionEstadoUsuario = async (req, res, next) => {
  // paso 1: obtener el usuario desde el token
  const token = req.headers.authorization.split('Bearer ')[1];
  const user = jwt_decode(token)['http://localhost/userData'];
  console.log('datos del usuario',user);

  // paso 2: consultar el usuario en la BD
  const baseDeDatos = getDB();
  console.log('Antes await');
  await baseDeDatos.collection('usuarios').findOne({ email: user.email }, async (err, response) => {
    console.log('Dentro del await');
    if (response) {
      console.log('respuesta de Mongo', response);
      // paso 3: verificar el estado del usuario.
      if (response.estado === 'rechazado') {
        // paso 4: si el usuario es rechazado, devolver un error de autenticacion.
        res.sendStatus(401);
        res.end();
      } else {
        console.log('habilitado');
        // paso 5: si el usuario está pendiente o habilitado, ejecutar next()
        next();
      }
    }else{
      console.log('SIN RESPUESTA');
      next();
    }
  });

};

export default autorizacionEstadoUsuario;
