import { DeepPartial } from 'typeorm';
import { FilterUserDto, SortUserDto } from '../../dto/query-user.dto';
import { User } from '../../domain/user';
import { IPaginationOptions } from '../../../../core/utils/types/pagination-options';
import { NullableType } from '../../../../core/utils/types/nullable.type';
import { EntityCondition } from '../../../../core/utils/types/entity-condition.type';

export abstract class UserRepository {
  abstract create(
    data: Omit<User, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<User>;

  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<User[]>;

  abstract findOne(fields: EntityCondition<User>): Promise<NullableType<User>>;

  abstract update(
    id: User['id'],
    payload: DeepPartial<User>,
  ): Promise<User | null>;

  abstract softDelete(id: User['id']): Promise<void>;
}
