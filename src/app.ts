import express, { type Application, type Request, type Response } from "express";
import { userRoute } from "./modules/user/user.route";
import { authRoute } from "./modules/auth/auth.route";

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

app.use("/api/auth", userRoute)
app.use('/api/auth',authRoute)




export default app;