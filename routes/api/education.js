const express = require('express');
const Profile = require('../../models/profile');
const User = require('../../models/usuario');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const auth = require('../../middleaware/auth')

// rota específica para education, enviar/manipular os dados de skills de educaçao (em education.js)

// @route    POST /education
// @desc     CREATE education
// @access   Private
router.post('/', auth, async (req, res, next) => {
    try {

    const id = req.user.id    //pega o Id na requisição
    const profile = await Profile.findOneAndUpdate({user : id}, { $push : { education :  req.body }} , { new: true }) //atualizar o dado de perfil/campo education. New True é o dado ja alterado
    if (profile) {                                              // $push é operador mongoose, insere dados num registro que ja existe no corpo de dados. Inserido no req.body. 
      res.json(profile)  // se for verdadeiro, retorna o perfil ja alterado com a nova atualizacao
    } else {
      res.status(404).send({ "error": "user not found" }) // erro nao foi encontrado o usuario
    }
    } catch (err) {
      console.error(err.message)
      res.status(500).send({ "error": "Server Error" })  // catch vai pegar o erro e enviar o erro no servidor
    }
  })

// @route    DELETE /education
// @desc     DELETE education
// @access   Private
router.delete('/', auth, async (req, res, next) => {  // invés de postar, essa função modifica deletando, um atributo específico dentro de education
  try {
    const id = req.user.id
    const profile = await Profile.findOneAndUpdate({ user: id }, { $pull: { education: req.body } }, { new: true }) //pull é função mongoose de retirar de dentro do corpo da requisição (education) 
    if (profile) {
      res.json(profile)
    } else {
      res.status(404).send({ "error": "user not found" })
    }
  } catch (err) {
    console.error(err.message)
    res.status(500).send({ "error": "Server Error" })
  }
})




module.exports = router;
