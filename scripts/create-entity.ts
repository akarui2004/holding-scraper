import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import pc from 'picocolors';
import { plural } from 'pluralize';
import { sprintf } from 'sprintf-js';

const createEntityFile = (entityName: string) => {
  const lowerCaseEntityName = entityName.toLowerCase();
  const fileName = `${lowerCaseEntityName}.entity.ts`;
  const tableName = plural(lowerCaseEntityName);

  const templatePath = path.join(__dirname, 'template', 'create-entity.template');
  if (!fs.existsSync(templatePath)) {
    console.error(pc.red(`❌ Template file not found at ${templatePath}`));
    return;
  }
  const content = fs.readFileSync(templatePath, 'utf-8');
  const entityContent = sprintf(content, tableName);

  const entityFilePath = path.join(__dirname, '..', 'src', 'entities', fileName);
  if (fs.existsSync(entityFilePath)) {
    console.error(pc.red(`❌ Entity already exists: src/entities/${fileName}`));
    return;
  }

  fs.writeFileSync(entityFilePath, entityContent);
  console.log(pc.green(`✅ Created entity: src/entities/${fileName}`));
};

const program = new Command();

program
  .name('create-entity') // optional but recommended
  .description('A script to create a new entity file with a given name')
  .argument('<entityName>', 'The name of the entity to create')
  .action((entityName: string) => createEntityFile(entityName));

program.parse();
