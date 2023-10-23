const express = require('express')
const cors = require('cors')
const jwt = require("jsonwebtoken")
const app = express()


app.use(express.json())
app.use(cors())

const { newUser, userAccess, userData } = require('./consultas')
const port = 3000

app.listen(port, () => {
    console.log(`Servidor escuchando en puerto ${port}`)
})


app.post('/usuarios',  async (req, res) => {
    try {
        const { email, password, rol, lenguage } = req.body
        await newUser(email, password, rol, lenguage)
        res.send('usuario registrado exitosamente')
    }
    catch (error) {
        console.log(error)
        res.status(error.code || 500).send(error)
    }
})


app.post('/login',  async (req, res) => {
    try {
        const { email, password } = req.body
        await userAccess(email, password)
        const token = jwt.sign({ email }, "az_AZ")
        res.send(token)
    }
    catch (error) {
        console.log(error)
        res.status(error.code || 500).send(error)
    }
})

app.get('/usuarios',  async (req, res) => {
    try {
        const Authorization = req.header("Authorization")
        const token = Authorization.split("Bearer ")[1]
        jwt.verify(token, "az_AZ")
        const { email } = jwt.decode(token)
        const datos = await userData(email)
        res.json(datos)
    }
    catch (error) {
        console.log(error)
        res.status(error.code || 500).send(error)
    }
})