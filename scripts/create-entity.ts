import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import pc from 'picocolors';
import { plural } from 'pluralize';
import { sprintf } from 'sprintf-js';

const createEntityFile = (entityName: string) => {
  const templatePath = path.join(__dirname, 'template', 'create-entity.template');
  if (!fs.existsSync(templatePath)) {
    console.error(pc.red(`❌ Template file not found at ${templatePath}`));
    return;
  }

  const lowerCaseEntityName = entityName.toLowerCase();
  const fileName = `${lowerCaseEntityName}.entity.ts`;
  const entityFilePath = path.join(__dirname, '..', 'src', 'entities', fileName);
  if (fs.existsSync(entityFilePath)) {
    console.error(pc.red(`❌ Entity already exists: src/entities/${fileName}`));
    return;
  }

  const content = fs.readFileSync(templatePath, 'utf-8');
  const tableName = plural(lowerCaseEntityName);
  const entityClassName = `${lowerCaseEntityName.charAt(0).toUpperCase() + lowerCaseEntityName.slice(1)}Entity`;
  const entityContent = sprintf(content, tableName, entityClassName);
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
