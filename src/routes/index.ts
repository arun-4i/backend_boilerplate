import { Router } from "express";
import { END_POINTS } from "@routes/end-points";
import healthRouter from "@routes/health";
import { unprotectedRoute } from "@middleware/autoEncryption";
import { userRouter } from "./userRouter";

const router = Router();


router.use(END_POINTS.HEALTH, healthRouter);
router.use(END_POINTS.USER, userRouter);

export default router;
