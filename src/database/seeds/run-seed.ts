import { NestFactory } from '@nestjs/core';
import { StatusSeedService } from './status/status-seed.service';
import { RoleSeedService } from './role/role-seed.service';
import { SeedModule } from './seed.module';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  await app.get(RoleSeedService).run();

  await app.get(StatusSeedService).run();

  await app.close();
};

void runSeed();
