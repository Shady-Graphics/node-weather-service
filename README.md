## weather-service

A simple Node based REST API which supports the following use-cases:

- manage a sensor (crud operations)
- allow a sensor to report metrics
- query a summary of sensor data e.g. Give me the average temperature and humidity for sensor 1
  in the last week.

### Endpoints

- GET /weather-service/sensors/
- POST /weather-service/sensors/
- GET /weather-service/sensors/{ID}
- PUT /weather-service/sensors/{ID}
- DELETE /weather-service/sensors/{ID}
- POST /weather-service/sensors/{ID}/metrics/
- POST /weather-service/statistics/

View API docs http://localhost:8200/weather-service/docs/

## Running locally

Docker compose provides an abstraction over Docker for container orchestration. The included docker-compose file starts a postgres instance and weather-service on http://localhost:8200/weather-service. Data is persisted across container restarts via a mounted pgdata volume.

*Assumes docker and docker-compose are available*

```sh
docker-compose build && docker-compose up -d
```

## Viewing logs

```sh
docker ps
docker logs <container-name> -f
```

## Run tests

```sh
npm test
```

## Run load tests

Two simple load tests are included based on the k6 package.

- test/load/sensor-script.js - creates a number of sensors, and reports sensor metrics
- test/load/query-script.js - hits the statistics endpoint

Run the following command in the project directory, choosing sensor-script.js or query-script.js

*Assumes Docker is available*

**Note:** the scripts reference a local 192 address which may need to be updated.

```sh
docker run --rm -v $(pwd)/test/load:/scripts loadimpact/k6:latest run /scripts/sensor-script.js
```

## Suggested Enhancements

*In no particular order*

- more tests
- fix swagger doc, base url is missing for a start! An attempt is viewable at `<host>:<port>/weather-service/docs`
- better error handling and more of it
- validation
- use a proper logger and log!
- bulk inserts
- api versioning
- custom metrics
- linting and code formatting
