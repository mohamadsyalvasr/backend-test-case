import {
  IsNotEmpty,
  MinLength,
  IsString, IsNumber
} from "class-validator";
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateBorrowDto {
  // Member Code
  @ApiProperty({
    example: 'M001',
    description: 'Member Code',
    format: 'string'
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  memberCode: string;

  // Member Code
  @ApiProperty({
    example: 'JK-45',
    description: 'Book Code',
    format: 'string'
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  bookCode: string;
}
