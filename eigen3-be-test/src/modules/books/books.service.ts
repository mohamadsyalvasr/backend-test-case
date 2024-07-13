import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateBookDto } from './dto/create-book.dto';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Book } from "./schemas/book.schema";

@Injectable()
export class BooksService {
  constructor(@InjectModel(Book.name) private bookModel: Model<Book>) {}

  async create(createBookDto: CreateBookDto) {
    try {
      const createdBook = new this.bookModel(createBookDto);
      return await createdBook.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(`Book with title '${createBookDto.title}' already exists`);
      }
      throw error;
    }
  }

  async findAll(): Promise<Book[]> {
    return this.bookModel.find({ stock: { $gt: 0 } }).exec();
  }

  async findOne(code: string): Promise<Book> {
    const book = await  this.bookModel.findOne({ code }).exec();
    if(!book){
      throw new NotFoundException(`Book with code '${code}' not found`);
    }

    return book
  }

  async update(code: string, updateBookDto: any): Promise<Book> {
    return this.bookModel.findOneAndUpdate({ code }, updateBookDto, { new: true });
  }

  async remove(code: string) {
    const result = await this.bookModel.deleteOne({ code }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Book with code '${code}' not found`);
    }
  }
}
