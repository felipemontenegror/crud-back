module.exports = function (route, user) {  // vai existir uma rota diferente e um usuario diferente
    if (route == '/profile' && user.is_admin == false){  // condicional: route  é = ou profile e user = admin for falso
        return { msg: 'user is not admin' , status: 403}; //usuario nao é admin
    }
    return { msg: '' , status: 200}; // caso a sentença anterior (caso seja amdin).
};

// serviço de codigo / vai ser usado por outros arquivos