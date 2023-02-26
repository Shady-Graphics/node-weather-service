import { getRepository } from "typeorm";
import Joi from "joi";
import { Metric, Sensor } from "../models";

export const paramValidation = Joi.object({
  id: Joi.string().uuid().required(),
});

export const sensorPayloadValidation = Joi.object({
  name: Joi.string().min(3).max(20).alphanum().required(),
  location: Joi.string().min(3).max(20).alphanum().required(),
});

export const metricPayloadValidation = Joi.object({
  temperature: Joi.number().strict().required(),
  humidity: Joi.number().strict().required(),
  windSpeed: Joi.number().strict().required(),
});

export interface SensorPayload {
  name: string;
  location: string;
}

export interface ISensorMetricPayload {
  temperature: number;
  humidity: number;
  windSpeed: number;
}

export const getSensors = async (): Promise<Array<Sensor>> => {
  const repository = getRepository(Sensor);
  return repository.find();
};

export const getSensor = async (id: string): Promise<Sensor | null> => {
  const repository = getRepository(Sensor);
  const sensor = await repository.findOne({ id: id });
  if (!sensor) return null;
  return sensor;
};

export const createSensor = async (payload: SensorPayload): Promise<Sensor> => {
  const repository = getRepository(Sensor);
  const [, count] = await repository.findAndCount({
    where: {
      name: payload.name,
    },
  });
  if (count > 0) {
    throw new Error(`Sensor ${payload.name} already exists`);
  }

  const sensor = new Sensor();
  return repository.save({
    ...sensor,
    ...payload,
  });
};

export const updateSensor = async (
  id: string,
  payload: SensorPayload
): Promise<Sensor | null> => {
  const repository = getRepository(Sensor);
  const sensor = await repository.findOne({ id: id });
  if (!sensor) return null;
  return repository.save({
    ...sensor,
    ...payload,
    id,
  });
};

export const deleteSensor = async (id: string): Promise<Sensor | null> => {
  const repository = getRepository(Sensor);
  const sensor = await repository.findOne({ id: id });
  if (!sensor) return null;
  return repository.remove(sensor);
};

export const createSensorMetric = async (
  sensorId: string,
  payload: ISensorMetricPayload
): Promise<Metric | null> => {
  const sensorRepository = getRepository(Sensor);
  const sensor = await sensorRepository.findOne({ id: sensorId });
  if (!sensor) return null;

  const metricRepository = getRepository(Metric);
  const metric = new Metric();
  return metricRepository.save({
    ...metric,
    sensorId,
    ...payload,
  });
};
