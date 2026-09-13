import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    assistantName:{
        type:String
       
    },
     assistantImage:{
        type:String
       
    },
     language:{
        type:String,
        enum:["english","hindi"],
        default:"english"
     },
     history:[
        {type:String}
     ]
},{timestamps:true})

const User = mongoose.model("User",userSchema)
export default User