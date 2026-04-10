import { AccountEntity } from '@entities';
import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { logger, readCSVFile } from '@utils';
import path from 'path';

export class AccountSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const accountCSVFilePath = path.join(process.cwd(), 'src/seeders/csv/account.csv');
    const accountData = await readCSVFile<Partial<AccountEntity>>(accountCSVFilePath);
    await em.upsertMany(AccountEntity, accountData);

    logger.info('Successfully seeded Account');
  }
}
