import { Column, Entity, PrimaryColumn } from 'typeorm';

import { Status } from '../../../domain/status';
import { EntityRelationalHelper } from '../../../../../core/utils/relational-entity-helper';

@Entity({
  name: 'status',
})
export class StatusEntity extends EntityRelationalHelper implements Status {
  @PrimaryColumn()
  id: number;

  @Column()
  name?: string;
}
