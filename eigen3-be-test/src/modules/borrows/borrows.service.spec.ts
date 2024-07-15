import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import { BorrowsService } from './borrows.service';
import { Borrow } from './entities/borrow.entity';
import { Member } from '../members/entities/member.entity';
import { Book } from '../books/entities/book.entity';

const mockBorrowModel = {
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn()
};

const mockMemberModel = {
  findOne: jest.fn(),
  save: jest.fn(),
  exec: jest.fn()
};

const mockBookModel = {
  findOne: jest.fn(),
  save: jest.fn(),
  exec: jest.fn(),
  create: jest.fn()
};

describe('BorrowsService', () => {
  let service: BorrowsService;
  let borrowModel: Model<Borrow>;
  let memberModel: Model<Member>;
  let bookModel: Model<Book>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BorrowsService,
        { provide: getModelToken(Borrow.name), useValue: mockBorrowModel },
        { provide: getModelToken(Member.name), useValue: mockMemberModel },
        { provide: getModelToken(Book.name), useValue: mockBookModel },
      ],
    }).compile();

    service = module.get<BorrowsService>(BorrowsService);
    borrowModel = module.get<Model<Borrow>>(getModelToken(Borrow.name));
    memberModel = module.get<Model<Member>>(getModelToken(Member.name));
    bookModel = module.get<Model<Book>>(getModelToken(Book.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw error if member code is invalid', async () => {
      mockMemberModel.findOne.mockReturnValue(null);
      await expect(service.create({ memberCode: 'X001', bookCode: 'JK-45' })).rejects.toThrow(BadRequestException);
    });

    it('should throw error if book code is invalid', async () => {
      mockMemberModel.findOne.mockReturnValue({ code: 'M001' });
      mockBookModel.findOne.mockReturnValue(null);
      await expect(service.create({ memberCode: 'M001', bookCode: 'JK-450' })).rejects.toThrow(BadRequestException);
    });

    it('should throw error if member already borrowed 2 books', async () => {
      mockMemberModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ code: 'M001' }),
      });
      mockBookModel.findOne.mockReturnValue({ code: 'JK-45', stock: 1 });
      mockBorrowModel.find.mockReturnValue([{ returnedDate: null }, { returnedDate: null }]);
      await expect(service.create({ memberCode: 'M001', bookCode: 'JK-45' })).rejects.toThrow(BadRequestException);
    });

    it('should throw error if book is out of stock', async () => {
      mockMemberModel.findOne.mockReturnValue({ code: 'M001' });
      mockBookModel.findOne.mockReturnValue({ code: 'JK-45', stock: 0 });
      mockBorrowModel.find.mockReturnValue([]);
      await expect(service.create({ memberCode: 'M001', bookCode: 'JK-45' })).rejects.toThrow(BadRequestException);
    });

    it('should throw error if member has penalties', async () => {
      mockMemberModel.findOne.mockReturnValue({ code: 'M001', penaltyEndDate: null, save: jest.fn().mockResolvedValue({}) });
      mockBookModel.findOne.mockReturnValue({ code: 'JK-45', stock: 1, save: jest.fn().mockResolvedValue({}) });
      mockBorrowModel.find.mockReturnValue([{ borrowedDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) }]);

      await expect(service.create({ memberCode: 'M001', bookCode: 'JK-45' })).rejects.toThrow(BadRequestException);

      expect(mockMemberModel.findOne).toHaveBeenCalledWith({ code: 'M001' });
      expect(mockBookModel.findOne).toHaveBeenCalledWith({ code: 'JK-45' });
      expect(mockBorrowModel.find).toHaveBeenCalledWith({ member: 'M001', returnedDate: null });
    });

    it('should create a borrow if all conditions are met', async () => {
      const member = { code: 'M001', save: jest.fn() };
      const book = { code: 'JK-45', stock: 1, save: jest.fn() };
      const createdBorrow = { code: 'BOR-1720866798932-4', save: jest.fn() };

      mockMemberModel.findOne.mockReturnValue(member);
      mockBookModel.findOne.mockReturnValue(book);
      mockBorrowModel.find.mockReturnValue([]);
      mockBorrowModel.create.mockReturnValue(createdBorrow);

      await service.create({ memberCode: 'M001', bookCode: 'JK-45' });

      expect(book.stock).toBe(0);
      expect(book.save).toHaveBeenCalled();
      expect(mockBorrowModel.create).toHaveBeenCalledWith(expect.objectContaining({
        member: 'M001',
        book: 'JK-45'
      }));
    });

  });

  describe('returnBook', () => {
    it('should throw error if borrow ID is invalid', async () => {
      mockBorrowModel.findOne.mockReturnValue(null);
      await expect(service.returnBook('BOR-1720866798932-10')).rejects.toThrow(BadRequestException);
    });

    it('should set return date and apply penalty if returned late', async () => {
      const borrow = {
        code: 'BOR-1720866798932-4',
        borrowedDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        returnedDate: null,
        save: jest.fn()
      };
      const member = { code: 'M001', save: jest.fn() };

      mockBorrowModel.findOne.mockReturnValue(borrow);
      mockMemberModel.findOne.mockReturnValue(member);

      await service.returnBook('BOR-1720866798932-4');

      expect(borrow.returnedDate).toBeDefined();
      expect(borrow.save).toHaveBeenCalled();
      expect(member.save).toHaveBeenCalled();
    });

    it('should set return date without penalty if returned on time', async () => {
      const borrow = {
        code: 'BOR-1720866798932-4',
        borrowedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        returnedDate: null,
        save: jest.fn()
      };

      mockBorrowModel.findOne.mockReturnValue(borrow);

      await service.returnBook('BOR-1720866798932-4');

      expect(borrow.returnedDate).toBeDefined();
      expect(borrow.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all borrows', async () => {
      mockBorrowModel.find.mockReturnValue(['BOR-1720866798932-4']);
      const borrows = await service.findAll();
      expect(borrows).toEqual(['BOR-1720866798932-4']);
    });
  });
});
