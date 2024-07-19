//require('dotenv').config({path: './env'}) //no problem as such, it just ruins
//the consistency of the code. but it is solved by using another approach
import dotenv from 'dotenv';
// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";
import connectDB from "./db/index.js";
import {app} from "./app.js"

dotenv.config({
    path:'./env'
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at PORT : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGODB connection failed :(", err);
})
