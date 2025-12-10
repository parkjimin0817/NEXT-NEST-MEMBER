// app/my/page.tsx
import MyInfo from "./components/MyInfo";

export default function MyPage() {
  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        내 정보
      </h1>
      <MyInfo />
    </div>
  );
}
