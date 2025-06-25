import answerFileModel from "../models/answerFile.js";

export const summaryDashboard = async (req,res) => {
     try {
        const totalQuestionPapers = File.length;
        const totalAnswerPapers = answerFileModel.length;
        
        return res.status(200).json({
            'totalQuestionPapers': totalQuestionPapers,
            'totalAnswerPapers': totalAnswerPapers
        })

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
            totalPapers: totalPapers
        })
         
     } catch (error) {
        return res.status(500).json({
            error: true,
            msg: `Unkwon Error Occured ${error}`
        });
     }
} 