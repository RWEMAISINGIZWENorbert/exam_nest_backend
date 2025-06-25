import jwt from 'jsonwebtoken';

export const generateAccessToken = async (userId) => {
    if(!process.env.ACCESS_TOKEN_SECRET_KEY){
        throw new Error("Acess Token secret key is not found");
      }

    const user = await userModel.findOne({_id:userId});
          
    if(!user){
     throw new Error("User not found");    
   }

   const token = await jwt.sign(
    {id: userId},
    process.env.ACCESS_TOKEN_SECRET_KEY,
    {expiresIn: '24h'}
   );

   return token
}