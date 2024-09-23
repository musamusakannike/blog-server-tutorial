const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    banned: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true
});

//Export the model
const User = mongoose.model('User', userSchema);
module.exports = User;