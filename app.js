import express from "express"
import cors from "cors";
import "dotenv/config";
import router from "./src/routes/router.js"
import { connectToDB } from "./src/database/connection.js";
const app=new express();

app.use(cors({
    origin:"*"
}))
app.use(express.json())
app.use("/api/v1/videos",router
)


app.listen(process.env.PORT,async(err)=>{
    if(err){
       return console.log("something went wrong");
    }
    try {
        await connectToDB();
         console.log("port running on "+process.env.PORT);
    } catch (error) {
       
        console.log("db_connect_error"+error);
    }
});