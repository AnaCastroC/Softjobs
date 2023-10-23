const { Pool } = require('pg')
const bcrypt = require('bcryptjs')

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'password',
    database: 'softjobs',
    port: 5432,
    allowExitOnIdle: true
})

pool.connect(
    console.log('Servidor conectado a la base de datos')
);

const newUser = async (email, password, rol, lenguaje) => {
    const consulta = 'INSERT INTO usuarios VALUES (DEFAULT, $1, $2, $3, $4)'
    const encryptedPassword = bcrypt.hashSync(password)
    const values = [email, encryptedPassword, rol, lenguaje]
    await pool.query(consulta, values)
}

const userAccess = async (email, password) => {
    const values = [email]
    const consulta = "SELECT * FROM usuarios WHERE email = $1"
    const { rows: [usuario], rowCount } = await pool.query(consulta, values)
    const { password: encryptedPassword } = usuario
    const correctPassword = bcrypt.compareSync(password, encryptedPassword)
    if (!correctPassword  || !rowCount)
        throw { code: 401, message: "Contraseña o email incorrecto" }
}

const userData = async (email) => {
    const consulta = "SELECT * FROM usuarios WHERE email = $1"
    const values = [email]
    const { rows: [usuario], rowCount } = await pool.query(consulta, values)

    if (!rowCount) {
        throw { code: 404, message: "Usuario no registrado" }
    }
    delete usuario.password
    return usuario
}

module.exports = { newUser, userAccess, userData }