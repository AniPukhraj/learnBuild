import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrpyt'

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
    standard :{
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
    }, 
    refreshToken : {
        type : String
    }, 
    profilePhoto :{
        type : String, 
        required : true, 
        unique : true
    }
}, {timestamps:true})





userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password)
})


userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = async function(){
    return jwt.sign(

         {
            _id : this._id, 
            email : this.email, 
            username : this.username, 
            fullname : this.fullname
        },

        process.env.ACCESS_TOKEN_SECRET, 
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = async function(){
    jwt.sign(
        {
            _id : this._id, 
            
        }, 
        process.env.REFRESH_TOKEN_SECRET, 
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User", userSchema)



