import mongoose from "mongoose";

const answerFileSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    fileQuestionId: {
       type: mongoose.Types.ObjectId,
       required: true 
    }, 
    originalName: {
        type: String,
        required: true
    },
    mimeType: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now
    }
}, {
     timestamps: true
});

const answerFileModel =  mongoose.model('answerFile', answerFileSchema);
export default answerFileModel;