import http from "k6/http";
import { test } from "k6/execution";
import { sleep, check } from "k6";
import { randomItem } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";

export const config = {
  baseUrl: "http://192.168.0.7:8200/weather-service",
  waitTime: 1,
};

export const options = {
  stages: [
    { duration: "1m", target: 2 },
    { duration: "1m30s", target: 4 },
    { duration: "30s", target: 3 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"], // http errors should be less than 1%
    http_req_duration: ["p(95)<200"], // 95% of requests should be below 200ms
  },
};

const operations = ["AVG", "SUM", "MIN", "MAX"];

export function getQuery(sensors) {
  const date = new Date().toISOString().split("T")[0];
  return {
    sensors,
    operation: randomItem(operations),
    measures: ["windSpeed", "humidity", "temperature"],
    startDate: date,
    endDate: date,
  };
}

export function setup() {
  const sensorIds = [];

  const requestParams = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = http.get(`${config.baseUrl}/sensors/`, requestParams);
  if (res.status !== 200) {
    test.abort("failed to get sensors");
  }

  const sensors = res.json();
  sensors.forEach((sensor) => sensorIds.push(sensor.id));
  return sensorIds;
}

export default function (sensors) {
  const requestParams = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = http.post(
    `${config.baseUrl}/statistics`,
    JSON.stringify(getQuery(sensors)),
    requestParams
  );
  check(res, { "is status 200": (r) => r.status === 200 });
  // sleep(config.waitTime);
}
