import mongoose from "mongoose"
import logger from "../logger/index.js"
export const mongoConnection=()=>{
    mongoose.connect("mongodb+srv://root:root@cluster0.or0uomh.mongodb.net/testinggg")
    .then(()=>{
        logger.info("connection is stablished")
    })
    .catch((err)=>{
        console.log(`error is :${err}`)
    })
}
