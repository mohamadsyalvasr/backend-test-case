import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from "@nestjs/swagger";

@Schema()
export class Borrow extends Document {
  @ApiProperty()
  @Prop({ unique: true, required: true })
  code: string

  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'Member', required: true, index: false })
  member: Types.ObjectId;

  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'Book', required: true, index: false })
  book: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  borrowedDate: Date;

  @ApiProperty()
  @Prop()
  returnedDate?: Date;
}

export const BorrowSchema = SchemaFactory.createForClass(Borrow);
