import faker from "faker";
import { Sensor, Metric } from "../../src/models";
import {
  ISensorMetricPayload,
  SensorPayload,
} from "../../src/repositories/sensor.repository";

export function generateSensorPayload() {
  return {
    name: faker.random.alpha({ count: 10 }),
    location: faker.random.alpha({ count: 5 }),
  } as SensorPayload;
}

export function generateSensorData(override = {}) {
  return {
    id: faker.random.uuid(),
    name: faker.random.alpha({ count: 10 }),
    location: faker.random.alpha({ count: 5 }),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...override,
  } as Sensor;
}

export function generateSenorsData(n: number = 1) {
  return Array.from(
    {
      length: n,
    },
    (_, i) => {
      return generateSensorData();
    }
  );
}

export function generateSensorMetricPayload(override = {}) {
  return {
    sensorId: faker.random.uuid(),
    temperature: faker.random.number(),
    humidity: faker.random.number(),
    windSpeed: faker.random.number(),
    ...override,
  } as ISensorMetricPayload;
}

export function generateSensorMetricData(override = {}) {
  return {
    id: faker.random.uuid(),
    createdAt: new Date(),
    sensorId: faker.random.uuid(),
    temperature: faker.random.number(),
    humidity: faker.random.number(),
    windSpeed: faker.random.number(),
    ...override,
  } as Metric;
}
