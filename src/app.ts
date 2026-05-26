import express, { type Application, type Request, type Response } from "express";
import { userRouter } from "./modules/user/user.router";

const app: Application = express()

app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        "message": "Assingnment 2",
        "author": "Touhid"
    })
})

app.use("/api/auth", userRouter)


export default app;