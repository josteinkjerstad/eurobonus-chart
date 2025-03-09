import fs from 'fs';
import path from 'path';

export const getLocalUserId = (): string => {
  const filePath = path.resolve(process.cwd(), 'localUserId.txt');
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf-8').trim();
  }
  return '';
};
