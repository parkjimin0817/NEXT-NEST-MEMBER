//공통 응답 타입 정의

/**
 * 1) 성공응답
 * success: true + data
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  timestamp: string;
  path: string;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
}

/**
 * 2) 실패응답
 * success: false + statusCode + message + errors[]
 */
export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  code?: string;
  message: string;
  errors?: ApiErrorDetail[];
  timestamp: string;
  path: string;
}
