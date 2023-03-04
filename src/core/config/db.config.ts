import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const dbConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'toilaThuong1',
  database: 'mindkind',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
};
