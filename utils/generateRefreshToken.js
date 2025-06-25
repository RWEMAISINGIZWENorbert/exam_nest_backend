import jwt from 'jsonwebtoken';
import { userModel } from '../models/userSchema.js';

export const generateRefreshToken = async (userId) => {
    
    if(!process.env.REFRESH_TOKEN_SECRET_KEY){
        throw new Error("Acess Token secret key is not found");
      }
          
     const user = await userModel.findOne({_id:userId});
    
     if(!user){
        throw new Error("User not found");    
    }

    const token = jwt.sign(
        {id: userId},
        process.env.REFRESH_TOKEN_SECRET_KEY,
        {expiresIn: "30d"}
      );

    await userModel.findByIdAndUpdate(userId, {refreshToken: token});  

    return token;

}