import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Ability {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  action: string;

  @Column()
  subject: string;

  @Column()
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  last_updated: Date | string;

  @ManyToOne((_type) => User, (user) => user.abilitys, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;
}
