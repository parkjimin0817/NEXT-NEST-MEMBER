"use client";
import { apiClient } from "@/libs/apiClient";
import { useState, useCallback } from "react";
import { SignUpResponse } from "@/libs/types";

//1) 회원가입 요청에 보낼 데이터 타입
export interface SignUpPayload {
  memberId: string;
  memberPwd: string;
  email: string;
}

//2) 백엔드에서 보내줄 응답 타입 -> type.ts로 뺌

//3) 훅이 바깥으로 제공할 값들의 타입
interface UseSignUpResult {
  isLoading: boolean;
  error: string | null;
  signUp: (payload: SignUpPayload) => Promise<SignUpResponse | null>;
}

export function useSignUp(): UseSignUpResult {
  //4) 로딩 / 에러 상태
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //5) 실제 회원가입 요청 함수
  const signUp = useCallback(
    async (payload: SignUpPayload): Promise<SignUpResponse | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await apiClient<SignUpResponse>(`/member/signup`, {
          method: "POST",
          body: JSON.stringify(payload),
        });

        //실패
        if (result.success === false) {
          setError(result.message ?? "회원가입에 실패했습니다.");
          return null;
        }

        //성공
        return result;
      } catch (e) {
        //apiClient에서 throw한 Error 처리
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("네트워크 오류 발생");
        }
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  //6)컴포넌트에서 쓸 것들 반환
  return {
    isLoading,
    error,
    signUp,
  };
}
