export function getMemberNoFromToken(): number | null {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return Number(payload.sub); //memberNo
  } catch (e) {
    console.error("토큰에서 정보 꺼내는 중 오류 발생", e);
    return null;
  }
}
