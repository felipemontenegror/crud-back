const express = require('express')
const bodyParser = require('body-parser')
const connectDB = require('./config/db')

const path = require('path');
var cors = require('cors')
const app = express()
const PORT = process.env.PORT || 3001;

// init Middleware
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cors())

//connect Mongo DB
connectDB()

app.use (function (req, res, next) {   // middleware de https 
    var schema = (req.headers['x-forwarded-proto'] || '').toLowerCase();
    if (req.headers.host.indexOf('localhost') < 0 && schema !== 'https') {
        // request was via http, so redirect to https
        res.redirect('https://' + req.headers.host + req.url);   // https + a porta local host3001 + a url final da pagina 
    }
    next();
});


// define routes
app.use('/usuario', require('./routes/api/usuario'))
app.use('/profile', require('./routes/api/profile')) 
app.use('/auth', require('./routes/api/auth'))  
app.use('/education', require('./routes/api/education'))

app.get('/', (req, res) => res.send('Hello!'))  

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname))
})


app.listen(PORT, () => { console.log(`Rodando na porta ${PORT}`) })
