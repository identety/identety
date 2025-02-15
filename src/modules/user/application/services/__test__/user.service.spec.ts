import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { UserRepository } from '../../ports/user.repository';
import { PasswordUtil } from '@/shared/utils/password.util';
import { AppNotFoundException } from '@/shared/application/exceptions/appException';

describe('UserService', () => {
  let service: UserService;
  let repository: UserRepository;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    passwordHash: 'hashed_password',
    name: 'Test User',
  };

  const mockRepository = {
    findRows: jest.fn(),
    createOne: jest.fn(),
    updateOne: jest.fn(),
    deleteRows: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<UserRepository>(UserRepository);
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      mockRepository.findRows.mockResolvedValue([mockUser]);

      const result = await service.findById('user-123');

      expect(result).toEqual(mockUser);

      expect(repository.findRows).toHaveBeenCalledWith({
        filters: [{ key: 'id', operator: '=', value: 'user-123' }],
        limit: 1,
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findRows.mockResolvedValue([]);

      await expect(service.findById('nonexistent')).rejects.toThrow(
        AppNotFoundException,
      );
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      mockRepository.findRows.mockResolvedValue([mockUser]);

      const result = await service.findByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(repository.findRows).toHaveBeenCalledWith({
        filters: [{ key: 'email', operator: '=', value: 'test@example.com' }],
      });
    });

    it('should throw NotFoundException if email not found', async () => {
      mockRepository.findRows.mockResolvedValue([]);

      await expect(
        service.findByEmail('nonexistent@example.com'),
      ).rejects.toThrow(AppNotFoundException);
    });
  });

  describe('createUser', () => {
    it('should create user with hashed password', async () => {
      const createDto = {
        email: 'new@example.com',
        password: 'password123',
        name: 'New User',
      };

      jest
        .spyOn(PasswordUtil, 'hashPassword')
        .mockReturnValue('hashed_password');
      mockRepository.createOne.mockResolvedValue({
        ...createDto,
        id: 'new-user-id',
      });

      const result = await service.createUser(createDto);

      expect(result).toHaveProperty('id', 'new-user-id');
      expect(repository.createOne).toHaveBeenCalledWith({
        ...createDto,
        passwordHash: 'hashed_password',
      });
    });
  });

  describe('updateUser', () => {
    it('should update existing user', async () => {
      const updateDto = {
        name: 'Updated Name',
      };

      mockRepository.findRows.mockResolvedValue([mockUser]);
      mockRepository.updateOne.mockResolvedValue({ ...mockUser, ...updateDto });

      const result = await service.updateUser('user-123', updateDto);

      expect(result.name).toBe('Updated Name');
      expect(repository.updateOne).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findRows.mockResolvedValue([]);

      await expect(
        service.updateUser('nonexistent', { name: 'New Name' }),
      ).rejects.toThrow(AppNotFoundException);
    });
  });

  describe('updatePasswordWithOldPasswordVerification', () => {
    it('should update password when old password is correct', async () => {
      mockRepository.findRows.mockResolvedValue([mockUser]);
      jest.spyOn(PasswordUtil, 'verifyPassword').mockReturnValue(true);
      jest
        .spyOn(PasswordUtil, 'hashPassword')
        .mockReturnValue('new_hashed_password');
      mockRepository.updateOne.mockResolvedValue({
        ...mockUser,
        passwordHash: 'new_hashed_password',
      });

      const result = await service.updatePasswordWithOldPasswordVerification(
        'user-123',
        'oldPassword',
        'newPassword',
      );

      expect(result).toBe(true);
    });

    it('should throw error when old password is incorrect', async () => {
      mockRepository.findRows.mockResolvedValue([mockUser]);
      jest.spyOn(PasswordUtil, 'verifyPassword').mockReturnValue(false);

      await expect(
        service.updatePasswordWithOldPasswordVerification(
          'user-123',
          'wrongPassword',
          'newPassword',
        ),
      ).rejects.toThrow('Incorrect old password');
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
