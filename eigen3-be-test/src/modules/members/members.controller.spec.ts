import { Test, TestingModule } from '@nestjs/testing';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from './entities/member.entity';

describe('MembersController', () => {
  let controller: MembersController;
  let service: MembersService;

  const mockMembersService = {
    create: jest.fn((dto: CreateMemberDto) => {
      return {
        _id: '669253de4d8c2a6e8ab2fb84',
        ...dto,
        __v: 0
      };
    }),
    findAll: jest.fn(() => [
      {
        _id: '66926432f13369a72b31cae6',
        code: 'M001',
        name: 'Angga',
        penaltyEndDate: null,
        numberOfBorrowedBooks: 1,
        __v: 0
      },
    ]),
    findOne: jest.fn((code: string) => {
      return {
        _id: '66924287f13369a72b31ac19',
        code: 'M001',
        name: 'Angga',
        penaltyEndDate: null,
        __v: 0
      };
    }),
    update: jest.fn((code: string, dto: UpdateMemberDto) => {
      return {
        _id: '66924287f13369a72b31ac19',
        code: 'M001',
        ...dto,
        __v: 0
      };
    }),
    remove: jest.fn((code: string) => {
      return { deleted: true };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembersController],
      providers: [
        {
          provide: MembersService,
          useValue: mockMembersService,
        },
      ],
    }).compile();

    controller = module.get<MembersController>(MembersController);
    service = module.get<MembersService>(MembersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new member', async () => {
      const dto: CreateMemberDto = { code: 'M006', name: 'M Syalva S R', penaltyEndDate: null };
      expect(await controller.create(dto)).toEqual({
        _id: '669253de4d8c2a6e8ab2fb84',
        ...dto,
        __v: 0,
      });
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of members', async () => {
      expect(await controller.findAll()).toEqual([
        {
          _id: '66926432f13369a72b31cae6',
          code: 'M001',
          name: 'Angga',
          penaltyEndDate: null,
          numberOfBorrowedBooks: 1,
          __v: 0,
        },
      ]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single member', async () => {
      const code = 'M001';
      expect(await controller.findOne(code)).toEqual({
        _id: '66924287f13369a72b31ac19',
        code: 'M001',
        name: 'Angga',
        penaltyEndDate: null,
        __v: 0,
      });
      expect(service.findOne).toHaveBeenCalledWith(code);
    });
  });

  describe('update', () => {
    it('should update a member', async () => {
      const code = 'M001';
      const dto: UpdateMemberDto = { name: 'Angga Updated', penaltyEndDate: null };
      expect(await controller.update(code, dto)).toEqual({
        _id: '66924287f13369a72b31ac19',
        code: 'M001',
        ...dto,
        __v: 0,
      });
      expect(service.update).toHaveBeenCalledWith(code, dto);
    });
  });

  describe('remove', () => {
    it('should delete a member', async () => {
      const code = 'M001';
      expect(await controller.remove(code)).toEqual({ deleted: true });
      expect(service.remove).toHaveBeenCalledWith(code);
    });
  });
});
