import {
  IsNotEmpty,
  MinLength,
  IsString,
} from 'class-validator';
import { ApiHideProperty, ApiProperty, PartialType } from "@nestjs/swagger";

export class CreateMemberDto {
  // Code
  code: string;

  // Name
  @ApiProperty({
    example: 'M Syalva S R',
    description: 'Name',
    format: 'string'
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  name: string;
}
