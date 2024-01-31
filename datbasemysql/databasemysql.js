const dotenv = require ("dotenv")

const mysql = require ("mysql2")

dotenv.config();

const dbmysql = mysql.createConnection({
    host: 'bbq56ezy88vymselwqml-mysql.services.clever-cloud.com',
    user: 'u0w1f1reo1dtcers',
    password: 'jGkAW10PPaa3OLzcGxKy',
    port: '3306',
    database: 'bbq56ezy88vymselwqml'
   

});



dbmysql.connect((err) =>{

    if (err) {
        console.error('Error en la conexión a la base de datos:', err);
        return;
      }
    console.log(`Conexion a la database ${'bbq56ezy88vymselwqml'} conexion exitosa`);
        
});

module.exports = dbmysql;