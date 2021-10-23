import { ObjectId } from 'mongodb';
import { getDB } from '../db/db.js';
import jwt_decode from 'jwt-decode';

const autorizacionEstadoUsuario = async (req, res, next) => {
  // paso 1: obtener el usuario desde el token
  const token = req.headers.authorization.split('Bearer ')[1];
  const user = jwt_decode(token)['http://localhost/userData'];
  console.log('**** DATOS DEL USUARIO ****',user);
 
  // paso 2: consultar el usuario en la BD
  const baseDeDatos = getDB();
  console.log('ANTES DEL AWAIT');
  await baseDeDatos.collection('usuarios').findOne({ email: user.email }, async (err, response) => {
    console.log('-->> INGRESO AL AWAIT');
    if (response) {
      console.log('-------------- MONGO RESPONDE ------', response);
      // paso 3: verificar el estado del usuario.
      if (response.estado === 'rechazado') {
        // paso 4: si el usuario es rechazado, devolver un error de autenticacion.
        res.sendStatus(401);
        res.end();
      } else {
        console.log('USUARIO HABILITADO');
        // paso 5: si el usuario está pendiente o habilitado, ejecutar next()
        next();
      }
    }else{
      console.log('!!! SIN RESPUESTA DE MONGO ');
      next();
    }
  });

};

export default autorizacionEstadoUsuario;
