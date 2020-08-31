const express = require('express')
const router = express.Router()

router.get('/', (req, res) =>{
    res.send({"msg" : "olá! testando app"})
})

module.exports = router