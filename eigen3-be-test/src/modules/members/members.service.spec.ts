import { Test, TestingModule } from '@nestjs/testing';
import { MembersService } from './members.service';
import { getModelToken } from "@nestjs/mongoose";
import { NotFoundException } from "@nestjs/common";
import { Member } from "./entities/member.entity";
import { Borrow } from "../borrows/entities/borrow.entity";

describe('MembersService', () => {
  let service: MembersService;
  let mockMemberModel: any;
  let mockBorrowModel: any;

  beforeEach(async () => {
    mockMemberModel = {
      create: jest.fn().mockResolvedValue({}),
      aggregate: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockImplementation((query) => {
        if (query && query.code) {
          return {
            lean: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue({ }),
          };
        } else {
          return {
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue({ }),
          };
        }
      }),
      updateOne: jest.fn().mockResolvedValue({}),
      deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
    };

    mockBorrowModel = {
      countDocuments: jest.fn().mockResolvedValue(0),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembersService,
        {
          provide: getModelToken(Member.name),
          useValue: mockMemberModel,
        },
        {
          provide: getModelToken(Borrow.name),
          useValue: mockBorrowModel,
        },
      ],
    }).compile();

    service = module.get<MembersService>(MembersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a member', async () => {
      const createMemberDto = {
        name: 'John Doe'
      };
      const mockResult = createMemberDto;
      mockMemberModel.create.mockResolvedValue(mockResult);

      expect(await service.create(createMemberDto)).toEqual(mockResult);
      expect(mockMemberModel.create).toHaveBeenCalledWith(createMemberDto);
    });
  });

  describe('findAll', () => {
    it('should find and return all members with borrowed books count', async () => {
      const mockMembers = [
        { code: 'M001', name: 'John Doe', numberOfBorrowedBooks: 2 },
        { code: 'M002', name: 'Jane Smith', numberOfBorrowedBooks: 1 },
      ];

      mockMemberModel.aggregate.mockResolvedValue(mockMembers);

      expect(await service.findAll()).toEqual(mockMembers);
      expect(mockMemberModel.aggregate).toHaveBeenCalledWith([
        {
          $lookup: {
            from: 'borrows',
            localField: 'code',
            foreignField: 'member',
            as: 'borrows',
          },
        },
        {
          $addFields: {
            numberOfBorrowedBooks: { $size: '$borrows' },
          },
        },
        {
          $project: {
            borrows: 0,
          },
        },
      ]);
    });
  });

  describe('findOne', () => {
    it('should find and return a member with borrowed books count', async () => {
      const memberCode = 'M001';
      const mockMember = {
        _id: '6692d5c255bc2955b19b6819',
        code: memberCode,
        __v: 0,
        name: 'John Doe',
        penaltyEndDate: null,
      };
      const mockBorrowCount = 1;
      const expectedResult = {
        ...mockMember,
        numberOfBorrowedBooks: mockBorrowCount,
      };

      mockMemberModel.findOne.mockReturnValue({
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockMember),
      });
      mockBorrowModel.countDocuments.mockResolvedValue(mockBorrowCount);

      const result = await service.findOne(memberCode);
      expect(result).toEqual(expectedResult);
      expect(mockMemberModel.findOne).toHaveBeenCalledWith({ code: memberCode });
      expect(mockBorrowModel.countDocuments).toHaveBeenCalledWith({ member: memberCode, returnedDate: null });
    });

    it('should throw a NotFoundException if member not found', async () => {
      const memberCode = 'M001';
      mockMemberModel.findOne.mockReturnValue({
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOne(memberCode)).rejects.toThrow(NotFoundException);
      expect(mockMemberModel.findOne).toHaveBeenCalledWith({ code: memberCode });
    });
  });


  describe('update', () => {
    it('should update and return the member', async () => {
      const memberCode = 'M001';
      const updateMemberDto = { name: 'John Doe Updated' };
      const mockExistingMember = {
        code: memberCode,
        name: 'John Doe',
        save: jest.fn().mockResolvedValue({
          code: memberCode,
          name: 'John Doe Updated',
        }),
      };

      mockMemberModel.findOne.mockResolvedValue(mockExistingMember);

      const result = await service.update(memberCode, updateMemberDto);
      expect(result).toEqual({
        code: memberCode,
        name: 'John Doe Updated',
      });
      expect(mockMemberModel.findOne).toHaveBeenCalledWith({ code: memberCode });
      expect(mockExistingMember.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete the member', async () => {
      const memberCode = 'M001';
      mockMemberModel.deleteOne.mockResolvedValue({ deletedCount: 1 });

      await expect(service.remove(memberCode)).resolves.not.toThrow();
      expect(mockMemberModel.deleteOne).toHaveBeenCalledWith({ code: memberCode });
    });

    it('should throw a NotFoundException if member not found', async () => {
      const memberCode = 'M001';
      mockMemberModel.deleteOne.mockResolvedValue({ deletedCount: 0 });

      await expect(service.remove(memberCode)).rejects.toThrow(NotFoundException);
      expect(mockMemberModel.deleteOne).toHaveBeenCalledWith({ code: memberCode });
    });
  });
});
