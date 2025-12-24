"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp && payload.exp < now;
  } catch {
    return true;
  }
}

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = window.localStorage.getItem("accessToken");
    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    if (isTokenExpired(token)) {
      alert("다시 로그인 후 이용해주세요.");
      window.localStorage.removeItem("accessToken");
      setIsLoggedIn(false);
      window.location.href = "/login";
      return;
    }

    setIsLoggedIn(true);
  }, []);

  // 초기 로딩에서 SSR과 클라이언트가 불일치하지 않도록
  if (isLoggedIn === null) {
    return null; // 아무것도 안 그리다가, 클라이언트에서만 UI 그림
  }

  const handleLogout = () => {
    window.localStorage.removeItem("accessToken");
    alert("로그아웃 되었습니다.");
    window.location.href = "/";
  };

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
