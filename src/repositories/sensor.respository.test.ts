import * as SensorRepository from "./sensor.repository";
import { getRepository } from "typeorm";
import { mocked } from "jest-mock";
import {
  generateSenorsData,
  generateSensorData,
  generateSensorMetricData,
  generateSensorMetricPayload,
  generateSensorPayload,
} from "../../test/utils/generate";
import faker from "faker";

jest.mock("typeorm");

const mockedGetRepo = mocked(getRepository(<jest.Mock>{}));

beforeEach(() => {
  mockedGetRepo.find.mockClear();
  mockedGetRepo.findOne.mockClear();
  mockedGetRepo.save.mockClear();
  mockedGetRepo.remove.mockClear();
});

describe("SensorRepository", () => {
  describe("getSensors", () => {
    test("should return empty array", async () => {
      mockedGetRepo.find.mockResolvedValue([]);
      const sensors = await SensorRepository.getSensors();
      expect(sensors).toEqual([]);
      expect(mockedGetRepo.find).toHaveBeenCalledWith();
      expect(mockedGetRepo.find).toHaveBeenCalledTimes(1);
    });

    test("should return sensor list", async () => {
      const sensorsData = generateSenorsData(2);
      mockedGetRepo.find.mockResolvedValue(sensorsData);
      const sensors = await SensorRepository.getSensors();
      expect(sensors).toEqual(sensorsData);
      expect(mockedGetRepo.find).toHaveBeenCalledWith();
      expect(mockedGetRepo.find).toHaveBeenCalledTimes(1);
    });
  });

  describe("createSensor", () => {
    test("should add sensor to the database", async () => {
      const payload = generateSensorPayload();
      const sensorData = generateSensorData(payload);
      mockedGetRepo.findAndCount.mockResolvedValue([[], 0]);
      mockedGetRepo.save.mockResolvedValue(sensorData);
      const sensor = await SensorRepository.createSensor(payload);
      expect(sensor).toMatchObject(payload);
      expect(sensor).toEqual(sensorData);
      expect(mockedGetRepo.save).toHaveBeenCalledWith(payload);
      expect(mockedGetRepo.save).toHaveBeenCalledTimes(1);
    });
  });

  describe("getSensor", () => {
    test("should return sensor from the database", async () => {
      const id = faker.random.uuid();
      const sensorData = generateSensorData({ id });
      mockedGetRepo.findOne.mockResolvedValue(sensorData);
      const sensor = await SensorRepository.getSensor(id);
      expect(sensor).toEqual(sensorData);
      expect(sensor?.id).toBe(id);
      expect(mockedGetRepo.findOne).toHaveBeenCalledWith({ id });
      expect(mockedGetRepo.findOne).toHaveBeenCalledTimes(1);
    });

    test("should return null if sensor is not found", async () => {
      const id = faker.random.uuid();
      mockedGetRepo.findOne.mockResolvedValue(null);
      const sensor = await SensorRepository.getSensor(id);
      expect(sensor).toBeNull();
      expect(mockedGetRepo.findOne).toHaveBeenCalledWith({ id });
      expect(mockedGetRepo.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateSensor", () => {
    test("should return updated sensor from the database", async () => {
      const id = faker.random.uuid();
      const payload = generateSensorPayload();
      const sensorData = generateSensorData({ ...payload, id });
      mockedGetRepo.findOne.mockResolvedValue(sensorData);
      mockedGetRepo.save.mockResolvedValue(sensorData);
      const sensor = await SensorRepository.updateSensor(id, payload);
      expect(sensor).toEqual(sensorData);
      expect(sensor?.id).toBe(id);
      expect(mockedGetRepo.findOne).toHaveBeenCalledWith({ id });
      expect(mockedGetRepo.findOne).toHaveBeenCalledTimes(1);
      expect(mockedGetRepo.save).toHaveBeenCalledTimes(1);
    });

    test("should return null if sensor is not found", async () => {
      const id = faker.random.uuid();
      mockedGetRepo.findOne.mockResolvedValue(null);
      const sensor = await SensorRepository.updateSensor(
        id,
        generateSensorPayload()
      );
      expect(sensor).toBeNull();
      expect(mockedGetRepo.findOne).toHaveBeenCalledWith({ id });
      expect(mockedGetRepo.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe("deleteSensor", () => {
    test("should return deleted sensor from the database", async () => {
      const id = faker.random.uuid();
      const sensorData = generateSensorData({ id, raw: "" });
      mockedGetRepo.findOne.mockResolvedValue(sensorData);
      mockedGetRepo.remove.mockResolvedValue({ ...sensorData, raw: "" });
      const sensor = await SensorRepository.deleteSensor(id);
      expect(sensor).toEqual(sensorData);
      expect(sensor?.id).toBe(id);
      expect(mockedGetRepo.findOne).toHaveBeenCalledWith({ id });
      expect(mockedGetRepo.findOne).toHaveBeenCalledTimes(1);
      expect(mockedGetRepo.remove).toHaveBeenCalledTimes(1);
    });

    test("should return null if sensor is not found", async () => {
      const id = faker.random.uuid();
      mockedGetRepo.findOne.mockResolvedValue(null);
      const sensor = await SensorRepository.deleteSensor(id);
      expect(sensor).toBeNull();
      expect(mockedGetRepo.findOne).toHaveBeenCalledWith({ id });
      expect(mockedGetRepo.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe("createSensorMetric", () => {
    test("should return null if sensor is not found", async () => {
      const id = faker.random.uuid();
      mockedGetRepo.findOne.mockResolvedValue(null);
      const sensor = await SensorRepository.createSensorMetric(
        id,
        {} as SensorRepository.ISensorMetricPayload
      );
      expect(sensor).toBeNull();
      expect(mockedGetRepo.findOne).toHaveBeenCalledWith({ id });
      expect(mockedGetRepo.findOne).toHaveBeenCalledTimes(1);
    });

    test("should add sensor metric to the database", async () => {
      const id = faker.random.uuid();
      const sensorData = generateSensorData({ id });
      const sensorMetricPayload = generateSensorMetricPayload({ sensorId: id });
      const sensorMetricData = generateSensorMetricData({
        ...sensorMetricPayload,
      });
      mockedGetRepo.findOne.mockResolvedValue(sensorData);
      mockedGetRepo.save.mockResolvedValue(sensorMetricData);

      const sensorMetric = await SensorRepository.createSensorMetric(
        id,
        sensorMetricPayload
      );

      expect(sensorMetric).toEqual(sensorMetricData);
      expect(sensorMetric?.sensorId).toEqual(id);
      expect(mockedGetRepo.save).toHaveBeenCalledWith(sensorMetricPayload);
      expect(mockedGetRepo.save).toHaveBeenCalledTimes(1);
    });
  });
});
