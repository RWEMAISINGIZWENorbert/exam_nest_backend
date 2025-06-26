import staffModel from "../models/staff.js";
import studentModel from "../models/student.js";

export const authMiddleware = async (req,res) => {

     const token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];

     if(!token){
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
              console.log('Decoded data', decoded);
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