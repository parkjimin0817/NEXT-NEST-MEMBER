"use client";

import { apiClient } from "@/libs/apiClient";
import { CreateBoardResponse } from "@/libs/types";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface BoardFormValues {
  title: string;
  content: string;
}

interface BoardFormProps {
  mode: "c" | "e";
  initialValues?: BoardFormValues;
  onSubmit: (values: BoardFormValues) => Promise<void> | void;
}

export default function BoardForm({
  mode,
  initialValues,
  onSubmit,
}: BoardFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await onSubmit({ title, content });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm mb-1">제목</label>
        <input
          className="w-full border rounded px-2 py-1 text-sm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm mb-1">내용</label>
        <textarea
          className="w-full border rounded px-2 py-1 text-sm min-h-[160px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className="flex justify-end space-x-2 text-sm">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-60"
        >
          {mode === "c" ? "등록" : "수정 완료"}
        </button>
      </div>
    </form>
  );
}
