import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username:{
        type:String, 
        required : true, 
        unique : true, 
    }, 
    email:{
        type:String, 
        required :true, 
        unique : true
    }, 
    phoneNumber:{
        type:Number, 
        required : true, 
        unique : true
    }, 
    class :{
        type:Number, 
        required : true
    }, 
    age : {
        type : Number, 
        required:true
    }, 
    password : {
        type : String, 
        required : true, 
        unique : true
    }
}, {timestamps:true})