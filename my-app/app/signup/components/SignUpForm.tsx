"use client";
import { useState, type ChangeEvent, type FormEvent } from "react";
//페이지 이동을 위한 Next.js Router
import { useRouter } from "next/navigation";
import { useSignUp } from "../hooks/useSignup";
import { apiClient } from "@/libs/apiClient";

import { CheckEmailResponse, CheckIdResponse } from "@/libs/types";

//컴포넌트: <SignUpForm/>
export default function SignUpForm() {
  /**
   * form 객체에 입력값들을 묶어서 상태로 관리
   * 초기값은 비어있는 string
   * setForm()은 입력 변경 시 상태 업데이트
   */
  const [form, setForm] = useState({
    memberId: "",
    memberPwd: "",
    confirmPwd: "",
    email: "",
  });

  //로컬 에러 메세지를 위한 상태값 : 비밀번호 불일치 등 오류를 보여줄 때 사용
  interface LocalErrorState {
    email: string | null;
    memberId: string | null;
    memberPwd: string | null;
    confirmPwd: string | null;
  }
  const [localError, setLocalError] = useState<LocalErrorState>({
    email: null,
    memberId: null,
    memberPwd: null,
    confirmPwd: null,
  });

  //이메일 중복 확인 상태 관리
  const [isCheckingEmail, setIsCheckingEmail] = useState(false); // 중복 확인 로딩
  const [emailChecked, setEmailChecked] = useState<boolean | null>(null); // null: 아직 안함, true/false: 결과
  const [idChecked, setIdChecked] = useState<boolean | null>(null); // null: 아직 안함, true/false: 결과

  /**
   * 회원가입 로직을 담당하는 커스텀 훅
   */
  const { isLoading, error: apiError, signUp } = useSignUp();

  //페이지 이동을 위한 Next.js Router
  const router = useRouter();

  /**
   * 모든 input의 onChange 이벤트를 처리하는 함수
   * 매번 함수를 따로 만들 필요 없이 공통 처리할 수 있도록
   */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    // 이메일 입력이 바뀌면, 이전 중복 확인 결과/에러 초기화
    if (name === "email") {
      setEmailChecked(null);
      setLocalError((prev) => ({
        ...prev,
        email: "",
      }));
    }
    //비밀번호 형식 검사
    const passwordRule =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

    // 1) 비밀번호 형식 검사
    if (name === "memberPwd") {
      let msg = "";

      if (!passwordRule.test(value)) {
        msg = "영문, 숫자, 특수문자를 포함한 8자 이상이어야 합니다.";
      }

      setLocalError((prev) => ({
        ...prev,
        memberPwd: msg,
      }));

      // 비밀번호가 바뀌면, 이미 입력된 확인 비밀번호와의 일치 여부도 다시 검사
      if (form.confirmPwd) {
        setLocalError((prev) => ({
          ...prev,
          confirmPwd:
            form.confirmPwd !== value ? "비밀번호가 일치하지 않습니다." : "",
        }));
      }
    }

    // 2) 비밀번호 확인 입력 시 일치 검사
    if (name === "confirmPwd") {
      setLocalError((prev) => ({
        ...prev,
        confirmPwd:
          value !== form.memberPwd ? "비밀번호가 일치하지 않습니다." : "",
      }));
    }
  };

  //이메일 중복 확인
  const handleCheckEmail = async () => {
    // 기본 에러 초기화
    setLocalError((prev) => ({
      ...prev,
      email: "",
    }));

    //이메일 입력하시오
    if (!form.email) {
      setLocalError((prev) => ({
        ...prev,
        email: "이메일을 먼저 입력해주세요.",
      }));
      return;
    }

    //이메일 형식 검사
    const emailRule = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRule.test(form.email)) {
      setLocalError((prev) => ({
        ...prev,
        email: "올바른 이메일 형식이 아닙니다.",
      }));
      return;
    }

    //api 호출
    try {
      setIsCheckingEmail(true);

      const emailResult = await apiClient<CheckEmailResponse>(
        "/member/checkEmail",
        {
          method: "POST",
          body: JSON.stringify({ email: form.email }),
        }
      );

      if (emailResult.exists) {
        // 이미 사용 중인 이메일
        setEmailChecked(false);
        setLocalError((prev) => ({
          ...prev,
          email: emailResult.message ?? null,
        }));
      } else {
        // 사용 가능한 이메일
        setEmailChecked(true);
        setLocalError((prev) => ({
          ...prev,
          email: "", // 에러는 제거
        }));
      }
    } catch (e) {
      setEmailChecked(false);
      if (e instanceof Error) {
        setLocalError((prev) => ({
          ...prev,
          email: e.message,
        }));
      } else {
        setLocalError((prev) => ({
          ...prev,
          email: "이메일 확인 중 오류가 발생했습니다.",
        }));
      }
    } finally {
      setIsCheckingEmail(false);
    }
  };

  //아이디 중복 확인
  const handleIdBlur = async () => {
    // 아이디 비어있으면 중복 체크 안 함
    if (!form.memberId) return;

    try {
      const idResult = await apiClient<CheckIdResponse>("/member/checkId", {
        method: "POST",
        body: JSON.stringify({ memberId: form.memberId }),
      });

      if (idResult.exists) {
        //사용중
        setIdChecked(false);
        setLocalError((prev) => ({
          ...prev,
          memberId: idResult.message ?? null,
        }));
      } else {
        //사용 가능
        setIdChecked(true);
        setLocalError((prev) => ({
          ...prev,
          memberId: "",
        }));
      }
    } catch (e) {
      setIdChecked(false);
      if (e instanceof Error) {
        setLocalError((prev) => ({
          ...prev,
          email: e.message,
        }));
      } else {
        setLocalError((prev) => ({
          ...prev,
          memberId: "아이디 확인 중 오류가 발생했습니다.",
        }));
      }
    }
  };

  /**
   * 폼 제출 이벤트 함수
   * 1) 기본 submit 동작 막기
   * 2) 비밀번호 확인 검사
   * 3) useSignUp 훅의 signUp() 호출
   * 4) 성공 시 로그인 페이지로 이동
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError({
      email: "",
      memberId: "",
      memberPwd: "",
      confirmPwd: "",
    });

    //1) 클라이언트 유효성 검사 : 비밀번호 확인
    if (form.memberPwd !== form.confirmPwd) {
      setLocalError((prev) => ({
        ...prev,
        confirmPwd: "비밀번호가 일치하지 않습니다.",
      }));
      return;
    }

    //1-1) 이메일 중복 확인 하세요
    if (emailChecked !== true) {
      setLocalError((prev) => ({
        ...prev,
        email: "이메일 중복 확인을 먼저 해주세요.",
      }));
      return;
    }

    //2) 회원가입 API 호출
    const result = await signUp({
      memberId: form.memberId,
      memberPwd: form.memberPwd,
      email: form.email,
    });

    //3) 실패 시
    if (!result || result.success === false) {
      return;
    }

    //4) 성공 시
    alert("회원가입이 완료되었습니다.");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-md border border-gray-100 p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">회원가입</h1>
        <p className="text-sm text-gray-500 mb-6">
          아래 정보를 입력하고 회원가입을 완료하세요.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              이메일
            </label>

            <div className="flex gap-2">
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                 placeholder:text-gray-400"
                placeholder="example@domain.com"
              />
              <button
                type="button"
                onClick={handleCheckEmail}
                disabled={isCheckingEmail || !form.email}
                className="px-3 py-2.5 text-sm rounded-lg border border-gray-300 text-gray-700
                 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
              >
                {isCheckingEmail ? "확인 중..." : "중복 확인"}
              </button>
            </div>

            {/* 에러 출력 */}
            {localError.email && (
              <p className="text-sm text-red-600 mt-1">{localError.email}</p>
            )}

            {/* 성공 메시지 (중복 아님) */}
            {!localError.email && emailChecked === true && (
              <p className="text-sm text-green-600 mt-1">
                사용 가능한 이메일입니다.
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              아이디
            </label>
            <input
              name="memberId"
              value={form.memberId}
              onChange={handleChange}
              onBlur={handleIdBlur}
              required
              className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                         placeholder:text-gray-400"
              placeholder="아이디를 입력하세요"
            />
            {/* 에러 출력 */}
            {localError.memberId && (
              <p className="text-sm text-red-600 mt-1">{localError.memberId}</p>
            )}

            {/* 성공 메시지 (중복 아님) */}
            {!localError.memberId && idChecked === true && (
              <p className="text-sm text-green-600 mt-1">
                사용 가능한 이메일입니다.
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <input
              type="password"
              name="memberPwd"
              value={form.memberPwd}
              onChange={handleChange}
              required
              className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                         placeholder:text-gray-400"
              placeholder="영문, 숫자, 특수문자 포함 8자 이상"
            />
            {localError.memberPwd && (
              <p className="text-sm text-red-600 mt-1">
                {localError.memberPwd}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              비밀번호 확인
            </label>
            <input
              type="password"
              name="confirmPwd"
              value={form.confirmPwd}
              onChange={handleChange}
              required
              className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                         placeholder:text-gray-400"
              placeholder="비밀번호를 다시 입력하세요"
            />
            {localError.confirmPwd && (
              <p className="text-sm text-red-600 mt-1">
                {localError.confirmPwd}
              </p>
            )}
          </div>

          {/* 서버/네트워크 에러 (useSignUp 훅에서 온 에러) */}
          {apiError && <p className="text-sm text-red-600">{apiError}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white
                       hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                       transition-colors"
          >
            {isLoading ? "회원가입 중..." : "회원가입"}
          </button>
        </form>
      </div>
    </div>
  );
}
