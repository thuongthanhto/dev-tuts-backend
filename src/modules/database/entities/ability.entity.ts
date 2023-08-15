import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from './role.entity';

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

  @ManyToOne((_type) => Role, (role) => role.ability, { eager: false })
  @Exclude({ toPlainOnly: true })
  role: Role;
}
