import PostForm from "./components/PostForm";

export default function PostCreatePage() {
  return (
    <main className="max-w-2xl mx-auto mt-12 bg-white shadow p-8 rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">게시글 작성</h1>
      <PostForm />
    </main>
  );
}
