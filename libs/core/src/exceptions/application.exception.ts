import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../enums/error-code.enum';
import { isNumber } from 'lodash';
export class ApplicationException extends HttpException {
  public readonly errorCode: ErrorCode | string;

  constructor(errorCode: ErrorCode | HttpStatus, description: string, objectOrError?: string | object | any) {
    const httpCode = isNumber(errorCode) ? errorCode : HttpStatus.BAD_REQUEST;
    super(
      HttpException.createBody(objectOrError ?? { message: description }, description, httpCode),
      httpCode
    );

    this.errorCode = isNumber(errorCode) ? null : errorCode;
  }
}
