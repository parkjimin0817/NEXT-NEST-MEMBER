"use client";

import { apiClient } from "@/libs/apiClient";
import { BoardItem, BoardListResponse } from "@/libs/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BoardList() {
  const router = useRouter();

  const [items, setItems] = useState<BoardItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  useEffect(() => {
    const fetchBoardList = async () => {
      try {
        const result = await apiClient<BoardListResponse>(
          `/board?page=${page}&size=${size}`,
          {
            method: "GET",
          }
        );

        if (!result.success) {
          alert("게시글을 불러오지 못했습니다.");
          return;
        }

        if (result.success) {
          setItems(result.data.items);
          setTotalPages(result.data.meta.totalPages);
        }
      } catch (e) {
        console.error("게시글 목록 조회 중 에러 발생 : ", e);
      }
    };
    fetchBoardList();
    //최초 1회 로딩 시 []비워둠
    //page, size 바뀔 때 다시 로딩
  }, [page, size]);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="w-full mx-auto px-2 py-10">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">게시판</h1>
          <p className="mt-2 text-sm text-gray-500">
            최신 게시글부터 정렬되어 있습니다.
          </p>
        </div>

        <button
          onClick={() => router.push("/board/post")}
          className="px-5 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition"
        >
          글쓰기
        </button>
      </div>

      {/* 테이블 컨테이너 */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 w-20">
                번호
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 w-80">
                제목
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 w-32">
                작성자
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 w-40">
                작성일
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-gray-400 text-sm"
                >
                  게시글이 없습니다.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr
                  key={item.boardNo}
                  className="hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => router.push(`/board/${item.boardNo}`)}
                >
                  <td className="px-6 py-4 text-gray-600 text-center">
                    {item.boardNo}
                  </td>

                  <td className="px-6 py-4 text-gray-900 font-medium">
                    {item.boardTitle}
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700">
                      {item.memberId}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {new Date(item.createdAt).toLocaleString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="mt-8 flex items-center justify-center gap-2">
        {/* 이전 */}
        <button
          className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-700 disabled:text-gray-300 disabled:border-gray-100 hover:bg-gray-50 transition"
          onClick={() => setPage((prev) => prev - 1)}
          disabled={page === 1}
        >
          이전
        </button>

        {/* 페이지 번호들 */}
        {pageNumbers.map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={[
              "min-w-[32px] px-3 py-1.5 text-sm rounded-lg border transition",
              p === page
                ? "bg-gray-900 text-white border-gray-900"
                : "border-gray-200 text-gray-700 hover:bg-gray-50",
            ].join(" ")}
          >
            {p}
          </button>
        ))}

        {/* 다음 */}
        <button
          className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-700 disabled:text-gray-300 disabled:border-gray-100 hover:bg-gray-50 transition"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page === totalPages}
        >
          다음
        </button>
      </div>
    </div>
  );
}
