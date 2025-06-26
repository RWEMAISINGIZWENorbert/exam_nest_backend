import jwt from 'jsonwebtoken';
import staffModel from '../models/staff.js';
import studentModel from '../models/student.js';

export const generateAccessToken = async (userId, schoolId) => {
    if(!process.env.ACCESS_TOKEN_SECRET_KEY){
        throw new Error("Acess Token secret key is not found");
      }

    const staff = await staffModel.findOne({_id:userId});
    const student = await studentModel.findOne({_id:userId});

    const user = staff ? staff._id : student ? student._id : null; 
    if(!user || user == null){
     return resizeBy.status(400).json({
        msg: "User not found"
     });    
   }
    
   const payload = {id: userId, schoolId: schoolId};
   
   const token = jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET_KEY,
    {expiresIn: '24h'}
   );

   return token
}