import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { Member, MemberSchema } from "./schemas/member.schema";
import { Borrow, BorrowSchema } from "../borrows/schemas/borrow.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Member.name, schema: MemberSchema },
      { name: Borrow.name, schema: BorrowSchema },
    ])
  ],
  controllers: [MembersController],
  providers: [MembersService],
})
export class MembersModule {}
