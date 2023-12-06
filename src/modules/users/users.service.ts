import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { User } from '../database/entities';
import { EntityCondition } from '../../core/utils/types/entity-condition.type';
import { NullableType } from '../../core/utils/types/nullable.type';
import { IPaginationOptions } from '../../core/utils/types/pagination-options';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getUsers(filterDto: GetUsersFilterDto): Promise<User[]> {
    const { search } = filterDto;

    const query = this.usersRepository.createQueryBuilder('task');

    if (search) {
      query.andWhere(
        '(LOWER(user.firstName) LIKE LOWER(:search) OR LOWER(user.lastName) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for Filters: ${JSON.stringify(filterDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  create(createProfileDto: CreateUserDto): Promise<User> {
    return this.usersRepository.save(
      this.usersRepository.create(createProfileDto),
    );
  }

  update(id: number, payload: DeepPartial<User>): Promise<User> {
    return this.usersRepository.save(
      this.usersRepository.create({
        id,
        ...payload,
      }),
    );
  }

  findManyWithPagination(
    paginationOptions: IPaginationOptions,
  ): Promise<User[]> {
    return this.usersRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });
  }

  findOne(fields: EntityCondition<User>): Promise<NullableType<User>> {
    return this.usersRepository.findOne({
      where: fields,
    });
  }

  async softDelete(id: number): Promise<void> {
    await this.usersRepository.softDelete(id);
  }
}
