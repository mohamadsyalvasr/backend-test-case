import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from "@nestjs/common";
import { BorrowsService } from './borrows.service';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { UpdateBorrowDto } from './dto/update-borrow.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Member } from "../members/schemas/member.schema";

@ApiTags('Borrows')
@Controller('borrows')
export class BorrowsController {
  constructor(private readonly borrowsService: BorrowsService) {}

  @ApiOperation({ summary: 'Create', description: 'Create a new borrow data.' })
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    description: 'Create a new borrow book data',
    type: Member,
    example: {
      success: true,
      data: {
        "code": "BOR-1720866798932-4",
        "member": "M001",
        "book": "JK-45",
        "borrowedDate": "2024-07-13T10:33:18.932Z",
        "_id": "669257ee65a20c0e5ba91f0d",
        "__v": 0
      },
      statusCode: HttpStatus.CREATED,
      executeTime: '8ms',
    },
  })
  @Post()
  async create(@Body() createBorrowDto: CreateBorrowDto){
    return this.borrowsService.create(createBorrowDto);
  }

  @Patch(':code/return')
  async returnBook(@Param('code') code: string) {
    return this.borrowsService.returnBook(code);
  }

  @ApiOperation({ summary: 'Get all borrows data', description: 'Retrieve a list of all data.' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'List of data',
    type: [Member],
    example: {
      success: true,
      data: [
        {
          "_id": "669257ee65a20c0e5ba91f0d",
          "code": "BOR-1720866798932-4",
          "member": "M001",
          "book": "JK-45",
          "borrowedDate": "2024-07-13T10:33:18.932Z",
          "__v": 0
        }
      ],
      statusCode: 200,
      executeTime: '8ms',
    },
  })
  @Get()
  async findAll() {
    return this.borrowsService.findAll();
  }
}
