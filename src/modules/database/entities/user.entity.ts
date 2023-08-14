import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Ability } from './ability.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ nullable: true })
  refresh_token: string;

  @Column({ default: true })
  active: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  last_updated: Date | string;

  @OneToMany((_type) => Ability, (ability) => ability.user, { eager: true })
  abilitys: Ability[];
}
