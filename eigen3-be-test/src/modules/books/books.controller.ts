import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from "@nestjs/common";
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Book } from "./schemas/book.schema";

@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @ApiOperation({ summary: 'Create', description: 'Create a new book.' })
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    description: 'Create a new book',
    type: Book,
    example: {
      success: true,
      data: {
        "_id": "66924287f13369a72b31ac1d",
        "code": "JK-45",
        "__v": 0,
        "author": "J.K Rowling",
        "stock": 1,
        "title": "Harry Potter"
      },
      statusCode: HttpStatus.CREATED,
      executeTime: '8ms',
    },
  })
  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @ApiOperation({ summary: 'Get all books', description: 'Retrieve a list of all available books.' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'List of books',
    type: [Book],
    example: {
      success: true,
      data: [
        {
          "_id": "66924287f13369a72b31ac1d",
          "code": "JK-45",
          "__v": 0,
          "author": "J.K Rowling",
          "stock": 1,
          "title": "Harry Potter"
        }
      ],
      statusCode: 200,
      executeTime: '8ms',
    },
  })
  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  @ApiOperation({ summary: 'Get book details', description: 'Retrieve a details of book.' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Book details',
    type: Book,
    example: {
      success: true,
      data: {
        "_id": "66924287f13369a72b31ac1d",
        "code": "JK-45",
        "__v": 0,
        "author": "J.K Rowling",
        "stock": 1,
        "title": "Harry Potter"
      },
      statusCode: 200,
      executeTime: '8ms',
    },
  })
  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.booksService.findOne(code);
  }

  @ApiOperation({ summary: 'Update book details', description: 'Update a details of book.' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Update book details',
    type: Book,
    example: {
      success: true,
      data: {
        "_id": "66924287f13369a72b31ac1d",
        "code": "JK-45",
        "__v": 0,
        "author": "J.K Rowling",
        "stock": 1,
        "title": "Harry Potter II"
      },
      statusCode: 200,
      executeTime: '8ms',
    },
  })
  @Patch(':code')
  update(@Param('code') code: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(code, updateBookDto);
  }

  @ApiOperation({ summary: 'Delete book', description: 'Remove a book from database.' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Delete book',
    example: {
      success: true,
      statusCode: 200,
      executeTime: '8ms',
    },
  })
  @Delete(':code')
  remove(@Param('code') code: string) {
    return this.booksService.remove(code);
  }
}
