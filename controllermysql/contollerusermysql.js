const { validationResult } = require('express-validator');
const dbmysql = require('../datbasemysql/databasemysql.js');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');


const userRegistromysql = async (req, res) => {
    const { nombre, email, password, repeatPassword } = req.body;
    const errores = validationResult(req);

    if (password !== repeatPassword) {
        return res.status(400).json({ error: 'Las contraseñas no coinciden' });
    }

    if (!errores.isEmpty()) {
        console.log(errores);
        return res.status(400).json({ mensaje: 'Errores en los datos ingresados' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    let connection;

    try {
        // Establecer la conexión
        connection = await dbmysql.promise();

        // Iniciar transacción
        await connection.beginTransaction();

        // Ejecutar la consulta de inserción
        await connection.execute('INSERT INTO USUARIOSHELADOS (nombre, email, password) VALUES (?, ?, ?)', [nombre, email, hash]);

        // Commit de la transacción
        await connection.commit();

        // Enviar correo de confirmación
        sendConfirmationEmail(email, nombre);

        return res.status(200).json({ mensaje: 'Registro exitoso, te llegará un email con tus datos!' });
    } catch (error) {
        console.error('Error en el registro', error);

        if (connection && connection.state !== 'disconnected') {
            // Rollback en caso de error
            await connection.rollback();
        }

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ mensaje: 'El correo electrónico ya está registrado' });
        }

        return res.status(500).json({ mensaje: 'Error en el servidor' });
    } 
};





// Función para enviar correo de confirmación
const sendConfirmationEmail = async (email, nombre) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.USEREMAIL,
            pass: process.env.PASSGMAIL
        },
        authMethod: 'PLAIN',
    });

    const mailOptions = {
        from: process.env.USEREMAIL, //.env
        to: email,
        subject: 'Confirmación de Registro',
        html: `<div style="font-family: Arial, sans-serif; background-color: #f2f2f2; padding: 20px; text-align: center;">
      <h1 style="color: #0077b6;">¡Bienvenido a mi App!</h1>
      <p style="font-size: 16px;">Gracias por registrarte,<h1>${nombre}</h1>.</p>
      <p style="font-size: 16px;">A partir de este momento, te encuentras registrado para recibir toda la información sobre nuestras actividades.</p>
      <h2 style="font-size: 16px;">¡Felicidades!</h2>
      <p style="font-size: 16px;">Te has registrado con los siguientes datos:</p>
      <p style="font-size: 16px;">Email de registro: <strong>${email}</strong></p>
      </div>
      `,
    };
    await transporter.sendMail(mailOptions);
};

const UserLoginmysql = (req, res) => {
    const { email, password } = req.body;
    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        console.log(errores);
        return res.status(400).json({ mensaje: 'Errores en los datos ingresados' });
    }

    let sql = 'SELECT * FROM USUARIOSHELADOS WHERE email = ?';

    dbmysql.query(sql, [email], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ mensaje: 'Error en el servidor' });
        }

        if (Array.isArray(result) && result.length > 0) {
            const user = result[0];
            const storedPassword = user.password;

            if (typeof storedPassword === 'string') {
                const passwordMatch = bcrypt.compareSync(password, storedPassword);

                if (passwordMatch) {
                    // Puedes personalizar los datos que deseas enviar al frontend
                    const userData = {
                        id: user.id,
                        nombre: user.nombre,
                        email: user.email,
                    };

                    // Aquí puedes decidir si redirigir o enviar datos JSON al frontend
                    // En este caso, estoy enviando datos JSON
                    return res.status(200).json({
                        mensaje: 'Estás logueado',
                        usuario: userData,
                    });
                } else {
                    return res.status(401).json({ mensaje: 'Credenciales inválidas' });
                }
            } else {
                return res.status(401).json({ mensaje: 'Credenciales inválidas' });
            }
        } else {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }
    });
};









module.exports = {
    userRegistromysql,
    UserLoginmysql,
};