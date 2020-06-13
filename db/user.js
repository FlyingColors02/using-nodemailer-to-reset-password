let mongoose = require("mongoose");
let joi = require("@hapi/joi");
let jwt = require("jsonwebtoken");
let config=require("config");

let userSchema = new mongoose.Schema({
    firstname:{type:String, min:4, max:20, required:true},
    lastname:{type:String, min:4, max:20, required:true},
    Address:{type:String, required:true},
    resetPasswordToken:{type:String},
    resetPasswordExpires:{type:Date},
    userLogin:{
        emailId:{type:String, required:true, unique:true},
        password:{type:String, required:true}
    },
    isAdmin:{type:Boolean}
});

userSchema.methods.JwtToken = function(){
    let token = jwt.sign({_id: this._id, firstname:this.firstname, isAdmin:this.isAdmin},
        config.get("ENV_PASSWORD"));
        return token;
}

function Validation(data){
    let Schema = joi.object({
        firstname:joi.string().min(4).max(20).required(),
        lastname:joi.string().min(4).max(20).required(),
        Address:joi.string().required(),
        userLogin:{
            emailId:joi.string().email().required(),
            password:joi.string().required()
    }
    });
    return Schema.validate(data);
}
let userModel = mongoose.model("userdetails",userSchema);
module.exports = {userModel,Validation};