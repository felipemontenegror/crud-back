const jwt = require('jsonwebtoken');
const config = require ('config');  //usuario faz uma requisição e antes de qualquer resposta, tem a camada que verifica a token e se ela é valida

const map_router = require('../service/map_router') //pegando a exportacao do map_router

module.exports = function (req, res, next) { //funcao de autenticaçao via jwt
    // get token from header
    const token = req.header('x-auth-token'); // verificacao se tem x auth token dentro do header

    if(!token){
        return res.status(401).json({ msg: 'No token, authorization denied'});
    }

    try{
        jwt.verify(token, config.get('jwtSecret'), (error, decoded) => { //verificar a token do usuario, verificar com o jwtsecrete e ver se é valido ou nao
          if (error) {  //se erro for verdadeiro
            return res.status(401).json({ msg: 'Token is not valid' }); //erro token nao e valida
          } 
          req.user = decoded.user;  // recebe os dados do user da token decodificada(dados do usuario)
          map = map_router(req.baseUrl, decoded.user) //aqui recebe o resultado da funcao map_router (map e router) / rota é a base url e os dados de user 
          if (map.status == 200){ //se map_router for igual ao status de rout_map vai seguir rormal, tudo ok
            next();
          }else{
            return res.status(map.status).json({ msg: map.msg }); 

          }
        
      })

  
    }catch (err) {
      console.error('something wrong with auth middleware');
      res.status(500).json({ msg: 'Server Error' });
    }
  }
  