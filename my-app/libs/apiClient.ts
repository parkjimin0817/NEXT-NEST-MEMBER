import { API_BASE_URL } from "./api";

/**
 * 1) <T = any> : 제네릭 타입 파라미터
 * T는 "이 함수가 리턴할 데이터의 타입"
 * =any 는 기본값
 *
 * 2) Promise<T>는 반환 타입
 */
export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    //기본헤더
    headers: { "Content-Type": "application/json" },
    //호출 쪽에서 헤더 보내면 그걸로 병합
    ...(options?.headers || {}),
    //나머지 옵션
    ...options,
  });

  //실패일 때
  if (!res.ok) {
    //서버 응답을 그대로 문자열로 읽어오는 함수 text()
    const text = await res.text();
    const msg = text || "서버 오류 발생";
    throw new Error(msg);
  }

  //성공일 때
  return res.json() as Promise<T>;
}
