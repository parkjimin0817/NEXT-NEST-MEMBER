"use client";
import { useState } from "react";
//페이지 이동을 위한 Next.js Router
import { useRouter } from "next/navigation";
import { useSignUp } from "../hooks/useSignup";
import { apiClient } from "@/libs/apiClient";
import { CheckEmailResponse, CheckIdResponse } from "@/libs/types";
//유효성 검사 yup
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

//회원가입 폼 필드 타입
export type SignUpFormValues = {
  email: string;
  memberId: string;
  memberPwd: string;
  confirmPwd: string;
};

//yup 스키마
export const signUpSchema = yup.object({
  email: yup
    .string()
    .required("이메일을 입력해주세요.")
    .email("이메일 형식이 올바르지 않습니다."),
  memberId: yup
    .string()
    .required("아이디를 입력해주세요.")
    .min(5, "아이디는 영어, 숫자 포함 5~20자여야 합니다.")
    .max(20, "아이디는 영어, 숫자 포함 5~20자여야 합니다.")
    .matches(
      /^(?=.*[A-Za-z])[A-Za-z0-9]{5,20}$/,
      "아이디는 영어, 숫자 포함 5~20자여야 합니다."
    ),
  memberPwd: yup
    .string()
    .required("비밀번호를 입력해주세요.")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/,
      "영문, 숫자, 특수문자를 포함한 8자 이상이어야 합니다."
    ),
  confirmPwd: yup
    .string()
    .required("비밀번호 확인을 입력해주세요.")
    .oneOf([yup.ref("memberPwd")], "비밀번호가 일치하지 않습니다."),
});

