import {
  IsNotEmpty,
  MinLength,
  IsString, IsNumber
} from "class-validator";
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateBookDto {
  // Code
  @ApiProperty({
    example: 'JK-45',
    description: 'Code',
    format: 'string'
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  code: string;

  // Book Name
  @ApiProperty({
    example: 'Harry Potter',
    description: 'Book Title',
    format: 'string'
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  title: string;

  // Author Name
  @ApiProperty({
    example: 'J.K Rowling',
    description: 'Author Name',
    format: 'string'
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  author: string;

  // Book Stock
  @ApiProperty({
    example: '1',
    description: 'Book Stock',
    format: 'number'
  })
  @IsNotEmpty()
  @IsString()
  @IsNumber()
  stock: number;
}
