import SensorController from "./sensor.controller";
import * as SensorRepository from "../repositories/sensor.repository";
import {
  generateSenorsData,
  generateSensorData,
  generateSensorPayload,
} from "../../test/utils/generate";
import faker from "faker";

afterEach(() => {
  jest.resetAllMocks();
});

describe("SensorController", () => {
  describe("getSensors", () => {
    test("should return empty array", async () => {
      const spy = jest
        .spyOn(SensorRepository, "getSensors")
        .mockResolvedValueOnce([]);
      const controller = new SensorController();
      const sensors = await controller.getAll();
      expect(sensors).toEqual([]);
      expect(spy).toHaveBeenCalledWith();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    test("should return sensors list", async () => {
      const sensorsData = generateSenorsData(2);
      const spy = jest
        .spyOn(SensorRepository, "getSensors")
        .mockResolvedValueOnce(sensorsData);
      const controller = new SensorController();
      const sensors = await controller.getAll();
      expect(sensors).toEqual(sensorsData);
      expect(spy).toHaveBeenCalledWith();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe("addSensor", () => {
    test("should add sensor to the database", async () => {
      const payload = generateSensorPayload();
      const sensorData = generateSensorData(payload);
      const spy = jest
        .spyOn(SensorRepository, "createSensor")
        .mockResolvedValueOnce(sensorData);
      const controller = new SensorController();
      const sensor = await controller.create(payload);
      expect(sensor).toMatchObject(payload);
      expect(sensor).toEqual(sensor);
      expect(spy).toHaveBeenCalledWith(payload);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateSensor", () => {
    test("should update sensor to the database", async () => {
      const id = faker.random.uuid();
      const payload = generateSensorPayload();
      const sensorData = generateSensorData({ ...payload, id });
      const spy = jest
        .spyOn(SensorRepository, "updateSensor")
        .mockResolvedValueOnce(sensorData);
      const controller = new SensorController();
      const sensor = await controller.update(id, payload);
      expect(sensor).toMatchObject(payload);
      expect(sensor).toEqual(sensor);
      expect(spy).toHaveBeenCalledWith(id, payload);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe("getSensor", () => {
    test("should return sensor from the database", async () => {
      const id = faker.random.uuid();
      const sensorData = generateSensorData({ id });
      const spy = jest
        .spyOn(SensorRepository, "getSensor")
        .mockResolvedValueOnce(sensorData);
      const controller = new SensorController();
      const sensor = await controller.get(id);
      expect(sensor).toEqual(sensorData);
      expect(sensor?.id).toBe(id);
      expect(spy).toHaveBeenCalledWith(id);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    test("should return null if user not found", async () => {
      const id = faker.random.uuid();
      const spy = jest
        .spyOn(SensorRepository, "getSensor")
        .mockResolvedValueOnce(null);
      const controller = new SensorController();
      const sensor = await controller.get(id);
      expect(sensor).toBeNull();
      expect(spy).toHaveBeenCalledWith(id);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe("deleteSensor", () => {
    test("should delete sensor from the database", async () => {
      const id = faker.random.uuid();
      const sensorData = generateSensorData({ id });
      const spy = jest
        .spyOn(SensorRepository, "deleteSensor")
        .mockResolvedValueOnce(sensorData);
      const controller = new SensorController();
      const sensor = await controller.delete(id);
      expect(sensor).toEqual(sensorData);
      expect(sensor?.id).toBe(id);
      expect(spy).toHaveBeenCalledWith(id);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    test("should return null if user not found", async () => {
      const id = faker.random.uuid();
      const spy = jest
        .spyOn(SensorRepository, "deleteSensor")
        .mockResolvedValueOnce(null);
      const controller = new SensorController();
      const sensor = await controller.delete(id);
      expect(sensor).toBeNull();
      expect(spy).toHaveBeenCalledWith(id);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
