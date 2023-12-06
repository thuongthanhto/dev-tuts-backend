import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Allow } from 'class-validator';
import { EntityHelper } from '../../../core/utils/validators';
import { User } from '../../database/entities';

@Entity()
export class Forgot extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Allow()
  @Column()
  @Index()
  hash: string;

  @Allow()
  @ManyToOne(() => User, {
    eager: true,
  })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
