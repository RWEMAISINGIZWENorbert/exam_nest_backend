import { generateStaffCode, generateStudentCode } from "../utils/schoolCodeGenerator.js";
import schoolModel from "../models/school.js";
import bcrypt from "bcryptjs";
import schoolAdminModel from "../models/schoolAdmin.js";
import staffModel from "../models/staff.js";
import studentModel from "../models/student.js";

export const schoolRegister =  async (req,res) => {
     try {
         const {name, province, district ,sector} = req.body;

         if(!name || !province || !district || !sector){
             return res.status(409).json({
                 msg: "Please fill the required credentials"
             });
         }

         const staffCode = generateStaffCode;
         const studentCode = generateStudentCode;
         
         const payload = {
             name,
             province,
             district,
             sector,
             staffCode,
             studentCode
         }

         const newSchool = new schoolModel(payload);
         await newSchool.save();
         
         return res.status(201).json({
            msg: "New School registered succesfully"
         });

     } catch (error) {
        return res.status(500).json({
            msg: `Unknow Error Occured ${error}`
        })
     }
}

export const markAllowed = async (req, res) => {
     try {
        const { bool } = req.body;
        const schoolId  = req.params.schoolId;
        if(schoolId){
            return res.status(500).json({
              msg: `Please specify the Id to be marked`
            })
        }  
        if(!bool) {
            return res.status(500).json({
                msg: `Please specify the bool to be marked`
            })
          }
         
        const markSchoolAlloed = await schoolModel.findByIdAndUpdate(schoolId, {allowed: bool}); 
        await markSchoolAlloed.save();
     } catch (error) {
         return res.status(500).json({
            msg: `Unknow Error Occured ${error}`
         })
     }
}

export const editSchool =  async (req,res) => {
     try{
        
        const {name, province, district ,sector} = req.body;
        const schoolId = req.params.schoolId;
        if(!schoolId){
           return res.status(500).json({
             msg: "Please provide the Id of the school to be edited"
           });
        }
        const payload =  { 
             name,
             province,
             district,
             sector,            
        }
        
        const editSchool = await schoolModel.findByIdAndUpdate(schoolId, payload);
        await editSchool.save();

        return res.status(200).json({
            msg: "Your school data has been updated succesfully",
        })

     }catch (error) {
        return res.status(500).json({
            msg: `Unknow Error Occured ${error}`
        });         
     }
}

// export const deleteSchool = async (req,res) => {
//      try {
         
//         const schoolId = req.params.schhoolId;
//         if(schoolId){
//            return res.status(500).json({
//              msg: "Please provide the Id of the school to be deleted"
//            });            
//         }

//         await schoolModel.findByIdAndDelete(schoolId);
//         return res.status(204).json({
//             msg: "The school deleted succesfully"
//         })

//      } catch (error) {
//         return res.status(500).json({
//             msg: `Unknow Error Occured ${error}`
//         })           
//      }
// }

export const userRegister = async (req,res) => {
     try {
         const { name, email, code, password, cPassword} = req.body;
          
         if(!code){
             return res.status(409).json({
                msg: "Please provide the code"
             });
         }
         const schoolFound  = await schoolModel.find({$or:[{studentCode: code},{staffCode: code}]});
         if(schoolFound.length <= 0){
             return res.status(409).json({
                msg: "the code provided those not match any school please contact the school admin for the valid school code"
             })
         }

         const matchPassword = password == cPassword;
         if(!matchPassword){
             return res.status(400).json({
                msg: "The password provided those ot match"
             });
         }
         
         const hashedPassword = await bcrypt.hash(password, 10);
         const isStaff =  await schoolModel.findOne({staffCode: code});
         const schoolId = isStaff._id;
         if(isStaff){
             const isAdmin = await schoolAdminModel.findOne({email});
              let role;
              isAdmin ? role = 'admin' : role = 'teacher'
             const payload = {
                 schoolId,
                 name,
                 email,
                 password: hashedPassword,
                 role
             }
              
             const newStaffMember = new staffModel(payload);
             await newStaffMember.save();

         }else{
            const isStudent =  await schoolModel.findOne({staffCode: code});
            const schoolId  = isStudent._id;
            const payload = {
                 schoolId,
                 name,
                 email,
                 password: hashedPassword                
            }

            const newStudent = new studentModel(payload);
            await newStudent.save();
         }
        
         return res.status(201).json({
          msg: 'Account created succesfully'
         });          
     } catch (error) {
        return res.status(500).json({
            msg: `Unknow Error Occured ${error}`
        });                 
     }
}

export const login = async (req, res) => {
     try{
        const {email,password} = req.body; 
        if(!email || !password){
            return res.status(400).json({
                msg: 'please provide the required credentials'
            });
        }

        const staffuserFound = await staffModel.findOne({email});
        const studentUserFound = await studentModel.findOne({email});

        if(staffuserFound){
             const userId = staffuserFound._id;
             const accessToken = generateAccessToken(userId);
             const refreshToken = generateRefreshToken(userId);
             const options = { 
                httpOnly: true,
                secuere: true,
                sameSite: 'None'
             } 

             res.cookie('accessToken', accessToken, options);
             res.cookie('refreshToken', refreshToken, options);
             
             return res.status(201).json({
                msg: "User Logged In succesfully"
             });

        }else if(studentUserFound){
             const userId = studentUserFound._id
             const accessToken = generateAccessToken(userId);
             const refreshToken = generateRefreshToken(userId);
             const options = { 
                httpOnly: true,
                secuere: true,
                sameSite: 'None'
             } 

             res.cookie('accessToken', accessToken, options);
             res.cookie('refreshToken', refreshToken, options);
             
             return res.status(201).json({
                msg: "User Logged In succesfully"
             });
        }else{ 
            return res.status(400).jsonp({
                msg: `The user with email ${email} does not found`, 
            });
        }
     }catch(error){ 
        return res.status(500).json({
            msg: `Unknow Error Occured ${error}`
        });        
     }
}

export const logout = async (req,res) => { 
      try {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        return res.status(200).json({
            msg: "User Logged out successfully",
            error: false,
            success: true
        });

      } catch (error) {
        return res.status(500).json({
            msg: `Unkwon error occured, ${error}`
        });
      }
}