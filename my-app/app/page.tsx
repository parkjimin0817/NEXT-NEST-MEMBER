"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [data, setData] = useState<string>("loading...");

  useEffect(() => {
    fetch("http://localhost:4001/ping")
      .then((res) => res.json())
      .then((result) => setData(result.message))
      .catch((err) => setData("error: " + err));
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
      <p className="text-gray-700">결과: {data}</p>
    </main>
  );
}
