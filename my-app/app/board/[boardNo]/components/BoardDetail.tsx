// app/board/[boardNo]/BoardDetail.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/libs/apiClient";
import { BoardDeleteResponse, BoardDetailResponse } from "@/libs/types";
import { getMemberNoFromToken } from "@/libs/auth";

interface BoardDetailData {
  boardNo: number;
  boardTitle: string;
  boardContent: string;
  memberId: string;
  memberNo: number;
  createdAt: string;
}

interface BoardDetailProps {
  boardNo: number;
}

export default function BoardDetail({ boardNo }: BoardDetailProps) {
  const router = useRouter();

  const [detail, setDetail] = useState<BoardDetailData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMine, setIsMine] = useState(false);

  useEffect(() => {
    const fetchBoardDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem("accessToken");
        const param = Number(boardNo);

        const loginMemberNo = getMemberNoFromToken();

        const result = await apiClient<BoardDetailResponse>(`/board/${param}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!result.success || !result.data) {
          setError("게시글을 불러오지 못했습니다.");
          return;
        }

        if (result.success) {
          setDetail(result.data);
          if (result.data.memberNo == loginMemberNo) {
            setIsMine(true);
          }
        }
      } catch (e) {
        console.error("게시글 조회 중 에러 발생 : ", e);
        setError("게시글 조회 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBoardDetail();
  }, [boardNo]);

  if (isLoading) {
    return <p className="text-gray-500 text-sm">불러오는 중...</p>;
  }

  if (error) {
    return (
      <div className="text-sm text-red-500">
        <p>{error}</p>
        <button
          type="button"
          onClick={() => router.push("/board/list")}
          className="mt-3 underline text-blue-600"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="text-sm text-gray-500">
        게시글을 찾을 수 없습니다.
        <button
          type="button"
          onClick={() => router.push("/board/list")}
          className="mt-3 underline text-blue-600"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  const createdAtText = new Date(detail.createdAt).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleEdit = () => {
    
  };

  const handleDelete = async () => {
    if (!confirm("게시글을 삭제하시겠습니까?")) return;

    try {
      const token = localStorage.getItem("accessToken");
      const param = Number(boardNo);

      const result = await apiClient<BoardDeleteResponse>(`/board/${param}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (result.success) {
        alert("삭제되었습니다.");
        router.push("/board/list");
      } else {
        alert("삭제에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (e) {
      console.error("게시글 삭제 중 에러 발생 :", e);
    }
  };

  return (
    <section>
      <header className="relative mb-4 border-b pb-3">
        <h2 className="text-xl font-semibold mb-1">{detail.boardTitle}</h2>

        <div className="flex justify-between text-xs text-gray-500">
          <span>작성일: {createdAtText}</span>
          <span>작성자: {detail.memberId ? detail.memberId : '탈퇴회원'}</span>
        </div>

        {isMine && (
          <div className="absolute top-0 right-0 space-x-2">
            <button
              onClick={handleEdit}
              className="border border-gray-300 text-xs px-2 py-0.5 rounded text-gray-600 hover:bg-gray-100"
            >
              수정
            </button>
            <button
              onClick={handleDelete}
              className="border border-gray-300 text-xs px-2 py-0.5 rounded text-gray-500 hover:bg-red-50"
            >
              삭제
            </button>
          </div>
        )}
      </header>

      <article className="whitespace-pre-wrap leading-relaxed text-sm ">
        {detail.boardContent}
      </article>

      <div className="mt-6 flex justify-end text-sm border-t border-gray-300 pt-3">
        <button
          type="button"
          onClick={() => router.push("/board/list")}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-200 transition"
        >
          ← 목록으로
        </button>
      </div>
    </section>
  );
}
