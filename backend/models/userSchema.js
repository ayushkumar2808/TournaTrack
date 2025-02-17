const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');
const bycrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
       
    },
    password: {
        type: String,
       
    },
    cpassword: {
        type: String,
       
    },
    resettoken:{
        type:String
    },
    picture:{
        type:String
    },
    withgoogle:{
     type:Boolean
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]



})
userSchema.pre('save', async function (next) {

    if (this.isModified('password')) {
        this.password = await bycrypt.hash(this.password, 12);
        this.cpassword = await bycrypt.hash(this.cpassword, 12);
    }
    next();
});

userSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (err) {
        console.log(err);
    }
}
const User = mongoose.model('USER', userSchema);

module.exports = User;