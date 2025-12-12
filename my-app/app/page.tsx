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
    <main className="max-w-2xl mx-auto mt-12 bg-white shadow-md p-10 rounded-2xl border border-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">
        백엔드 연결 테스트
      </h2>

      <p className="text-gray-700 text-lg">
        결과: <b>ping</b> ➡️ {data}
      </p>
    </main>
  );
}
