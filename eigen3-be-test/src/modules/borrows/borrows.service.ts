import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Member } from "../members/entities/member.entity";
import { Book } from "../books/entities/book.entity";
import { Borrow } from "./entities/borrow.entity";

@Injectable()
export class BorrowsService {
  constructor(
    @InjectModel(Borrow.name) private borrowModel: Model<Borrow>,
    @InjectModel(Member.name) private memberModel: Model<Member>,
    @InjectModel(Book.name) private bookModel: Model<Book>,
  ) {}

  async create(createBorrowDto: any): Promise<Borrow> {
    const { memberCode, bookCode } = createBorrowDto;
    let session = null;

    const member = await this.memberModel.findOne({ code: memberCode });
    if (!member) throw new BadRequestException('Invalid member code');

    const book = await this.bookModel.findOne({ code: bookCode });
    if (!book) throw new BadRequestException('Invalid book code');

    const existingBorrows = await this.borrowModel.find({ member: memberCode, returnedDate: null });
    if (existingBorrows.length >= 2) throw new BadRequestException('Member cannot borrow more than 2 books');

    if (book.stock <= 0) {
      throw new BadRequestException('Book already borrowed by another member');
    }

    const penalties = existingBorrows.filter(borrow =>
      (new Date().getTime() - borrow.borrowedDate.getTime()) > 7 * 24 * 60 * 60 * 1000);

    if (penalties.length > 0) {
      member.penaltyEndDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
      await member.save();
      throw new BadRequestException('Member is penalized');
    }

    if (member.penaltyEndDate && member.penaltyEndDate > new Date())
      throw new BadRequestException('Member is penalized');

    book.stock -= 1;
    await book.save();

    const borrowCode = `BOR-${Date.now()}-${Math.floor(Math.random() * 10)}`; // Generate random code
    return this.borrowModel.create({
      code: borrowCode,
      member: memberCode,
      book: bookCode,
      borrowedDate: new Date(),
    });
  }

  async returnBook(code: string): Promise<Borrow> {
    const borrow = await this.borrowModel.findOne({ code });
    if (!borrow) throw new BadRequestException('Invalid borrow ID');

    borrow.returnedDate = new Date();
    const borrowedDuration = (borrow.returnedDate.getTime() - borrow.borrowedDate.getTime()) / (24 * 60 * 60 * 1000);
    if (borrowedDuration > 7) {
      const member = await this.memberModel.findOne({code: borrow.member});
      member.penaltyEndDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
      await member.save();
    }

    return borrow.save();
  }

  async findAll(): Promise<Borrow[]> {
    return this.borrowModel.find();
  }
}
