let express = require("express");
let mongoose = require("mongoose");
let port = process.env.PORT||4500;
let app = express();
app.use(express.json());
let user = require("./routes/user");
app.use("/api/user",user);
let mailer = require("./routes/mailer");
app.use("/api/mail",mailer);
let config =  require("config");
let forgotPassword = require("./routes/forgotPassword");
app.use("/api/password",forgotPassword);

console.log(`Node_env_Mode:${process.env.NODE_ENV}`);
console.log(`app:${app.get("env")}`);

if(!config.get("ENV_PASSWORD")){
        console.log("GIVE ENV_PASSWORD");
        process.exit(1);
}
mongoose.connect("mongodb://localhost/CoordinateMongodb&Express",{ useNewUrlParser: true,  useUnifiedTopology: true })
        .then(()=>console.log("database got connected"))
        .catch(error=>console.log(`database not connected${error.message}`));

app.listen(port,()=>console.log(`app is working on port ${port}`));