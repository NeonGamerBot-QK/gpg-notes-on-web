require("dotenv/config")
const express = require('express')
const openpgp = require('openpgp')
const app = express()
app.use(express.json())
app.set("view engine", 'ejs')
app.set('views', __dirname + "/views")
app.get('/', (req,res) => {

})

app.get('/api/genkey', (req,res) => {
    const email  = req.query.email
    const name = req.query.name || Math.random().toFixed(20).toString().split('.')[1].slice(0,7)
openpgp.generateKey({
    userIDs: []
})
})