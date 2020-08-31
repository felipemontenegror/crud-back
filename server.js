const express = require('express')
const bodyParser = require('body-parser')
const connectDB = require('./config/db')
const app = express()
const cors = require('cors')
const PORT = 3001

// init Middleware
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cors())

//connect Mongo DB
connectDB()

// define routes
app.use('/', require('./routes/oi'))
app.use('/usuario', require('./routes/api/usuario'))

app.listen(PORT, () => {console.log(`App rodando na porta ${PORT}`)})
