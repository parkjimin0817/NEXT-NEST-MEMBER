"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const token = window.localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    window.localStorage.removeItem("accessToken");
    alert("로그아웃 되었습니다.");
    window.location.href = "/";
  };

  if (isLoggedIn === null) {
    // 처음에는 아무것도 안 보이게
    return null;
  }

  return (
    <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
      <Link href="/">
        <h1 className="text-xl font-semibold text-gray-800">My App</h1>
      </Link>

      <div className="space-x-6">
        {!isLoggedIn ? (
          <>
            <Link
              href="/signup"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              회원가입
            </Link>
            <Link
              href="/login"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              로그인
            </Link>
          </>
        ) : (
          <>
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-red-600 font-medium"
            >
              로그아웃
            </button>
            <Link
              href="/mypage"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              마이페이지
            </Link>
            <Link
              href="/board/list"
              className="text-gray-700 hover:text-green-600 font-medium"
            >
              게시판
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
