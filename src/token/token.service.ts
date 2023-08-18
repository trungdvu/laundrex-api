import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { In, Repository } from 'typeorm';
import { CreateTokenDto } from './dtos/create-token.dto';
import { TokenEntity } from './entries/token.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>,
  ) {}

  async create(createTokenDto: CreateTokenDto): Promise<TokenEntity> {
    try {
    } catch (error) {}
    const token = this.tokenRepository.create({
      ...createTokenDto,
      value: crypto.randomBytes(32).toString('hex'),
    });
    return this.tokenRepository.save(token);
  }

  async findOne(userId: string, token: string) {
    return this.tokenRepository.findOne({
      where: {
        userId,
        value: token,
      },
    });
  }

  async findAll(userId: string) {
    return this.tokenRepository.find({
      where: { userId },
    });
  }

  async remove(userId: string, tokenValue: string) {
    const token = await this.tokenRepository.findOne({
      where: {
        userId,
        value: tokenValue,
      },
    });
    if (!token) {
      throw new NotFoundException(`token ${tokenValue} not found`);
    }
    return this.tokenRepository.remove(token);
  }

  async removeIn(userIds: string[]) {
    return this.tokenRepository.delete({ userId: In(userIds) });
  }
}
