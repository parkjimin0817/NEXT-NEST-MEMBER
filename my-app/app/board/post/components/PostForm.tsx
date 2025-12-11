"use client";

import { apiClient } from "@/libs/apiClient";
import { CreateBoardResponse } from "@/libs/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PostForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (!title || title.trim() === "") {
      alert("제목을 입력하세요.");
      return;
    }

    if (!content || content.trim() === "") {
      alert("내용을 입력하세요.");
      return;
    }

    const token = localStorage.getItem("accessToken");

    try {
      const result = await apiClient<CreateBoardResponse>("/board", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ boardTitle: title, boardContent: content }),
      });

      if (!result.success) {
        alert("게시글 등록이 되지 않았습니다. 다시 시도해주세요.");
        return;
      }

      if (result.success) {
        const url = `/board/${result.data.boardNo}`;
        router.push(url);
      }
    } catch (error) {
      console.error("네트워크 오류 메세지 : ", error);
      alert("네트워크 오류가 발생했습니다.");
    }
  };

  return (
    <div className="space-y-6">
      {/* 제목 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          제목
        </label>
        <input
          type="text"
          className="w-full border rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* 내용 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          내용
        </label>
        <textarea
          className="w-full border rounded-md px-3 py-2 h-40 resize-none text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {/* 버튼 */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm"
          onClick={handleSubmit}
        >
          등록하기
        </button>
      </div>
    </div>
  );
}
