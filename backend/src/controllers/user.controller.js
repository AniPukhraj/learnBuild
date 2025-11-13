import mongoose from 'mongoose'
import asyncHandler from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import { User } from '../models/user.model.js'
import uploadOnCloudinary from '../utils/cloudinary.js'
import {ApiResponse} from '../utils/ApiResponse.js'


const generateAccessAndRefreshToken = async (userid)=>{
    try {
        const user = await User.findById(userid); 

        if(!user){
            throw new ApiError(400, 'User not found.')
        }

        const accessToken = user.generateAcessToken(); 
        const refreshToken = user.generateRefreshToken(); 


        user.refreshToken = refreshToken; 
        await user.save({validateBeforeSave : false})

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while genereting the access and refresh token.")
    }
}

const registerUser = asyncHandler(async(req, res)=>{
        const [username, email, password,standard] = req.body; 

        if([username , email, password, standard].some((feild) => feild.trim() === "")){
            throw new ApiError(400, 'All feilds are required.')
        }

        const existedUser = await User.findOne({
            $or: [{username}, {email}]
        })

        if(existedUser){
            throw new ApiError("User already existed.")
        }

         const photoLocalPath = req.files.profilePhoto[0].path; 

         if(!photoLocalPath){
            throw new ApiError(400, "Profile photo is required.")
         }

         const photo = await uploadOnCloudinary(photoLocalPath); 


         if(!photo){
            throw new ApiError("Photo is required.")
         }

        const user = await User.create({
            username, 
            email, 
            password, 
            standard, 
            profileImage : photo.url
        })

        const registeredUSer = User.findById(user._id).select("-password -refershToken")

        if(!registerUser){
            throw new ApiError(500, "Something went wrong while registering user.")
        }

        return res.status(200).json(
            new ApiResponse(200, registerUser, "User registered user successfully.")
        )

}) 


const loginUser = asyncHandler(async(res, res)=>{
    const [username, password] = req.body; 

    if(!username && !password){
        throw new ApiError(400, "Username and password is required.")
    }

    const user = await User.findOne({
        $or : [{username, email}]
    })

    if(!user){
        throw new ApiError(400 , "User not found.")
    }

    const isPasswordValid = await User.isPasswordCorrect(password)


    if(!password){
        throw new ApiError(400, "Password is wrong.")
    }

    const {accessToken , refreshToken} = generateAccessAndRefreshToken(user._id); 

    const loggeInUser = await User.findOne(user._id).select("-refreshtoken -password"); 

    if(!loggeInUser){
        throw new ApiError(400, "User not found.")
    }

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    }

    return res
        .status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully."))

})


const logoutUser = asyncHandler(async(req, res, next)=>{
    
    await User.findByIdAndUpdate(req.user._id, {
        $set: {
            refreshToken : "undefined"
        }
    }, {
        new: true 
    }

)

      const options = {
        httpOnly: true, 
        secure :process.env.NODE_ENV == 'production'
      }


      res.status(200).clearCookie('accessToken', options).clearCookie('refreshToken', options).json(new ApiResponse(200, {},"User logged out successfully." ))


})



export {registerUser, loginUser, logoutUser}