import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()
export default {
    dbConfig:asyncHandler(async ()=>{
      try {
           await  mongoose.connect(process.env.MONGODB_URL
      ,{})

      console.log("Database connected successfully")

      } catch (error) {
        console.log("Database connection failed", error.message)
        process.exit(1)
      }
 
    }
)
}