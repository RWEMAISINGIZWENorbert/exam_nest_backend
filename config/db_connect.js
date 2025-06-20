import  mongoose from "mongoose";
import dotenv  from  "dotenv";
dotenv.config();

 const dbConnect = async () => {
   try {
    const dbUrl = process.env.DATABASE_URL
    mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).catch("Db failed to connect")
   } catch (error) {
     throw new Error(error);
   }
 }

export default dbConnect; 