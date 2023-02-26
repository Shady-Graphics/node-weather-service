import {
  StatisticsPayload,
  ISummaryPayload,
  query,
} from "../repositories/statistics.repository";
import { sub, format } from "date-fns";
import { Route, Tags, Post, Body } from "tsoa";

@Route("/weather-service/statistics")
@Tags("Statistics")
export default class StatisticsController {
  @Post("/")
  public async query(
    @Body() body: StatisticsPayload
  ): Promise<ISummaryPayload | null> {
    const now = format(new Date(), "yyyy-MM-dd");

    let start = new Date(body.startDate || now);
    start.setUTCHours(0, 0, 0, 0);
    let end = new Date(body.endDate || now);
    end.setUTCHours(23, 59, 59, 999);

    if (start <= sub(end, { months: 1 })) {
      throw new Error(
        `Invalid date range - start date ${start.toISOString()} cannot be more than a month before end date ${end.toISOString()}`
      );
    }

    return query({ ...body, startDate: start, endDate: end });
  }
}
