import express from "express";
import { createValidator, ExpressJoiError } from "express-joi-validation";
import { statisticsPayloadValidation } from "..//repositories/statistics.repository";
import StatisticsController from "../controllers/statistics.controller";

const validator = createValidator({ passError: true });
const router = express.Router();

router.post(
  "/",
  validator.body(statisticsPayloadValidation),
  async (req, res) => {
    const controller = new StatisticsController();
    try {
      const response = await controller.query(req.body);
      return res.send(response);
    } catch (err: any) {
      return res.status(500).send({
        code: 500,
        message: "cannot query sensor statistics",
        details: err.message,
      });
    }
  }
);

router.use(
  (
    err: any | ExpressJoiError,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (err && err.error && err.error.isJoi) {
      return res.status(400).json({
        code: 400,
        type: err.type,
        message: `Invalid request - ${err.error.toString()}`,
      });
    } else {
      next(err);
    }
  }
);

export default router;
