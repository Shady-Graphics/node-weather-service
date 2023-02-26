import {
  getSensors,
  SensorPayload,
  createSensor,
  getSensor,
  updateSensor,
  deleteSensor,
  ISensorMetricPayload,
  createSensorMetric,
} from "../repositories/sensor.repository";
import { Get, Route, Tags, Post, Body, Path, Put, Delete } from "tsoa";
import { Sensor, Metric } from "../models";

@Route("/weather-service/sensors")
@Tags("Sensor")
export default class SensorController {
  @Get("/")
  public async getAll(): Promise<Array<Sensor>> {
    return getSensors();
  }

  @Post("/")
  public async create(@Body() body: SensorPayload): Promise<Sensor> {
    return createSensor(body);
  }

  @Get("/:id")
  public async get(@Path() id: string): Promise<Sensor | null> {
    return getSensor(id);
  }

  @Put("/:id")
  public async update(
    @Path() id: string,
    @Body() body: SensorPayload
  ): Promise<Sensor | null> {
    return updateSensor(id, body);
  }

  @Delete("/:id")
  public async delete(@Path() id: string): Promise<Sensor | null> {
    return deleteSensor(id);
  }

  @Post("/:id/metrics")
  public async createMetric(
    @Path() id: string,
    @Body() body: ISensorMetricPayload
  ): Promise<Metric | null> {
    return createSensorMetric(id, body);
  }
}
