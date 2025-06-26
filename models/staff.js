import mongoose from "mongoose";

const staffSChema = new mongoose.Schema({
   schoolId: {
     type: mongoose.Schema.Types.ObjectId,
     required: true
   },
   name: {
    type: String,
    required: true
   },
   email: { 
    type: String,
    required: true,
    unique: true
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
  role:{
     type: String,
     default: 'teacher',
     enum: ['admin', 'teacher']
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'school'
  }
}, {
     timestamps: true
 }); 

 const staffModel = new mongoose.model('staff', staffSChema);
 export default staffModel;