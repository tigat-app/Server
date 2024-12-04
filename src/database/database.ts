import mongoose from 'mongoose';
import { MongoClient, MongoClientOptions } from "mongodb";


const mongoDBConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }as MongoClientOptions);
    console.log("MongoDB - Connected");
  } catch (error) {
    console.log("Error - MongoDB Connection " + error);
  }
};

export default mongoDBConnect;
