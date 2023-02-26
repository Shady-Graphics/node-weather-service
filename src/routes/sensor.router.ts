import express from "express";
import { ExpressJoiError, createValidator } from "express-joi-validation";
import SensorController from "../controllers/sensor.controller";
import {
  metricPayloadValidation,
  paramValidation,
  sensorPayloadValidation,
} from "../repositories/sensor.repository";

const router = express.Router();
const validator = createValidator({ passError: true });

router.get("/", async (_req, res) => {
  const controller = new SensorController();
  const response = await controller.getAll().catch((err: Error) => {
    return res
      .status(500)
      .send({ code: 500, message: "cannot get sensors", details: err.message });
  });
  return res.send(response);
});

router.post("/", validator.body(sensorPayloadValidation), async (req, res) => {
  const controller = new SensorController();
  try {
    const response = await controller.create(req.body);
    return res.status(201).send(response);
  } catch (err: any) {
    return res.status(500).send({
      code: 500,
      message: "Cannot create sensor",
      details: err.message,
    });
  }
});

router.post(
  "/:id/metrics",
  validator.params(paramValidation),
  validator.body(metricPayloadValidation),
  async (req, res) => {
    const controller = new SensorController();
    try {
      const response = await controller.createMetric(req.params.id, req.body);
      if (!response)
        return res.status(404).send({ code: 404, message: "No sensor found" });
      return res.status(201).send(response);
    } catch (err: any) {
      return res.status(500).send({
        code: 500,
        message: "Cannot create sensor metric",
        details: err.message,
      });
    }
  }
);

router.get("/:id", validator.params(paramValidation), async (req, res) => {
  const controller = new SensorController();
  try {
    const response = await controller.get(req.params.id);
    if (!response)
      return res.status(404).send({ code: 404, message: "No sensor found" });
    return res.send(response);
  } catch (err: any) {
    return res
      .status(500)
      .send({ code: 500, message: "Cannot get sensor", details: err.message });
  }
});

router.put(
  "/:id",
  validator.params(paramValidation),
  validator.body(sensorPayloadValidation),
  async (req, res) => {
    const controller = new SensorController();
    try {
      const response = await controller.update(req.params.id, req.body);
      if (!response)
        return res.status(404).send({ code: 404, message: "No sensor found" });
      return res.send(response);
    } catch (err: any) {
      return res.status(500).send({
        code: 500,
        message: "Cannot update sensor",
        details: err.message,
      });
    }
  }
);

router.delete("/:id", validator.params(paramValidation), async (req, res) => {
  const controller = new SensorController();
  try {
    const response = await controller.delete(req.params.id);
    if (!response)
      return res.status(404).send({ code: 404, message: "No sensor found" });
    return res.status(204).send();
  } catch (err: any) {
    return res.status(500).send({
      code: 500,
      message: "Cannot delete sensor",
      details: err.message,
    });
  }
});

router.use(
  (
    err: any | ExpressJoiError,
    _req: express.Request,
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
