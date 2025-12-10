"use client";

import { apiClient } from "@/libs/apiClient";
import { useEffect, useState } from "react";
import PasswordConfirmModal from "@/components/common/PasswordConfirmModal";

interface MemberInfo {
  memberId: string;
  email: string;
  createdAt: string; // 가입날짜
}

export default function MyInfo() {
  const [info, setInfo] = useState<MemberInfo | null>(null);
  const [error, setError] = useState("");

  const [isPwdModalOpen, setIsPwdModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      //setError("로그인이 필요합니다.");
      return;
    }

    const fetchInfo = async () => {
      try {
        const res = await fetch("http://localhost:4001/member/mypage", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          setError("정보를 불러올 수 없습니다.");
          return;
        }

        setInfo(data.data);
      } catch (err) {
        console.error(err);
        setError("서버 오류가 발생했습니다.");
      }
    };

    fetchInfo();
  }, []);

  const handleConfirmDelete = async (password: string) => {
    const ok = window.confirm(
      "정말 탈퇴하시겠습니까?\n탈퇴 후에는 계정을 복구할 수 없습니다."
    );

    if (!ok) return;

    const token = localStorage.getItem("accessToken");

    await apiClient("/member/delete", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ memberPwd: password }),
    });

    localStorage.removeItem("accessToken");
    alert("탈퇴가 완료되었습니다.");
    window.location.href = "/";
  };

  if (error) {
    return <div className="text-center text-red-500 font-medium">{error}</div>;
  }

  if (!info) {
    return <div className="text-center text-gray-500">로딩 중...</div>;
  }

  return (
    <>
      <div className="space-y-4">
        {/* 아이디 */}
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-600">아이디</span>
          <span className="font-medium">{info.memberId}</span>
        </div>

        {/* 이메일 */}
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-600">이메일</span>
          <span className="font-medium">{info.email}</span>
        </div>

        {/* 가입 날짜 */}
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-600">가입 날짜</span>
          <span className="font-medium">
            {new Date(info.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* 탈퇴하기 링크 → 모달 오픈 */}
        <div className="pt-4 text-right">
          <button
            type="button"
            onClick={() => setIsPwdModalOpen(true)}
            className="text-sm text-gray-500 hover:text-red-600 underline underline-offset-2 cursor-pointer"
          >
            탈퇴하기
          </button>
        </div>
      </div>

      {/* ✅ 비밀번호 확인 모달 */}
      <PasswordConfirmModal
        isOpen={isPwdModalOpen}
        onClose={() => setIsPwdModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="계정 탈퇴"
        description="탈퇴를 진행하려면 비밀번호를 입력해주세요."
        confirmText="탈퇴하기"
      />
    </>
  );
}
