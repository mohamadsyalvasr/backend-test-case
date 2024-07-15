import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;

  const mockBooksService = {
    create: jest.fn(dto => {
      return {
        _id: 'someId',
        ...dto,
      };
    }),
    findAll: jest.fn(() => [
      {
        _id: 'someId',
        code: 'JK-45',
        author: 'J.K Rowling',
        stock: 1,
        title: 'Harry Potter',
      },
    ]),
    findOne: jest.fn(code => ({
      _id: 'someId',
      code: 'JK-45',
      author: 'J.K Rowling',
      stock: 1,
      title: 'Harry Potter',
    })),
    update: jest.fn((code, dto) => ({
      _id: 'someId',
      code: code,
      ...dto,
    })),
    remove: jest.fn(code => ({
      deleted: true,
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a book', async () => {
    const dto: CreateBookDto = {
      title: 'Harry Potter',
      code: 'JK-45',
      author: 'J.K Rowling',
      stock: 1,
    };
    expect(await controller.create(dto)).toEqual({
      _id: 'someId',
      ...dto,
    });
    expect(mockBooksService.create).toHaveBeenCalledWith(dto);
  });

  it('should return an array of books', async () => {
    expect(await controller.findAll()).toEqual([
      {
        _id: 'someId',
        code: 'JK-45',
        author: 'J.K Rowling',
        stock: 1,
        title: 'Harry Potter',
      },
    ]);
    expect(mockBooksService.findAll).toHaveBeenCalled();
  });

  it('should return a single book', async () => {
    const code = 'JK-45';
    expect(await controller.findOne(code)).toEqual({
      _id: 'someId',
      code: 'JK-45',
      author: 'J.K Rowling',
      stock: 1,
      title: 'Harry Potter',
    });
    expect(mockBooksService.findOne).toHaveBeenCalledWith(code);
  });

  it('should update a book', async () => {
    const code = 'JK-45';
    const dto: UpdateBookDto = {
      title: 'Harry Potter II',
      stock: 1,
    };
    expect(await controller.update(code, dto)).toEqual({
      _id: 'someId',
      code: 'JK-45',
      ...dto,
    });
    expect(mockBooksService.update).toHaveBeenCalledWith(code, dto);
  });

  it('should delete a book', async () => {
    const code = 'JK-45';
    expect(await controller.remove(code)).toEqual({
      deleted: true,
    });
    expect(mockBooksService.remove).toHaveBeenCalledWith(code);
  });
});
