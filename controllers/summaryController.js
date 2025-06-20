
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