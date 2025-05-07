import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @IsNotEmpty()
  postId: number;

  @IsString()
  @IsOptional()
  authorName?: string;

  @IsEmail()
  @IsOptional()
  authorEmail?: string;
}

export class UpdateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}