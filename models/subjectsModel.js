import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
     name: {
        type: String,
        required: true
     },
     authorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
     },
     schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'school',
     }
}, {
    timestamps: true
});

const subjectModel = new mongoose.model('subject', subjectSchema);
export default subjectModel;