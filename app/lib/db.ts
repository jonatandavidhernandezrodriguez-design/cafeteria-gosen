import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

export async function readJSON<T>(filename: string): Promise<T> {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    throw error;
  }
}

export async function writeJSON<T>(filename: string, data: T): Promise<void> {
  try {
    // Asegurar que el directorio existe
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
    } catch (mkdirError) {
      console.error(`Error creating data directory:`, mkdirError);
    }
    
    const filePath = path.join(DATA_DIR, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    throw error;
  }
}
