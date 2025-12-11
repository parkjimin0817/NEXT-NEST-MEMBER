"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiClient } from "@/libs/apiClient";
import { PingPongResponse } from "@/libs/types";

export default function Home() {
  const [data, setData] = useState<string>("loading...");

  useEffect(() => {
    const fetchPing = async () => {
      try {
        const result = await apiClient<PingPongResponse>("/ping");
        console.log(result);

        if (result.success) {
          setData(result.data.message);
        } else {
          setData("요청-응답 실패");
        }
      } catch (e) {
        console.log(e);
        setData("error");
      }
    };

    fetchPing();
  }, []);

  return (
    <main className="max-w-xl mx-auto mt-12 bg-white shadow p-8 rounded-lg">
      <div className="mt-6 flex justify-end">
        <Link
          href="/board/post"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          게시글 작성하기
        </Link>
      </div>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        백엔드 연결 테스트
      </h2>
      <p className="text-gray-700">
        결과: <b>ping</b> ➡️ {data}
      </p>
    </main>
  );
}
