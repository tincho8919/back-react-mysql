const express = require ('express');
const cotrollerhelados = require ('../controllermysql/controllerhelados.js')
const ruta = express.Router();





/* ruta.get('/postres',cotrollerhelados.Postres); */
ruta.post('/helados',cotrollerhelados.createHelado);

ruta.post('/postres',cotrollerhelados.createHelado);

ruta.post('/carrito', cotrollerhelados.createHelado);

ruta.post('/compra/:id', cotrollerhelados.comprarHelados);

ruta.get('/carrito',cotrollerhelados.ventasHelados);

ruta.get('/compra/:id',cotrollerhelados.comprarHelados);

ruta.post('/delete/:id', cotrollerhelados.eliminarHelados);





module.exports = ruta;