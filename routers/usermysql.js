const express = require ('express');
const { check } = require ('express-validator');
const { userRegistromysql, UserLoginmysql } = require ('../controllermysql/contollerusermysql.js');



const routermysql = express.Router();

routermysql.get('/registermysql', (req, res) => {
    res.send('GET request to /user/registermysql');
});


routermysql.get('/loginmysql', (req, res) => {
    res.send('GET request to /user/loginmysql');
});

// Rutas de formulario de Registro y Login
routermysql.post(
  '/registermysql',
  [
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('email', 'Por favor, ingrese un correo electrónico válido').isEmail(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
  ],
  userRegistromysql
);

routermysql.post(
  '/loginmysql',
  [
    check('email', 'Por favor, ingrese un correo electrónico válido').isEmail(),
    check('password', 'La contraseña es obligatoria').exists(),
  ],
  UserLoginmysql
  );
    


  module.exports = routermysql;