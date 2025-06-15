import userModel from "../models/user_model";
const bcrypt = require('bcryptjs');

 const signUpControllet = async (req,res) => {
      try{
          
        const {
             name,
             email,
             password,
             cPassword, 
        } = req.body

        if(!name || !email || !password || !cPassword){
            return res.status(409).json({
                message: "Please provide the required credentials"
            });
        }

         if(password == cPassword){
             return res.status(409).json({
                message: "password confirmation those not match"
             });
         }

         const user = await userModel.findOne({email});
         if(user){
             return res.status(400).json({
                message: `Email ${email} has arleady taken`
             });
         }else{
             const hashedPassowrd = await bcrypt.hash(password, 10);
             const payload = {
                 name,
                 email,
                 password: hashedPassowrd,
                 
             }
             const newUser = new userModel(payload)
         }
         
      }catch(error){
        return res.status(500).json({
             message: `Unknown Error Occured ${error}`
        })
      }
 } 