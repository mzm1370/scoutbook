import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { UserRole } from '@scoutbook/types';
import { User } from '@api/users/entities/user.entity.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  create(data: {
    email: string;
    passwordHash: string;
    role: UserRole;
  }): Promise<User> {
    const user = this.usersRepo.create(data);
    return this.usersRepo.save(user);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOneBy({ email });
  }

  findById(id: number): Promise<User | null> {
    return this.usersRepo.findOneBy({ id });
  }
}
