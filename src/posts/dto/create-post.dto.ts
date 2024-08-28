import {
  IsString,
  IsUrl,
  IsNotEmpty,
  IsBoolean,
  IsInt,
  IsOptional,
  IsArray,
} from 'class-validator';

export class CreateRelatedPostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsUrl()
  @IsNotEmpty()
  imageUrl: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @IsInt()
  @IsOptional()
  totalVisits?: number;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  tags?: string[];
}
