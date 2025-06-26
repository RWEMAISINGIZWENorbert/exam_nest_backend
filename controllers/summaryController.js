import answerFileModel from "../models/answerFile.js";
import questionsPaperFileModel from "../models/File.js";
import studentModel from "../models/student.js";
import staffModel from "../models/staff.js";

export const summaryDashboard = async (req,res) => {
     try {
        const schoolId = req.schoolId
        const totalQuestionPapers = (await questionsPaperFileModel.find({schoolId})).length;
        const totalAnswerPapers = (await answerFileModel.find({schoolId})).length;
        const totalStudents = (await studentModel.find({schoolId})).length;
        const totalstaffMembers = (await staffModel.find({schoolId})).length;
        
        return res.status(200).json({
            'totalQuestionPapers': totalQuestionPapers,
            'totalAnswerPapers': totalAnswerPapers,
            'totalStudents': totalStudents,
            'staffMembers': totalstaffMembers
        });

     } catch (error) {
        return res.status(500).json({
            error: true,
            msg: `Unkwon Error Occured ${error}`
        });        
     }
}


export const totalPapers = async (req,res) => {
     try {       
        const totalPapers = File.length;

        return res.status(200).json({
            msg: "Summary Retrived sccesfully",
            totalPapers: totalPapers,
        })
         
     } catch (error) {
        return res.status(500).json({
            error: true,
            msg: `Unkwon Error Occured ${error}`
        });
     }
} 