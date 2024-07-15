import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from "@nestjs/swagger";

@Schema()
export class Member extends Document {

  @ApiProperty()
  @Prop({ unique: true, required: true })
  code: string;

  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @Prop({ default: null })
  penaltyEndDate: Date;
}

export const MemberSchema = SchemaFactory.createForClass(Member);
