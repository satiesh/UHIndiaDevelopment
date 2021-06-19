// =============================
// Email: satish@urbanhood.org
// urbanhood.org
// =============================

import { Injectable } from '@angular/core';
import { tradingtools } from '@app/models/tradingtools';
import { map, catchError, tap } from 'rxjs/operators';
import { environment as env } from '@environments/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { sendinbluecontact, ServiceError, sendinblueWelcomeMail } from '../models';
const serviceUrl = env.backendApiUrl
const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
    "api-key": env.sendinBlueKey,
    "Accept": "application/json"
  })
};



@Injectable({
  providedIn: 'root'
})

export class EmailService {

  constructor(private http: HttpClient) { }

  getSendinbBlueContact(email: string): Observable<any | ServiceError> {
    return this.http
      .get(`${env.sendinBlueApi}contacts/`+ email, httpOptions)
      .pipe(
        map((r: any) => r),
        catchError(error => this.handleHttpError(error, `getSendinbBlueContact`))
      );
  }

  createSendinbBlueContact(sendinBlueContact: sendinbluecontact): Observable<any | ServiceError> {
    console.log(sendinBlueContact);
    return this.http
      .post(`${env.sendinBlueApi}contacts`, sendinBlueContact, httpOptions)
      .pipe(
        map((r: any) => r),
        catchError(error => this.handleHttpError(error, `createSendinbBlueContact(${sendinBlueContact})`))
      );
  }

  sendWelcomeEmail(sendWelcomeMil: sendinblueWelcomeMail): Observable<any | ServiceError> {
    return this.http
      .post(`${env.sendinBlueApi}smtp/email`, sendWelcomeMil, httpOptions)
      .pipe(
        map((r: any) => r),
        catchError(error => this.handleHttpError(error, `sendWelcomeEmail(${sendWelcomeMil})`))
      );
  }

  private handleHttpError(
    error: HttpErrorResponse,
    operation: string
  ): Observable<ServiceError> {
    
    let searchServiceError = new ServiceError(true);
    searchServiceError.httpStatusCode = error.status;
    searchServiceError.httpStatusMessage = error.statusText;
    searchServiceError.friendlyMessage = JSON.stringify(error.error);
    return throwError(searchServiceError);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }
}
