const express = require('express');


const router = express.Router();
const User = require('../../models/usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');


// @route    POST /auth  
// @desc     Authenticate user & get token         // processo de LOGIN
// @access   Public
router.post('/',[
    check('email', 'Please include a valid email').isEmail(),   //Post para fazer  LOGIN
    check('senha', 'senha is required').exists()
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const { email, senha } = req.body

    try{
        let user = await User.findOne({ email }).select ('id senha email is_active is_admin')
        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Usuário nõo existe' }] });
            
        }else{
            const isMatch = await bcrypt.compare(senha, user.senha);
            if (!isMatch) {
                return res.status(400).json ({ errors: [{ msg: 'Senha incorreta'}] });
            
            }else{
                if (user.is_active == false){
                  return res.status(403).json({ errors: [{ msg: 'user is not active' }] });
                }
                const payload = {  //objeto payload
                    user: {
                      id: user.id,
                      nome: user.nome, //nome adicionado 
                      is_active: user.is_active,
                      is_admin: user.is_admin
                    }
                }

                jwt.sign( payload, config.get('jwtSecret'), { expiresIn: '5 days'},
                    (err, token) => {
                        if (err) throw err;
                        payload.token = token
                        res.json(payload);  //nao retorna mais a token, mas sim o payload inteiro( id, nome, is active, admin e a token)
                    }
                    );
              }
          }
  
      } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
      }
  
  })
  
  module.exports = router;
  