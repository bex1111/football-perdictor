import { RequestOptions } from "https";
import { writeFile, readFile, isFileExist } from "../file/FileGateway";
import { DateGateway } from "../DateGateway";
import { ClientRequest, IncomingMessage } from "http";
import { ApiFootballError} from "../../exception/ApiFootballError";
import { ApiFootballInputType } from "../../type/ApiFootballInputType";

export class ApiFootballInput {
  private readonly _input: ApiFootballInputType;
  private readonly _dateGateway: DateGateway;
  private readonly _get: (
    options: RequestOptions | string | URL,
    callback?: (res: IncomingMessage) => void
  ) => ClientRequest;

  get input() {
    return this._input;
  }

  constructor(
    dateGateway: DateGateway,
    get: (
      options: RequestOptions | string | URL,
      callback?: (res: IncomingMessage) => void
    ) => ClientRequest
  ) {
    this._dateGateway = dateGateway;
    this._get = get;
    this._input = this.loadInput();
    console.log(this._input);
  }

  private loadInput() {
    let data;
    if (isFileExist(this.generateFileName())) {
      data = readFile(this.generateFileName());
    } else {
      data = this.downloadData();
    }
    return JSON.parse(data);
  }

  private downloadData(): any {
    let data = "";
    let startDate = this.formatDate(new Date("2023-08-11"));
    let endDate = this.formatDate(this._dateGateway.now());
    let premierLeagueId = 152;

    this._get(
      [
        `https://apiv3.apifootball.com/?action=get_events&`,
        `from=${startDate}&`,
        `to=${endDate}&`,
        `league_id=${premierLeagueId}&`,
        `APIkey=${process.env.API_KEY}`,
      ].join(""),
      (response) => {
        response
          .on("data", (append) => (data += append))
          .on("error", (e) => {throw new ApiFootballError(e)})
          .on("end", () => writeFile(this.generateFileName(), data));
      }
    );

    return data;
  }

  private generateFileName() {
    return `cached-data-${this.formatDate(this._dateGateway.now())}.json`;
  }

  private formatDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }
}
