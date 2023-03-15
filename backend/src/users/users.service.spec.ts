import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  const user: CreateUserDto = {
    email: 'ads@asd.com',
    name: 'sasa',
    password: '123',
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('creates a user', () => {
    const createdUser = service.create(user);
    expect(createdUser).toBeDefined();
    expect(createdUser.email).toEqual(user.email);
    expect(createdUser.name).toEqual(user.name);
  });
  it('finds a user', () => {
    const returnedUser = service.findOne(1);
    console.log({ returnedUser });

    expect(returnedUser).toBeDefined();
    expect(returnedUser?.email).toEqual(user.email);
    expect(returnedUser?.name).toEqual(user.name);
  });
});
