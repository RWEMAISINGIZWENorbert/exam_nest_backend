import staffModel from "../models/staff.js";
import studentModel from "../models/student.js";
import jwt from 'jsonwebtoken';

export const authMiddleware = async (req,res, next) => {

    //  const token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];
    //   console.log(`-------------- Token ${token}`);

    //  if(!token){
    //   return res.status(401).json({
    //     msg: "Invalid Token",
    //     error: true
    //    });
    //   }

    let token = req.cookies.accessToken || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    console.log("-------------- Token", token, "Type:", typeof token);

    if (!token || typeof token !== 'string') {
        return res.status(401).json({
            msg: "Invalid Token",
            error: true
        });
    }
         if(!process.env.ACCESS_TOKEN_SECRET_KEY){
            return res.status(401).json({
                msg: "The Access Token secret key those not found",
                error: true
            }); 
        }   
           
        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET_KEY,
            async (err, decoded) => {
              if(err){
                  console.log("Error", err);       
              }
              console.log('----------------------------------Decoded data', decoded);
              const staff = await staffModel.findById(decoded.id);
              const student = await studentModel.findById(decoded.id);
              req.id = staff ? staff._id :  student ? student._if: null;
              const schoolId = decoded.schoolId
              req.schoolId = schoolId;
              next();
            }
        );    

} 

export default authMiddleware;