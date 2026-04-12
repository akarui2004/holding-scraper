import { AccountEntity } from '@entities';
import type { EntityManager, EntityName } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { logger, readCSVFile } from '@utils';
import fs from 'fs';

type SeederContextItem = {
  file: string;
  entity: EntityName;
};

const SEEDER_CONTEXT: SeederContextItem[] = [{ file: 'account.csv', entity: AccountEntity }];

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    for (const { file, entity } of SEEDER_CONTEXT) {
      const entityName = typeof entity === 'function' && 'name' in entity ? entity.name : null;
      if (!entityName) {
        logger.error(`Invalid entity for seeding: ${entityName}`);
        continue;
      }
      logger.info(`Seeding ${entityName} from ${file}...`);

      const csvFile = `src/seeders/csv/${file}`;
      if (!fs.existsSync(csvFile)) {
        logger.error(`CSV file not found: ${csvFile}`);
        continue;
      }

      const seederData = await readCSVFile(csvFile);
      if (!seederData || seederData.length === 0) {
        logger.error(`No data found in CSV file: ${csvFile}`);
        continue;
      }
      await em.upsertMany(entity, seederData);
      logger.info(`Successfully seeded ${entityName}`);
    }
  }
}
