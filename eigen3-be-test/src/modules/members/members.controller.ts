import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from "@nestjs/common";
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Member } from "./entities/member.entity";

@ApiTags('Members')
@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @ApiOperation({ summary: 'Create', description: 'Create a new member.' })
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    description: 'Create a new member',
    type: Member,
    example: {
      success: true,
      data: {
        "code": "M006",
        "name": "M Syalva S R",
        "penaltyEndDate": null,
        "_id": "669253de4d8c2a6e8ab2fb84",
        "__v": 0
      },
      statusCode: HttpStatus.CREATED,
      executeTime: '8ms',
    },
  })
  @Post()
  create(@Body() createMemberDto: CreateMemberDto) {
    return this.membersService.create(createMemberDto);
  }

  @ApiOperation({ summary: 'Get all members', description: 'Retrieve a list of all members.' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'List of members',
    type: [Member],
    example: {
      success: true,
      data: [
        {
          "_id": "66926432f13369a72b31cae6",
          "code": "M001",
          "__v": 0,
          "name": "Angga",
          "penaltyEndDate": null,
          "numberOfBorrowedBooks": 1
        },
      ],
      statusCode: 200,
      executeTime: '8ms',
    },
  })
  @Get()
  findAll() {
    return this.membersService.findAll();
  }

  @ApiOperation({ summary: 'Get member details', description: 'Retrieve a details of member.' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Member details',
    type: Member,
    example: {
      success: true,
      data: {
        "_id": "66924287f13369a72b31ac19",
        "code": "M001",
        "__v": 0,
        "name": "Angga",
        "penaltyEndDate": null
      },
      statusCode: 200,
      executeTime: '8ms',
    },
  })
  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.membersService.findOne(code);
  }

  @ApiOperation({ summary: 'Update member details', description: 'Update a member of book.' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Update member details',
    type: Member,
    example: {
      success: true,
      data: {
        "_id": "66924287f13369a72b31ac19",
        "code": "M001",
        "__v": 0,
        "name": "Angga",
        "penaltyEndDate": null
      },
      statusCode: 200,
      executeTime: '8ms',
    },
  })
  @Patch(':code')
  update(@Param('code') code: string, @Body() updateMemberDto: UpdateMemberDto) {
    return this.membersService.update(code, updateMemberDto);
  }

  @ApiOperation({ summary: 'Delete member', description: 'Remove a member from database.' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Delete member',
    example: {
      success: true,
      statusCode: 200,
      executeTime: '8ms',
    },
  })
  @Delete(':code')
  remove(@Param('code') code: string) {
    return this.membersService.remove(code);
  }
}
