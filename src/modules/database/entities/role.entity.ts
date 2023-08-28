import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Ability } from './ability.entity';
import { User } from './user.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  last_updated: Date | string;

  @OneToMany((_type) => Ability, (ability) => ability.role, { eager: true })
  ability: Ability[];

  @ManyToOne((_type) => User, (user) => user.role, { eager: false })
  user: User;
}
