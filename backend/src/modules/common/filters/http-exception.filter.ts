import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException) //HttpException타입의 에러만 잡겠다
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); //1. 실행 컨텍스트에서 HTTP 관련 객체를 가져온다.
    const response = ctx.getResponse<Response>(); //2. Express의 Response객체
    const request = ctx.getRequest<Request>(); //3. Express의 Request 객체
    const status = exception.getStatus(); //4.예외가 발생한 상태 코드 (예: 400, 404)

    //exception에서 message 부분을 추출한다.
    //(string일 수도 있고 object일 수도 있어서 분기 처리)
    const errorResponse = exception.getResponse();
    const message =
      typeof errorResponse === 'object'
        ? errorResponse['message']
        : errorResponse;

    //원하는 형태로 응답 JSON 구성
    response.status(status).json({
      success: false,
      timestamp: new Date().toISOString(),
      path: request.url,
      statusCode: status,
      message: message,
    });
  }
}
