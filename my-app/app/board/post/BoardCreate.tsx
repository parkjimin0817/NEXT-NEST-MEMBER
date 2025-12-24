"use client";

import { apiClient } from "@/libs/apiClient";
import { CreateBoardResponse } from "@/libs/types";
import { useRouter } from "next/navigation";
import BoardForm from "../components/BoardForm";

interface BoardFormValues {
  title: string;
  content: string;
}
export default function BoardCreate() {
  const router = useRouter();

  const handleSubmit = async (values: BoardFormValues) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("로그인 후 이용해주세요.");
        router.push("/login");
        return;
      }

      const result = await apiClient<CreateBoardResponse>("/board", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          boardTitle: values.title,
          boardContent: values.content,
        }),
      });

      if (result.success && result.data) {
        router.push(`/board/${result.data.boardNo}`);
      } else {
        alert("게시글 등록에 실패했습니다.");
      }
    } catch (e) {
      console.error("게시글 등록 중 오류:", e);
      alert("게시글 등록 중 오류가 발생했습니다.");
    }
  };

  return <BoardForm mode="c" onSubmit={handleSubmit} />;
}
