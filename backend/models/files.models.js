const mongoose = require('mongoose');


const fileschema = new mongoose.Schema({
    public_id: { 
        type:String, 
        required: true 
    },   
    path: {
        type:String,
        required: [true,'Path is required']
    },
    originalname:{
        type:String,
        required:[true,'Original name is required']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true,'User is required']
    }
})


const File = mongoose.model('File', fileschema);

module.exports = File;