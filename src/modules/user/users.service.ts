import {
  Injectable,
  InternalServerErrorException,
  Logger,
  //   NotFoundException,
} from '@nestjs/common';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  private logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUsers(filterDto: GetUsersFilterDto): Promise<User[]> {
    const { search } = filterDto;

    const query = this.userRepository.createQueryBuilder('task');

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

  //   async getUserById(id: string): Promise<User> {
  //     const found = await this.userRepository.findOneBy(id);

  //     if (!found) {
  //       throw new NotFoundException(`Task with ID "${id}" not found`);
  //     }

  //     return found;
  //   }

  //   async deleteTask(id: string): Promise<void> {
  //     const result = await this.userRepository.delete(id);

  //     if (result.affected === 0) {
  //       throw new NotFoundException(`Task with ID "${id}" not found`);
  //     }
  //   }

  //   async updateTaskStatus(
  //     id: string,
  //     status: TaskStatus,
  //     user: User,
  //   ): Promise<Task> {
  //     const task = await this.getUserById(id, user);

  //     task.status = status;
  //     await this.userRepository.save(task);

  //     return task;
  //   }
}
