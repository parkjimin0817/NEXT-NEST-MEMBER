import SignUpForm from "./components/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="w-full max-w-md mx-auto mt-12 bg-white shadow p-8 rounded-lg">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-left">
        회원가입
      </h1>
      <SignUpForm />
    </div>
  );
}
