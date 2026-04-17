import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { logger, readCSVFile } from '@utils';
import fs from 'fs';
import path from 'path';
import { SEEDER_CONTEXTS } from './SeederContext';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    for (const { csvFile, entity } of SEEDER_CONTEXTS) {
      const entityName = typeof entity === 'function' && 'name' in entity ? entity.name : null;
      if (!entityName) {
        logger.warn(`[SEEDER] Skipped: Invalid entity for seeding with CSV file ${csvFile}`);
        continue;
      }

      logger.info(`[SEEDER] Loading seeder for ${entityName} from ${csvFile}`);
      const csvFilePath = path.join(__dirname, 'csv', csvFile);
      if (!fs.existsSync(csvFilePath)) {
        logger.warn(`[SEEDER] Skipped: CSV file(${csvFile}) not found`);
        continue;
      }

      const seederData = await readCSVFile(csvFilePath);
      if (!seederData || seederData.length === 0) {
        logger.error(`[SEEDER] Skipped: No data found in CSV file ${csvFile}`);
        continue;
      }

      await em.upsertMany(entity, seederData);
      logger.info(`[SEEDER] Seeded ${seederData.length} records into ${entityName}`);
    }
  }
}
