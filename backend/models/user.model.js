const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        minlength: [3, `Username must be atleast of 3 characters !!`]
    },

    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        minlength: [13, `Email must be of 13 characters !!`]
    },

    password:{
        type: String,
        required: true,
        trim: true,
        minlength: [5, `Password Should be of length 5`]
    }
})



const user = mongoose.model('user', userSchema);


module.exports=user;// ye export hoga drct rotes m 
