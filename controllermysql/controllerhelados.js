const dbmysql = require ('../datbasemysql/databasemysql.js')


const createHelado = (req, res) => {
    const { nombre, detalles, imagen, precio } = req.body;

    // Elimina el símbolo de dólar y cualquier otro carácter no numérico del precio
    const precioNumerico = parseFloat(precio.replace(/[^\d.]/g, ''));

    const data = {
        nombre: nombre,
        detalles: detalles,
        imagen: imagen,
        precio: precioNumerico  // Utiliza el valor numérico sin el símbolo de dólar
    }

    dbmysql.query('INSERT INTO HELADOS SET ?', data, (error, result) => {
        if (error) {
            console.error('Error al crear el producto', error);
            return res.status(500).json({ mensaje: 'Error interno del servidor' });
        } else {
            // Después de la inserción exitosa, responde con un JSON que incluye la URL de redirección
            return res.json({ mensaje: 'Producto agregado al carrito', redirect: '/carrito' });
        }
    });
};

const ventasHelados = (req, res) => {
    let sql = `SELECT * FROM HELADOS`;

    dbmysql.query(sql, (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json({
                mensaje: 'Hubo un error en la base de datos',
                error
            });
        } else {
            return res.json({ dato: result });
        }
    });
};



const eliminarHelados = (req, res) => {
    const productId = req.params.id;

    dbmysql.query('DELETE FROM HELADOS WHERE id = ?', [productId], (err, result) => {
        if (err) {
            console.error('Error al eliminar el producto', err);
            res.status(500).send('Error en el servidor');
        } else {
            console.log(`Producto con ID ${productId} eliminado exitosamente`);
            res.redirect("/carrito");
            /* res.status(200).send('Producto eliminado exitosamente'); */
        }
    });
};



const comprarHelados = (req, res) => {
    const productId = req.params.id;
  
    // Obtener el producto
    dbmysql.query('SELECT * FROM HELADOS WHERE id = ?', [productId], (errProducto, productos) => {
      if (errProducto) {
        console.error('Error al obtener el producto', errProducto);
        return res.status(500).send('Error en el servidor');
      }
  
      const producto = productos[0];
  
      if (!producto) {
        return res.status(404).send('Producto no encontrado');
      }
  
      // Registrar la venta en la tabla de ventas
      const fechaVenta = new Date(); // Obtener la fecha actual
      dbmysql.query('INSERT INTO VENTAHELADOS (nombre, detalles, fecha, precio, imagen, total) VALUES (?, ?, ?, ?, ?, ?)', [producto.nombre, producto.detalles, fechaVenta, producto.precio, producto.imagen, producto.precio], (errInsert, resultInsert) => {
        if (errInsert) {
          console.error('Error al insertar la venta', errInsert);
          return res.status(500).send('Error en el servidor');
        }
  
        // Enviar los datos de la compra al cliente como JSON, incluyendo la fecha
        res.json({ dato: [{ ...producto, fecha: fechaVenta }] });
      });
    });
  };
  



module.exports = {
    createHelado,
    ventasHelados,
    eliminarHelados,
    comprarHelados,
};