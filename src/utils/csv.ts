import csv from 'csv-parser';
import * as fs from 'fs';

interface RowData {
  [key: string]: string | number | boolean | null | undefined;
}

export const readCSVFile = async (filePath: string): Promise<RowData[]> => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const results: RowData[] = [];

  return new Promise<RowData[]>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      //TODO: consider using a streaming approach for large files to avoid memory issues
      .on('data', (data: RowData) => results.push(csvTransformation(data)))
      .on('end', () => resolve(results))
      .on('error', (err: Error) => reject(err));
  });
};

const csvTransformation = (input: RowData): RowData => {
  const output: RowData = {};

  for (const [key, value] of Object.entries(input)) {
    if (typeof value === 'string' && value.trim().toLowerCase() === 'null') {
      output[key] = null;
    } else {
      output[key] = value;
    }
  }

  return output;
};
