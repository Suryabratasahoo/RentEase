const mongoose=require("mongoose");
const Schema=mongoose.Schema;
// using passport-local-mongoose
const passportLocalMongooose=require("passport-local-mongoose");

const userSchema=new Schema({
    email:{
        type:String,
        required:true
    }
})

userSchema.plugin(passportLocalMongooose);

module.exports=mongoose.model("User",userSchema);