import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
     name: {
         type: String,
         required: true
     },
     email: {
        type: String,
        required: true
     },
     password: {
        type: String,
        required: true  
     },
     refreshToken: {
        type: String,
        default: ''
     },
     role: {
         type: String,
         enum: ['student', 'teacher', 'admin']
     }
}, {
     timestamps: true
});

const userModel = new mongoose.model('user', userSchema);
export default userModel;