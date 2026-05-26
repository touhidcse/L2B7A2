import { initDB } from "./db"
import app from "./app"
import type { Request, Response } from "express";
import config from "./config";


const main = () =>{
    initDB();
    app.listen(config.port, ()=>{
        console.log(`App listening from port ${config.port}`);
    })
}

main();



