import mongoose from 'mongoose';
import { DB_NAME } from '../constant.js';

const connectToDB = async () => {
   try {
      const response = await mongoose.connect(
         `${process.env.MONGO_URI}/${DB_NAME}`,
         {
            ssl: true,
            tls: true,
            tlsInsecure: false,
         }
      );
      console.log(
         `\n 💨 MongoDB connected Successfully, DB HOST => ${response.connection.host}`
      );
   } catch (error) {
      console.log("\nMongodb connection error =>", error);
      process.exit(1);
   }
};

export default connectToDB;