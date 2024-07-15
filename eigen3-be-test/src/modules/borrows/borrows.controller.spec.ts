import { Test, TestingModule } from '@nestjs/testing';
import { BorrowsController } from './borrows.controller';
import { BorrowsService } from './borrows.service';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { UpdateBorrowDto } from './dto/update-borrow.dto';

describe('BorrowsController', () => {
  let controller: BorrowsController;
  let service: BorrowsService;

  const mockBorrowsService = {
    create: jest.fn(dto => {
      return {
        _id: 'someId',
        code: 'BOR-1720866798932-4',
        member: 'M001',
        book: 'JK-45',
        borrowedDate: new Date().toISOString(),
        __v: 0,
      };
    }),
    findAll: jest.fn(() => [
      {
        _id: 'someId',
        code: 'BOR-1720866798932-4',
        member: 'M001',
        book: 'JK-45',
        borrowedDate: '2024-07-13T10:33:18.932Z',
        __v: 0,
      },
    ]),
    returnBook: jest.fn(code => ({
      code,
      returnedDate: new Date().toISOString(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BorrowsController],
      providers: [
        {
          provide: BorrowsService,
          useValue: mockBorrowsService,
        },
      ],
    }).compile();

    controller = module.get<BorrowsController>(BorrowsController);
    service = module.get<BorrowsService>(BorrowsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a borrow', async () => {
    const dto: CreateBorrowDto = {
      memberCode: 'M001',
      bookCode: 'JK-45',
    };
    expect(await controller.create(dto)).toEqual({
      _id: 'someId',
      code: expect.any(String),
      member: 'M001',
      book: 'JK-45',
      borrowedDate: expect.any(String),
      __v: 0,
    });
    expect(mockBorrowsService.create).toHaveBeenCalledWith(dto);
  });

  it('should return all borrows', async () => {
    expect(await controller.findAll()).toEqual([
      {
        _id: 'someId',
        code: 'BOR-1720866798932-4',
        member: 'M001',
        book: 'JK-45',
        borrowedDate: '2024-07-13T10:33:18.932Z',
        __v: 0,
      },
    ]);
    expect(mockBorrowsService.findAll).toHaveBeenCalled();
  });

  it('should return a book', async () => {
    const code = 'BOR-1720866798932-4';
    expect(await controller.returnBook(code)).toEqual({
      code,
      returnedDate: expect.any(String),
    });
    expect(mockBorrowsService.returnBook).toHaveBeenCalledWith(code);
  });
});
