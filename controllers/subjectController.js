import subjectModel from "../models/subjectsModel.js";

export const newSubject = async (req,res) => {
     try{
        const authorId = req.id; 
        const { name } = req.body;
        
        if(authorId){
             console.log(`------------- Author Id ${authorId}`);
        }

        if(!name){
          return res.status(409).json({
            msg: "Please specify the name of teh subject"
          });
        }

        const subject = await subjectModel.findOne({name});
        const schhoolId = subject.schhoolId;
        const isExist = await subjectModel.findOne({name}, {schhoolId});
        if(isExist){
           return res.status(400).json({
            msg: `The subject ${name} already exist in the school`
           });
        }

        const payload = {
            name,
            authorId
        }

        const newSubject = new subjectModel(payload);
        await newSubject.save();

        return res.status(201).json({
            msg: "New subject created succesfully"
        });
        
     }catch(error){
         return res.status(500).json({
            msg: `Unkwon Error Occured ${error}`
         }); 
     }
}