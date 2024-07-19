import express, { urlencoded } from 'express';
import cors from "cors";
import cookieParser from "cookie-parser"
const app = express();

app.on("errror", (error) => {
    console.log("ERRR: ", error);
    throw error
})

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: '20kb'}));
// this sets the limit for express to handle json data cause excessive 
// data might make the server crash

app.use(express.urlencoded({extended: true, limit:"20kb"}));
// this takes the data incoming from a url. you see the '%20's or '+'s
// in urls when you search something. this urlencoded helps express work with
// such data. extended helps us take nested objects (wont be used as much but still :))

app.use(express.static("public"));
// this is to store pdfs, images, favicons etc in the "public" folder created

app.use(cookieParser());

export {app}