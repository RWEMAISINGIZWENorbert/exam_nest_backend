import mongoose from "mongoose";

const classSchema = new mongoose.model({
     name: {
        type: String,
        required: [true, 'please specify teh name of the class'], 
     },
     schoolId:{ 
      type: mongoose.Schema.ObjectId,
      required: [true, 'please specify the id of the school']
     }
}, {
    timeStamps: true
});

const classModel = mongoose.model('class', classSchema);
export default classModel;