import http from "k6/http";
import { test } from "k6/execution";
import { sleep, check } from "k6";
import { randomString } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";

export const config = {
  baseUrl: "http://192.168.0.7:8200/weather-service",
  numberOfSensors: 10,
  waitTime: 1,
};

export function generateRandomFloatInRange(min, max) {
  return Math.random() * (max - min + 1) + min;
}

export function getMetric() {
  return {
    temperature: generateRandomFloatInRange(-30, 40),
    humidity: generateRandomFloatInRange(0, 100),
    windSpeed: generateRandomFloatInRange(0, 500),
  };
}

export const options = {
  stages: [
    { duration: "1m", target: 3 },
    { duration: "1m30s", target: 5 },
    // { duration: "1m", target: 3 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"], // http errors should be less than 1%
    http_req_duration: ["p(95)<200"], // 95% of requests should be below 200ms
  },
};

export function setup() {
  const sensors = [];
  let sensorsCreated = 0;

  const requestParams = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  while (sensorsCreated <= config.numberOfSensors) {
    const group = randomString(5);
    const payload = {
      name: `${group}${sensorsCreated}`,
      location: "k6tester",
    };
    const res = http.post(
      `${config.baseUrl}/sensors`,
      JSON.stringify(payload),
      requestParams
    );
    if (res.status !== 201) {
      test.abort(`failed to create ${payload.name}`, res);
    }
    sensors.push(res.json());
    sensorsCreated++;
  }
  return sensors;
}

export default function (sensors) {
  const requestParams = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  sensors.forEach((sensor) => {
    const res = http.post(
      `${config.baseUrl}/sensors/${sensor.id}/metrics/`,
      JSON.stringify(getMetric()),
      requestParams
    );
    check(res, { "is status 201": (r) => r.status === 201 });
  });

  // sleep(config.waitTime);
}
