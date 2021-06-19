
export class ServiceError {
    public httpStatusCode: number;
    public httpStatusMessage: string;
    public friendlyMessage: string;
    public isServiceRestApi: boolean;
    public httpResponse: string;

    constructor(serviceMakesRestCall: boolean) {
        this.isServiceRestApi = serviceMakesRestCall;
    }

    public buildErrorMessage(): string {
        let errorMessage: string = "";

      errorMessage += `${this.httpResponse}`;
        errorMessage += this.isServiceRestApi
            ? ` || (${this.httpStatusCode}) ${this.httpStatusMessage}`
            : "";
        return errorMessage;
    }
}
