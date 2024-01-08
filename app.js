const express = require ("express")
const cors = require ('cors')
//importamos la conexión a la DB
const dbmysql = require ('./datbasemysql/databasemysql.js')
//importamos nuestro enrutador
const routermysql = require ('./routers/usermysql.js')
const heladosroutes = require ('./routers/heladosroutes.js')
const path = require('path');

const PORT = 9000



const appmysql = express();

// Configuración del motor de vistas
// Configurar el motor de plantillas
appmysql.set('views', path.join(__dirname, 'views')); // Ruta correcta a tus vistas
appmysql.set('view engine', 'ejs'); // Usar EJS como motor de plantillas

// Configuración del middleware
appmysql.use(cors());
appmysql.use(express.json());
appmysql.use(express.urlencoded({ extended: true }));

// Definir ruta principal
appmysql.get('/', (req, res) => {
    res.send('HELLO WORDS "MY BACKEND"');
});

// Usar enrutador para las rutas de usuario
appmysql.use('/user', routermysql);
appmysql.use(express.json());
appmysql.use(express.urlencoded({ extended: true }));
appmysql.use('/', heladosroutes);

appmysql.listen(9000, () => {
    console.log('Server UP running in http://localhost:9000/');
});

appmysql.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
  });

/* app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/blogs', blogRoutes); */


/* app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/Product', ProductRouter); */


