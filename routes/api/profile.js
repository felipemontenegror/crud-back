const express = require('express');
const Profile = require('../../models/profile');
const User = require('../../models/usuario');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const auth = require('../../middleaware/auth') 


// @route    GET /profile/:userId
// @desc     DETAIL profile
// @access   Private
router.get('/:userId', [], async (req, res, next) => {  // quando é uma pessoa procurando o proprio perfil
    try {
      const id = req.params.userId
      const profile = await Profile.findOne({user : id})
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


// @route    GET /profile/me
// @desc     DETAIL profile by user authenticated
// @access   Private
router.get('/me/', auth, async (req, res, next) => { //quando o dono do perfil procura seu proprio perfil
  try {
    const id = req.user.id
    const profile = await Profile.findOne({user : id})
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




// @route    GET /profile/
// @desc     get all profilesd
// @access   Private
router.get('/', auth, async (req, res, next) => {    // quando uma pessoa procura todos os perfis de uma vez
  try {
    //console.log("")
    let profiles = null
    query = {}
    for (const [key, value] of Object.entries(req.query)) {  //precisando entender melhor
      if (key == 'skills'){
        query[key] = { "$in" : value.split(',') } // $in verifica se tem o valor dentro de skills 
      }
      else if (key.includes('social')) {
        query[key] = { $exists: true } 
      }
      else{
        query[key] = value
      }
    }
    //console.log(query)
    profiles = await Profile.find(query)
    res.json(profiles)

  } catch (err) {
    console.error(err.message)
    res.status(500).send({ "error": "Server Error" })
  }
})



// @route    PATCH /profile/:profileId
// @desc     UPDATE profile
// @access   Private
router.patch('/:profileId', auth, async (req, res, next) => {   //buscar entender
  try {
    const id = req.params.profileId
    const update = { $set: req.body } // $set acrescenta novos campos a doc ja existentes
    const profile = await Profile.findByIdAndUpdate(id, update, { new: true })
    if (profile) {
      res.send(profile)
    } else {
      res.status(404).send({ error: "Profile doesn't exist" })
    }
  }catch (err) {
    console.error(err.message)
    res.status(500).send({ "error": "Server Error" })
  }
});

// @route    DELETE /profile/:profileId
// @desc     DELETE profile
// @access   Private
router.delete('/:profileId', auth, async (req, res, next) => {  //buscar entender
  try {
    const id = req.params.profileId // procura o id dentro de params em profile id ? 
    const profile = await Profile.findOneAndDelete({_id : id}) // procura um id em profile e deleta?
    if (profile) {
      res.json(profile) // caso o id bata com o id do banco, segue e deleta 
    } else {
      res.status(404).send({ "error": "profile not found" }) // caso nao ache, erro
    }
  }catch (err) {
    console.error(err.message)
    res.status(500).send({ "error": "Server Error" }) // caso de erro de servidor 
  }
});


// @route    POST /profile
// @desc     CREATE profile
// @access   Public
router.post('/', [], async (req, res, next) => {  //antes de criar, ele verifica se o usuario ja existe, caso sim, ele devolve dizendo que ja existe
    try {
      let { user, company, website, minibio, social, skills, education } = req.body
  
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      } else {
        let user_model = await User.findOne({ _id: user }) //Pode ser e-mail ou ID
        if(user_model){  
          let profile_model = await Profile.findOne({ user: user_model.id }) //busca pelo profile 
          if (profile_model) {
            res.status(400).send({ "error": "profile already exist" }) //caso o perfil já exista
          }
          else{
            let profile = new Profile({ user, company, website, minibio, social, skills, education }) //caso o perfil nao exista, vai seguir e criar o perfil com esses campos
            await profile.save() //salva no banco de dados
            if (profile.id) {
              res.json(profile);
            }
          }
        }
        else {
          res.status(404).send({ "error": "user not found" })
        }
  
      }
    } catch (err) {
      console.error(err.message)
      res.status(500).send({ "error": "Server Error" })
    }
  })
  
  module.exports = router;
  
