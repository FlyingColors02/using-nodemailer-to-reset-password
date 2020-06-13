let express = require("express");
const router = express.Router();
const model = require("../db/user");
const bcrypt = require("bcryptjs");

router.post(`/forgotpassword/:token`, async(req,res)=>{
    try{
        let user = await model.userModel.findOne({
            resetPasswordToken:req.params.token,
            resetPasswordExpires:{
                $gt:Date.now()
            }
        });
    if(!user){return res.status(401).send("invalid token id OR token got expired!!!")}
    let result = model.Validation(req.body.userLogin.emailId);
    if(result.error){return res.status(403).send(result.error.details[0].message)}
    let compareOldAndNewPass = await bcrypt.compare(req.body.userLogin.password,user.userLogin.password);
    if(compareOldAndNewPass){return res.status(403).send({message:"don't use previous password"})}
    user.userLogin.password=req.body.userLogin.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    let salt = await bcrypt.genSalt(10);
    user.userLogin.password = await bcrypt.hash(user.userLogin.password,salt);
    console.log("password"+user.password+"and the user id"+user);
    user = await user.save();
    res.send({
        "message":"password updated",
        "data":user
    });
}
catch(er){
    res.send(er);
}
})

module.exports=router;