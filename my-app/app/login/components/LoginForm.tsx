"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const [memberId, setMemberId] = useState("");
  const [memberPwd, setMemberPwd] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!memberId || !memberPwd) {
      setError("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      setError("");

      const res = await fetch("http://localhost:4001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          memberId,
          password: memberPwd,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message ?? "로그인 실패");
        return;
      }

      const token: string | undefined = data.data?.accessToken;

      if (!token) {
        setError("토큰이 응답에 없습니다.");
        return;
      }

      console.log("token:", token);

      // ✅ 로컬스토리지에 저장
      localStorage.setItem("accessToken", token);

      // ✅ 로그인 성공 후 마이페이지로 이동
      router.push("/mypage");
    } catch (err) {
      console.error(err);
      setError("서버 오류가 발생했습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* 아이디 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          아이디
        </label>
        <input
          type="text"
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          placeholder="아이디를 입력하세요"
        />
      </div>

      {/* 비밀번호 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          비밀번호
        </label>
        <input
          type="password"
          value={memberPwd}
          onChange={(e) => setMemberPwd(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          placeholder="비밀번호를 입력하세요"
        />
      </div>

      {/* 에러 메시지 */}
      {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

      {/* 버튼 */}
      <button
        type="submit"
        className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:bg-gray-300"
        disabled={!memberId || !memberPwd}
      >
        로그인
      </button>
    </form>
  );
}
