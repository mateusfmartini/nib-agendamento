const app = require('express')()
const consign = require('consign')
const db = require('./config/db')

app.db = db

consign()
    .include('./config/middlewares.js')
    .then('./api/validation.js')
    .then('./api')
    .then('./config/routes.js')
    .into(app)

app.listen(4000, () => {
    console.log('Backend executando...')
})