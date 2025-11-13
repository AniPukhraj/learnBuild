import jwt from 'jsonwebtoken'
import asyncHandler from '../utils/asyncHandler'
import ApiError from '../utils/ApiError';
import { User } from '../models/user.model';


export const verifyJwt = asyncHandler(async(req, res, next)=>{
    const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", ""); 

    if(!token){
        throw new ApiError(400, "Unauthorized request")
    }

   try {
     const decodedToken = await  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET); 

    const user = await User.findById(decodedToken._id);
    
    if(!user){
        throw new ApiError(400, "Unauthorized request."); 
    }

    req.user = user; 
    next(); 

   } catch (error) {
      throw new ApiError(400, error?.message || "Invalid access token."); 
   }
})