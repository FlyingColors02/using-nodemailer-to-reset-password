
let express = require("express");
let nodemailer = require("nodemailer");
let router = express.Router();
let crypto = require("crypto");
let model = require("../db/user");


router.post("/sendmail", async(req,res)=>{
try{
        let token = crypto.randomBytes(32).toString("hex");
        let userEmail = await model.userModel.findOne({"userLogin.emailId":req.body.userLogin.emailId});
            //console.log(userEmail);
            if(!userEmail){return res.status(401).send({message:"invalid emailId"})}
            console.log(token);
            userEmail.resetPasswordToken = token;
            userEmail.resetPasswordExpires = Date.now()+3600000; //1 hour
            await userEmail.save();

            //console.log(userEmail.userLogin.emailId);

            let transporter = nodemailer.createTransport({
                host:'smtp.gmail.com',
                port:465,
                secure:true,
                auth:{
                    user:'shraduborse97@gmail.com',
                    pass:'loveuSag@r'
                }
            });
            if(!transporter){return res.status(401).send({message: "Something went wrong!!"})};

            let mailOptions = {
                from:'"ABCD APP:"<shraduborse97@gmail.com>',
                to:userEmail.userLogin.emailId,
                subject:"Reset Your Password",
                text:`open this link to change your password
                http://localhost:4500/forgotPassword/`+token
            }

            transporter.sendMail(mailOptions,(error,info)=>{
                if(error){return console.log(error);}
                console.log(`message sent : %s`,info.messageId);
            });
            res.send({message:"message send",
        'token':token,data:userEmail,message:"please go back to your mail box"});
}
catch(er){
res.send(er.message);
}})

module.exports=router;