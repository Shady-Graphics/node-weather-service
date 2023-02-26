import { Metric } from "../models";
import { getRepository } from "typeorm";
import * as JoiImport from "joi";
import joiDate from "@joi/date";

const Joi = JoiImport.extend(joiDate) as typeof JoiImport;

enum Operation {
  AVERAGE = "AVG",
  SUM = "SUM",
  MIN = "MIN",
  MAX = "MAX",
}

enum Measure {
  WIND_SPEED = "windSpeed",
  HUMIDITY = "humidity",
  TEMPERATURE = "temperature",
}

export const statisticsPayloadValidation = Joi.object({
  sensors: Joi.array().items(Joi.string().uuid()).unique().required().min(0),
  operation: Joi.string()
    .valid(Operation.AVERAGE, Operation.SUM, Operation.MAX, Operation.MIN)
    .required(),
  measures: Joi.array()
    .items(Joi.valid(Measure.WIND_SPEED, Measure.HUMIDITY, Measure.TEMPERATURE))
    .unique()
    .required()
    .min(1)
    .max(3),
  startDate: Joi.date().format("YYYY-MM-DD").optional(),
  endDate: Joi.date().format("YYYY-MM-DD").min(Joi.ref("startDate")).optional(),
});

export interface StatisticsPayload {
  sensors: string[];
  operation: string;
  measures: string[];
  startDate: Date;
  endDate: Date;
}

export interface ISummaryItem {
  id: string;
  data: { string: number };
}

export interface ISummaryPayload {
  operation: string;
  sensors: ISummaryItem[];
}

export const query = async (payload: StatisticsPayload) => {
  const repository = getRepository(Metric);
  const query = repository
    .createQueryBuilder("metric")
    .select("metric.sensorId AS sensor");

  payload.measures.forEach((measure) => {
    query.addSelect(
      `ROUND(${payload.operation}(metric.${measure}), 2) AS ${measure}`
    );
  });

  query.where("metric.createdAt BETWEEN :startDate AND :endDate ", {
    startDate: new Date(payload.startDate).toISOString(),
    endDate: new Date(payload.endDate).toISOString(),
  });

  if (payload.sensors.length > 0) {
    query.andWhere("metric.sensorId IN (:...sensors)", {
      sensors: payload.sensors,
    });
  }

  query.groupBy("metric.sensorId");

  const results = await query.getRawMany();
  return getResultsSummary(payload.operation, results);
};

const getResultsSummary = (operation: string, results: any[]) => {
  const summary: ISummaryPayload = {
    operation,
    sensors: [],
  };

  results.forEach((result: any) => {
    const id = result.sensor;
    delete result.sensor,
      summary.sensors.push({
        id,
        data: {
          ...result,
        },
      });
  });
  return summary;
};
