import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();





export const userRouter = router;

router.post('/signup', userController.registerUser)