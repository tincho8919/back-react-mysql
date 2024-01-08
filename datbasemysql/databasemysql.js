const dotenv = require ("dotenv")

const mysql = require ("mysql2")

dotenv.config();

const dbmysql = mysql.createConnection({
    host: 'bdvuhxeu2tqeon8hmdd0-mysql.services.clever-cloud.com',
    user: 'uyn30cdj8nkxtayf',
    password: '7rCTnz6nm1VhrCgXhytb',
    port: '3306',
    database: 'bdvuhxeu2tqeon8hmdd0'
   

});


dbmysql.connect((err) =>{

    if (err) {
        console.error('Error en la conexión a la base de datos:', err);
        return;
      }
    console.log(`Conexion a la database ${'bdvuhxeu2tqeon8hmdd0'} conexion exitosa`);
        
});

module.exports = dbmysql;