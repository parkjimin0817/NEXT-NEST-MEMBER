export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface SignUpResponse {
  success: boolean;
  message?: string;
  data?: { memberId: string; email: string };
  errors?: { field: string; message: string }[];
}

export interface CheckEmailResponse {
  success: boolean;
  data: {
    exists: boolean;
    message: string;
  };
  timestamp: string;
  path: string;
}

export interface CheckIdResponse {
  success: boolean;
  data: {
    exists: boolean;
    message: string;
  };
  timestamp: string;
  path: string;
}

export interface CheckPwdResponse {
  success: boolean;
  data: {
    isMatched: boolean;
    message: string;
  };
  timestamp: string;
  path: string;
}
