import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member } from "../modules/members/schemas/member.schema";
import { Book } from "../modules/books/schemas/book.schema";

@Injectable()
export class MockDataService {
  constructor(
    @InjectModel(Member.name) private memberModel: Model<Member>,
    @InjectModel(Book.name) private bookModel: Model<Book>,
  ) {}

  async insertOrUpdateMembers(members: any[]) {
    const bulkOps = members.map(member => ({
      updateOne: {
        filter: { code: member.code },
        update: { $set: member },
        upsert: true, // Insert jika tidak ada, update jika sudah ada
      },
    }));
    await this.memberModel.bulkWrite(bulkOps);
  }

  async insertOrUpdateBooks(books: any[]) {
    const bulkOps = books.map(book => ({
      updateOne: {
        filter: { code: book.code },
        update: { $set: book },
        upsert: true,
      },
    }));
    await this.bookModel.bulkWrite(bulkOps);
  }

  async insertMockData() {
    const members = [
      { code: 'M001', name: 'Angga' },
      { code: 'M002', name: 'Ferry' },
      { code: 'M003', name: 'Putri' },
    ];

    const books = [
      { code: 'JK-45', title: 'Harry Potter', author: 'J.K Rowling', stock: 1 },
      { code: 'SHR-1', title: 'A Study in Scarlet', author: 'Arthur Conan Doyle', stock: 1 },
      { code: 'TW-11', title: 'Twilight', author: 'Stephenie Meyer', stock: 1 },
      { code: 'HOB-83', title: 'The Hobbit, or There and Back Again', author: 'J.R.R. Tolkien', stock: 1 },
      { code: 'NRN-7', title: 'The Lion, the Witch and the Wardrobe', author: 'C.S. Lewis', stock: 1 },
    ];

    await this.insertOrUpdateMembers(members);
    await this.insertOrUpdateBooks(books);
  }
}
