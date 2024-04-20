import { EntityCondition } from '../../../../core/utils/types/entity-condition.type';
import { NullableType } from '../../../../core/utils/types/nullable.type';
import { User } from '../../../users/domain/user';
import { Session } from '../../domain/session';

export abstract class SessionRepository {
  abstract findOne(
    options: EntityCondition<Session>,
  ): Promise<NullableType<Session>>;

  abstract create(
    data: Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<Session>;

  abstract update(
    id: Session['id'],
    payload: Partial<
      Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
    >,
  ): Promise<Session | null>;

  abstract softDelete({
    excludeId,
    ...criteria
  }: {
    id?: Session['id'];
    user?: Pick<User, 'id'>;
    excludeId?: Session['id'];
  }): Promise<void>;
}
