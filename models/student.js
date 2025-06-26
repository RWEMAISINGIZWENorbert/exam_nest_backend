import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
   },
   email: { 
    type: String,
    required: true,
    unique: true
  },
   code: {
    type: String
   },
  password: {
     type: String,
  },
  accessToken: {
    type: String,
    default: ''
  },
  refreshToken: {
    type: String,
    default: ''
  },
  schoolId: {
     type: mongoose.Schema.Types.ObjectId,
     required: true,
     ref: 'school'
  }
},{
    timestamps: true 
});

const studentModel = new mongoose.model('student', studentSchema);
export default studentModel;