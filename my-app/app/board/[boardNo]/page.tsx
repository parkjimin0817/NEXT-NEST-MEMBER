import BoardDetail from "./components/BoardDetail";

interface BoardDetailParams {
  boardNo: string;
}

interface BoardDetailPageProps {
  params: Promise<BoardDetailParams>;
}

export default async function BoardDetailPage({
  params,
}: BoardDetailPageProps) {
  const resolved = await params;
  const boardNo = Number(resolved.boardNo);

  return (
    <div className="w-full max-w-xl mx-auto mt-12 bg-white shadow p-8 rounded-lg">
      <BoardDetail boardNo={boardNo} />
    </div>
  );
}
