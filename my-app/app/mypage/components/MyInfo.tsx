"use client";

import { useEffect, useState } from "react";

interface MemberInfo {
  memberId: string;
  email: string;
  createdAt: string; // 가입날짜
}

export default function MyInfo() {
  const [info, setInfo] = useState<MemberInfo | null>(null);
  const [error, setError] = useState("");

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

  if (error) {
    return <div className="text-center text-red-500 font-medium">{error}</div>;
  }

  if (!info) {
    return <div className="text-center text-gray-500">로딩 중...</div>;
  }

  return (
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
    </div>
  );
}
