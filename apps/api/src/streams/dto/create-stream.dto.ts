import { IsIn, IsOptional, IsString, Length } from 'class-validator';

export class CreateStreamDto {
  @IsString()
  @Length(1, 140)
  title!: string;

  @IsOptional()
  @IsString()
  @Length(0, 2000)
  description?: string;

  @IsOptional()
  @IsIn(['independencia-economica', 'justicia-social', 'soberania-politica'])
  categoria?: string;
}
