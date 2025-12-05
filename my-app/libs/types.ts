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
  exists: boolean;
  available: boolean;
  message?: string;
}

export interface CheckIdResponse {
  exists: boolean;
  available: boolean;
  message?: string;
}
