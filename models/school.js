import mongoose from "mongoose";

const schoolSChema = new mongoose.Schema({
     name: {
        type: String,
        required: true
     },
     province: {
        type: String,
        required: [true, 'please specify the province of your school']
     },
     district: {
        type: String,
        required: [true, 'please specify the district of your school']
     },
     sector: {
        type: String,
        required: [true, 'please specify the sector of your school']
     },
     staffCode: {
        type: String,
     },
     studentCode: {
        type: String
     },
     allowed: {
        type: Boolean,
        enum: [true, false],
        default: true  
     }
}, {
    timestamps: true
});

const schoolModel = mongoose.model('school', schoolSChema);
export default schoolModel;
