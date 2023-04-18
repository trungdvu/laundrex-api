import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findOneById(id: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        role: true,
      },
    });
  }

  async findOneByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: {
        email,
      },
      relations: {
        role: true,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.userRepository.preload({ id, ...updateUserDto });
    if (!user) {
      throw new NotFoundException(`user #${id} not found`);
    }
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<UserEntity> {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException(`user #${id} not found`);
    }
    return this.userRepository.remove(user);
  }
}
