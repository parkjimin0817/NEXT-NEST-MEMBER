"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [data, setData] = useState<string>("loading...");

  useEffect(() => {
    fetch("http://localhost:4001/ping")
      .then((res) => res.json())
      .then((result) => setData(result.message))
      .catch((err) => setData("error: " + err));
  }, []);

  return (
    <div>
      <h1>백엔드 연결 테스트</h1>
      <p>결과: {data}</p>
    </div>
  );
}
