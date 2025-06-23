import { Router } from "express";
import { userRouter } from "./userRouter";
import { userProfileRouter } from "./userProfileRouter";
import { END_POINTS } from "./end-points";
import HealthRouter from "./health";

const router = Router();

router.use(END_POINTS.USER, userRouter);
router.use(END_POINTS.HEALTH, HealthRouter);
router.use(END_POINTS.USER_PROFILE, userProfileRouter);

export default router;
