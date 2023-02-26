import express from "express";
import SensorRouter from "./sensor.router";
import StatisticsRouter from "./statistics.router";

const router = express.Router();

router.use("/sensors", SensorRouter);
router.use("/statistics", StatisticsRouter);

export default router;
