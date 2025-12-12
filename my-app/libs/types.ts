export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PingPongResponse {
  success: boolean;
  data: { message: string };
  timestamp: string;
  path: string;
}

//Member
export interface SignUpResponse {
  success: boolean;
  message?: string;
  data?: { memberId: string; email: string };
  error?: { field: string; message: string };
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

//Board
export interface CreateBoardResponse {
  success: boolean;
  data: {
    boardNo: string;
  };
  timestamp: string;
  path: string;
}

export interface BoardDetailResponse {
  success: boolean;
  data: {
    boardNo: number;
    boardTitle: string;
    boardContent: string;
    createdAt: string;
    memberNo: number;
    memberId: string;
  };
  timestamp: string;
  path: string;
}

//Board 목록
export interface BoardItem {
  boardNo: string;
  boardTitle: string;
  memberNo: string;
  memberId: string;
  createdAt: string;
}

export interface BoardListMeta {
  page: number;
  size: number;
  totalCount: number;
  totalPages: number;
}

export interface BoardListData {
  items: BoardItem[];
  meta: BoardListMeta;
}

export interface BoardListResponse {
  success: boolean;
  data: BoardListData;
  timestamp: string;
  path: string;
}
