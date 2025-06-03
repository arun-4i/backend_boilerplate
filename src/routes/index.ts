import { Router } from "express";
import { END_POINTS } from "@routes/end-points";
import { userController } from "@controllers/userController";
import healthRouter from "@routes/health";
import { unprotectedRoute } from "@middleware/autoEncryption";
import { userRouter } from "./userRouter";

const router = Router();


router.use(END_POINTS.HEALTH, healthRouter);
router.use(END_POINTS.USER, unprotectedRoute, userRouter);

export default router;
