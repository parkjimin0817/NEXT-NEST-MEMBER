import { IsString } from 'class-validator';

export class BoardCreateDto {
  @IsString()
  boardTitle: string;
  @IsString()
  boardContent: string;
}
