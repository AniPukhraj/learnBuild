import mongoose from 'mongoose'
import asyncHandler from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import { User } from '../models/user.model.js'
import uploadOnCloudinary from '../utils/cloudinary.js'
import {ApiResponse} from '../utils/ApiResponse.js'


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