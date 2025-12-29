export class BoardDetailDto {
  boardNo: number;
  boardTitle: string;
  boardContent: string;
  createdAt: Date;

  memberNo: number | null;
  memberId: string | null;
}
