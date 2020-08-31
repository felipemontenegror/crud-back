const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

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