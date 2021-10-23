import { ObjectId } from 'mongodb';
import { getDB } from '../../db/db.js';

const queryAllProducts = async (callback) => {
  const baseDeDatos = getDB();
  await baseDeDatos.collection('productos').find({}).limit(50).toArray(callback);
};

const crearProducto = async (datosProducto, callback) => {
  if (
    Object.keys(datosProducto).includes('descripcion') &&
    Object.keys(datosProducto).includes('valor') &&
    Object.keys(datosProducto).includes('estado')
  ) {
    const baseDeDatos = getDB();
    // implementar código para crear el producto en la BD

    await baseDeDatos.collection('productos').insertOne(datosProducto, callback);
  } else {
    return 'error';
  }
};

const consultarProducto = async (id, callback) => {
  const baseDeDatos = getDB();
  await baseDeDatos.collection('productos').findOne({ _id: new ObjectId(id) }, callback);
};

const editarProducto = async (id, edicion, callback) => {
  const filtroProducto = { _id: new ObjectId(id) };
  const operacion = {
    $set: edicion,
  };
  const baseDeDatos = getDB();
  await baseDeDatos
    .collection('productos')
    .findOneAndUpdate(filtroProducto, operacion, { upsert: true, returnOriginal: true }, callback);
};

const eliminarProducto = async (id, callback) => {
  const filtroProducto = { _id: new ObjectId(id) };
  const baseDeDatos = getDB();
  await baseDeDatos.collection('productos').deleteOne(filtroProducto, callback);
};

export { queryAllProducts, crearProducto, consultarProducto, editarProducto, eliminarProducto };
