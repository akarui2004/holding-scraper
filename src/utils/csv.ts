import csv from 'csv-parser';
import * as fs from 'fs';

interface RowData {
  [key: string]: string | number | boolean | null | undefined;
}

export const readCSVFile = async <T = RowData>(filePath: string): Promise<T[]> => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const results: T[] = [];

  return new Promise<T[]>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data: T) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err: Error) => reject(err));
  });
};
