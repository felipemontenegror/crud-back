const bcrypt = require('bcryptjs');  // o models q estrutura o DB
const mongoose = require('mongoose'); // a profile e usuario estao referenciadas, uma com a outra

const UserSchema = new mongoose.Schema({
    nome : {
        type : String,
        required : true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    senha :{
        type: String,
        required: true
    },
    time :{
        type: String,
        required: true
    },
    jogador : {
        type : String,
        required : true
    },
    is_active: {
        type: Boolean,
        default: true
    },
    is_admin: {
        type: Boolean,
        default: false
    },
    date: {
      type: Date,
      default: Date.now
    }
})

module.exports = mongoose.model('user', UserSchema);