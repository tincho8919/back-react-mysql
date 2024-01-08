const dotenv = require ("dotenv")

const mysql = require ("mysql2")

dotenv.config();

const dbmysql = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '34697923Fm@',
    port: '3306',
    database: 'SUPERHELADOS'
   

});


dbmysql.connect((err) =>{

    if (err) {
        console.error('Error en la conexión a la base de datos:', err);
        return;
      }
    console.log(`Conexion a la database ${'SUPERHELADOS'} conexion exitosa`);
        
});

module.exports = dbmysql;