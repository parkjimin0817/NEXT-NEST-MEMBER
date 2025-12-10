import SignUpForm from "./components/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-left">
        회원가입
      </h1>
      <SignUpForm />
    </div>
  );
}
