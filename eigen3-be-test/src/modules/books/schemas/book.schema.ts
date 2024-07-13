import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from "@nestjs/swagger";

@Schema()
export class Book extends Document {
  @ApiProperty()
  @Prop({ unique: true, required: true })
  code: string;

  @ApiProperty()
  @Prop({ unique: true, required: true })
  title: string;

  @ApiProperty()
  @Prop({ required: true })
  author: string;

  @ApiProperty()
  @Prop({ default: 1 })
  stock: number;
}

export const BookSchema = SchemaFactory.createForClass(Book);
