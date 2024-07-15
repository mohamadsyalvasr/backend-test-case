import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { getModelToken } from "@nestjs/mongoose";
import { ConflictException, NotFoundException } from "@nestjs/common";
import { CreateBookDto } from "./dto/create-book.dto";
import { Book } from "./entities/book.entity";

describe('BooksService', () => {
  let service: BooksService;
  let mockBookModel: any;

  beforeEach(async () => {
    mockBookModel = {
      create: jest.fn().mockResolvedValue({}),
      find: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      }),
      findOne: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      }),
      findOneAndUpdate: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({}),
      }),
      deleteOne: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getModelToken(Book.name),
          useValue: mockBookModel,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a book', async () => {
      const createBookDto: CreateBookDto = {
        title: 'Harry Potter',
        code: 'JK-45',
        author: 'J.K Rowling',
        stock: 1,
      };
      mockBookModel.create.mockResolvedValue(createBookDto);
      expect(await service.create(createBookDto)).toEqual(createBookDto);
    });

    it('should throw a ConflictException if book already exists', async () => {
      const createBookDto: CreateBookDto = {
        title: 'Harry Potter',
        code: 'JK-45',
        author: 'J.K Rowling',
        stock: 1
      };
      mockBookModel.create.mockRejectedValue({ code: 11000 });
      await expect(service.create(createBookDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      const result = [{
        title: 'Harry Potter',
        code: 'JK-45',
        author: 'J.K Rowling',
        stock: 1
      }];
      mockBookModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(result),
      });
      expect(await service.findAll()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should find and return a book', async () => {
      const code = 'JK-45';
      const result = { title: 'Harry Potter',
        code: 'JK-45',
        author: 'J.K Rowling',
        stock: 1 };
      mockBookModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(result),
      });
      expect(await service.findOne(code)).toEqual(result);
    });

    it('should throw a NotFoundException if book not found', async () => {
      const code = 'JK-45';
      mockBookModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(service.findOne(code)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the book', async () => {
      const code = 'JK-45';
      const updateBookDto = { title: 'Harry Potter II' };
      const result = { title: 'Harry Potter II', code, stock: 1 };
      mockBookModel.findOneAndUpdate.mockResolvedValue(result);
      expect(await service.update(code, updateBookDto)).toEqual(result);
    });
  });

  describe('remove', () => {
    it('should delete the book', async () => {
      const code = 'JK-45';
      mockBookModel.deleteOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      });
      await expect(service.remove(code)).resolves.not.toThrow();
    });

    it('should throw a NotFoundException if book not found', async () => {
      const code = 'JK-45';
      mockBookModel.deleteOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 0 }),
      });
      await expect(service.remove(code)).rejects.toThrow(NotFoundException);
    });
  });
});
