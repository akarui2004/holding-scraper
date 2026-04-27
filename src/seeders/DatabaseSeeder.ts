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

      try {
        await em.upsertMany(entity, seederData);
        // Clear the EntityManager to free up memory after each seeding operation
        // This is especially important when seeding large datasets to prevent memory leaks
        // Note: clearing eagerly loaded relations may cause issues if subsequent seeders depend on them
        em.clear();
        logger.info(`[SEEDER] Seeded ${seederData.length} records into ${entityName}`);
      } catch (error) {
        logger.error(`[SEEDER] Failed to seed ${entityName} from ${csvFile}:`, error);
      }
    }
  }
}
