import * as fs from 'fs';
import * as path from 'path';

const basePath = path.join(__dirname, '../../temp');

export class FileStorage<T> {
  constructor(private filename: string) {
    if (!fs.existsSync(basePath)) {
      fs.mkdirSync(basePath);
    }
    const filePath = this.getFilePath();
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([]));
    }
  }

  private getFilePath() {
    return path.join(basePath, this.filename);
  }

  async getAll(): Promise<T[]> {
    const data = fs.readFileSync(this.getFilePath(), 'utf-8');
    return JSON.parse(data);
  }

  async saveAll(data: T[]) {
    fs.writeFileSync(this.getFilePath(), JSON.stringify(data, null, 2));
  }
}

