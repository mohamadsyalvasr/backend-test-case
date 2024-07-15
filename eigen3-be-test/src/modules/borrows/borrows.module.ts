import { Module } from '@nestjs/common';
import { BorrowsService } from './borrows.service';
import { BorrowsController } from './borrows.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { Borrow, BorrowSchema } from "./entities/borrow.entity";
import { Member, MemberSchema } from "../members/entities/member.entity";
import { Book, BookSchema } from "../books/entities/book.entity";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Borrow.name, schema: BorrowSchema }]),
    MongooseModule.forFeature([{ name: Member.name, schema: MemberSchema }]),
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }])
  ],
  controllers: [BorrowsController],
  providers: [BorrowsService],
})
export class BorrowsModule {}
