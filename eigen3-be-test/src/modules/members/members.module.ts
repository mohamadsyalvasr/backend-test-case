import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { Member, MemberSchema } from "./entities/member.entity";
import { Borrow, BorrowSchema } from "../borrows/entities/borrow.entity";

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
