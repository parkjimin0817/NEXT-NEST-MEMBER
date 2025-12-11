"use client";

import { useState } from "react";
import ModalBase from "./ModalBase";
import { apiClient } from "@/libs/apiClient";
import { CheckPwdResponse } from "@/libs/types";

interface PasswordConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => Promise<void>; // 비밀번호 확인 후 처리할 함수
  title?: string;
  description?: string;
  confirmText?: string;
}

export default function PasswordConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "비밀번호 확인",
  description = "비밀번호를 입력해주세요.",
  confirmText = "확인",
}: PasswordConfirmModalProps) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!password) {
      setError("비밀번호를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("accessToken");

      const result = await apiClient<CheckPwdResponse>("/member/checkPwd", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ memberPwd: password }),
      });

      // HTTP 200 + success: true 인데 비번만 틀린 경우
      if (!result.data.isMatched) {
        setError(result.data.message);
        return;
      }

      await onConfirm(password); //부모의 함수 호출
      resetState();
      onClose();
    } catch (err: any) {
      setError(err.message || "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setPassword("");
    setError("");
    setLoading(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>

        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded text-sm"
        />

        {error && <div className="text-sm text-red-500">{error}</div>}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="px-3 py-1.5 text-sm rounded border border-gray-300 hover:bg-gray-100"
          >
            취소
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-3 py-1.5 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "확인 중..." : confirmText}
          </button>
        </div>
      </div>
    </ModalBase>
  );
}
