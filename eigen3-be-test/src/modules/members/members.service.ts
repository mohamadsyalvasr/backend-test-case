import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Member } from "./entities/member.entity";
import { Borrow } from "../borrows/entities/borrow.entity";

export interface MemberWithBorrowCount extends Member {
  numberOfBorrowedBooks: number;
}

@Injectable()
export class MembersService {
  constructor(
    @InjectModel(Member.name) private memberModel: Model<Member>,
    @InjectModel(Borrow.name) private borrowModel: Model<Borrow>,
  ) {}

  async create(createMemberDto: any) {
    const lastMember = await this.memberModel.findOne().sort({code: -1});
    let nextCode = 'M001';

    if (lastMember && lastMember.code) {
      const lastCode = parseInt(lastMember.code.slice(1), 10);
      nextCode= `M${(lastCode + 1).toString().padStart(3, '0')}`;
    }

    createMemberDto.code = nextCode;

    return this.memberModel.create(createMemberDto);
  }

  async findAll() {
    return this.memberModel.aggregate([
      {
        $lookup: {
          from: 'borrows',
          localField: 'code',
          foreignField: 'member',
          as: 'borrows',
        },
      },
      {
        $addFields: {
          numberOfBorrowedBooks: { $size: '$borrows' },
        },
      },
      {
        $project: {
          borrows: 0,
        },
      },
    ]);
  }

  async findOne(code: string) {
    const member = await this.memberModel.findOne({ code }).lean().exec();
    if (!member) {
      throw new NotFoundException(`Member with code '${code}' not found`);
    }

    const borrowedBooksCount = await this.borrowModel.countDocuments({ member: member.code, returnedDate: null });
    return {
      ...member,
      numberOfBorrowedBooks: borrowedBooksCount,
    };
  }

  async update(code: string, updateMemberDto: any) {
    const existingMember = await this.memberModel.findOne({ code });
    if (!existingMember) {
      throw new NotFoundException(`Member with code '${code}' not found`);
    }
    existingMember.name = updateMemberDto.name;

    return existingMember.save();
  }

  async remove(code: string) {
    const result = await this.memberModel.deleteOne({ code });
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Member with code '${code}' not found`);
    }
  }
}
