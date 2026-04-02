import { TSMigrationGenerator } from '@mikro-orm/migrations';
import { format } from 'sql-formatter';

export class CustomMigrationGeneratorHelper extends TSMigrationGenerator {
  generateMigrationFile(className: string, diff: { up: string[]; down: string[] }): string {
    const comment = '// this file was generated via custom migration generator\n\n';
    return comment + super.generateMigrationFile(className, diff);
  }

  createStatement(sql: string, padLeft: number): string {
    sql = format(sql, {
      language: 'postgresql',
      keywordCase: 'upper',
      dataTypeCase: 'upper',
      functionCase: 'upper',
      identifierCase: 'upper',
    });
    sql = sql
      .split('\n')
      .map((l, i) => (i === 0 ? l : `${' '.repeat(padLeft + 13)}${l}`))
      .join('\n');

    return super.createStatement(sql, padLeft);
  }
}