export default function SignUpForm() {
  //페이지 이동 라우터
  const router = useRouter();
  //회원가입 커스텀 훅
  const { signUp, isLoading, error: globalError } = useSignUp();
  // 이메일/아이디 중복 확인 상태
  const [emailChecked, setEmailChecked] = useState<boolean | null>(null);
  const [idChecked, setIdChecked] = useState<boolean | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    watch,
    trigger,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SignUpFormValues>({
    resolver: yupResolver(signUpSchema),
    mode: "onChange",
  });

  const emailValue = watch("email");
  const memberIdValue = watch("memberId");

  const memberIdRegister = register("memberId");
  const emailRegister = register("email");

  // 이메일 중복 확인
  const handleCheckEmail = async () => {
    console.log("실행");
    // 형식 자체가 틀리면 먼저 막기
    if (errors.email) {
      setEmailChecked(null);
      return;
    }

    if (!emailValue) {
      setError("email", {
        type: "manual",
        message: "이메일을 입력해주세요.",
      });
      setEmailChecked(null);
      return;
    }

    try {
      const emailResult = await apiClient<CheckEmailResponse>(
        "/member/checkEmail",
        {
          method: "POST",
          body: JSON.stringify({ email: emailValue }),
        }
      );

      console.log(emailResult);

      if (emailResult.data.exists) {
        setEmailChecked(false);
        setError("email", {
          type: "server",
          message: emailResult.data.message ?? "이미 사용 중인 이메일입니다.",
        });
      } else {
        setEmailChecked(true);
        clearErrors("email");
      }
    } catch (e) {
      setEmailChecked(false);
      if (e instanceof Error) {
        setError("email", {
          type: "server",
          message: e.message,
        });
      } else {
        setError("email", {
          type: "server",
          message: "이메일 확인 중 오류가 발생했습니다.",
        });
      }
    }
  };

  // 아이디 중복 확인 (onBlur)
  const handleIdBlur = async () => {
    if (!memberIdValue) {
      setError("memberId", {
        type: "manual",
        message: "아이디를 입력해주세요.",
      });
      setIdChecked(null);
      return;
    }

    // 형식 자체가 틀리면 서버 호출 안 함
    if (errors.memberId) {
      setIdChecked(null);
      return;
    }

    try {
      const idResult = await apiClient<CheckIdResponse>("/member/checkId", {
        method: "POST",
        body: JSON.stringify({ memberId: memberIdValue }),
      });

      if (idResult.data.exists) {
        setIdChecked(false);
        setError("memberId", {
          type: "server",
          message: idResult.data.message ?? "이미 사용 중인 아이디입니다.",
        });
      } else {
        setIdChecked(true);
        clearErrors("memberId");
      }
    } catch (e) {
      setIdChecked(false);
      if (e instanceof Error) {
        setError("memberId", {
          type: "server",
          message: e.message,
        });
      } else {
        setError("memberId", {
          type: "server",
          message: "아이디 확인 중 오류가 발생했습니다.",
        });
      }
    }
  };

  type SignUpField = "memberId" | "email";

  const isSignUpField = (field: string): field is SignUpField => {
    return field === "memberId" || field === "email";
  };

  // 제출 핸들러 (react-hook-form용)
  const onSubmit = async (values: SignUpFormValues) => {
    // 이메일 중복 확인 여부
    if (emailChecked !== true) {
      setError("email", {
        type: "manual",
        message: "이메일 중복 확인을 먼저 해주세요.",
      });
      return;
    }

    // 필요하면 아이디 중복 확인도 강제할 수 있음
    // if (idChecked !== true) { ... }

    const result = await signUp({
      memberId: values.memberId,
      memberPwd: values.memberPwd,
      email: values.email,
    });

    // 네트워크/예상치 못한 예외
    if (!result) {
      alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
      return;
    }

    // 3) 서버 검증 실패
    if (!result.success) {
      // 3-1) 서버가 단일 필드 에러를 내려주는 경우 (memberId / email)
      if (result.error) {
        const { field, message } = result.error;

        if (isSignUpField(field)) {
          // 여기서만 RHF setError 사용 (필드 에러)
          setError(field, {
            type: "server",
            message,
          });
          return;
        }
      }

      // 3-3) 그 외 애매한 실패
      alert("회원가입 중 오류가 발생했습니다.");
      return;
    }

    // 4) 성공
    alert("회원가입이 완료되었습니다.");
    router.push("/login");
  };

  return (
    <>
      <p className="text-sm text-gray-500 mb-6">
        아래 정보를 입력하고 회원가입을 완료하세요.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* 이메일 */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            이메일
          </label>

          <div className="flex gap-2">
            <input
              type="email"
              {...emailRegister}
              onChange={(e) => {
                emailRegister.onBlur(e); // react-hook-form에 값 전달
                trigger("email"); // 이 필드만 즉시 검증
              }}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                 placeholder:text-gray-400"
              placeholder="example@domain.com"
            />
            <button
              type="button"
              onClick={handleCheckEmail}
              disabled={!emailValue || !!errors.email}
              className="px-3 py-2.5 text-sm rounded-lg border border-gray-300 text-gray-700
                 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
            >
              중복확인
            </button>
          </div>

          {/* 에러 출력 */}
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
          )}

          {/* 성공 메시지 (중복 아님) */}
          {!errors.email && emailChecked === true && (
            <p className="text-sm text-green-600 mt-1">
              사용 가능한 이메일입니다.
            </p>
          )}
        </div>

        {/* 아이디 */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            아이디
          </label>
          <input
            {...memberIdRegister}
            onChange={(e) => {
              memberIdRegister.onBlur(e); // react-hook-form에 값 전달
              trigger("memberId"); // 이 필드만 즉시 검증
            }}
            onBlur={handleIdBlur}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                         placeholder:text-gray-400"
            placeholder="아이디를 입력하세요"
          />
          {/* 에러 출력 */}
          {errors.memberId && (
            <p className="text-sm text-red-600 mt-1">
              {errors.memberId.message}
            </p>
          )}

          {/* 성공 메시지 (중복 아님) */}
          {!errors.memberId && idChecked === true && (
            <p className="text-sm text-green-600 mt-1">
              사용 가능한 아이디입니다.
            </p>
          )}
        </div>

        {/* 비밀번호 */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            비밀번호
          </label>
          <input
            type="password"
            {...register("memberPwd")}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                         placeholder:text-gray-400"
            placeholder="영문, 숫자, 특수문자 포함 8자 이상"
          />
          {errors.memberPwd && (
            <p className="text-sm text-red-600 mt-1">
              {errors.memberPwd.message}
            </p>
          )}
        </div>

        {/* 비밀번호 확인 */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            비밀번호 확인
          </label>
          <input
            type="password"
            {...register("confirmPwd")}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                         placeholder:text-gray-400"
            placeholder="비밀번호를 다시 입력하세요"
          />
          {errors.confirmPwd && (
            <p className="text-sm text-red-600 mt-1">
              {errors.confirmPwd.message}
            </p>
          )}
        </div>

        {/* 서버/네트워크 에러 (useSignUp 훅에서 온 에러) */}
        {globalError && (
          <p className="text-sm text-red-600 mt-1">{globalError}</p>
        )}

        <button
          type="submit"
          disabled={
            isLoading ||
            isSubmitting ||
            !isValid ||
            emailChecked !== true ||
            idChecked !== true
          }
          className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white
                       hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-default
                       transition-colors"
        >
          {isLoading || isSubmitting ? "회원가입 중..." : "회원가입"}
        </button>
      </form>
    </>
  );
}
