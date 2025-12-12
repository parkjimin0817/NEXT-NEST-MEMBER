import LoginForm from "./components/LoginForm";

export default function LoginPage() {
  return (
    <div className="w-full max-w-md mx-auto mt-20 px-4 bg-white rounded-xl shadow-md p-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        로그인
      </h1>
      <LoginForm />
    </div>
  );
}
