import { Router } from "express";
import { authController } from "./auth.controller";
const router = Router();
router.post('/login', authController.loginUser);
export const authRoute = router;
//# sourceMappingURL=auth.route.js.map