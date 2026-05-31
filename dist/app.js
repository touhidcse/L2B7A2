import express, {} from "express";
import { userRoute } from "./modules/user/user.route";
import { authRoute } from "./modules/auth/auth.route";
import { issueRouter } from "./modules/issue/issue.route";
import cors from "cors";
import globalErrorHandler from "./middleware/globalErrrorHnadler";
const app = express();
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.status(200).json({
        "message": "Assingnment 2",
        "author": "Touhid"
    });
});
app.use("/api/auth", userRoute);
app.use('/api/auth', authRoute);
app.use('/api', issueRouter);
app.use(cors({
    origin: "http://localhost:5000",
}));
// Global Error Handling Middleware
app.use(globalErrorHandler);
export default app;
//# sourceMappingURL=app.js.map