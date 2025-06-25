import mongoose from "mongoose";

const schoolAdminSchema = new mongoose.Schema({
    email:{
         type: String,
         required: true
    }  
}, {
     timestamps: true
});

const schoolAdminModel = new mongoose.model('schoolAdmin', schoolAdminSchema);
export default schoolAdminModel;