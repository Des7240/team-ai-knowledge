/**
 * LocalProvider — Filesystem-based DataProvider implementation.
 *
 * Used in stdio mode when KB files are available on local disk.
 */

import fs from 'fs';
import path from 'path';
import type { DataProvider } from './dataProvider.js';

/**
 * Provides KB data access via local filesystem.
 */
export class LocalProvider implements DataProvider {
  private kbRoot: string;

  /**
   * @param kbRoot - Absolute path to KB root directory.
   */
  constructor(kbRoot: string) {
    this.kbRoot = path.resolve(kbRoot);
  }

  /**
   * Reads a file from local filesystem.
   * @param relativePath - Path relative to KB root.
   * @returns File content or null if not found.
   */
  async readFile(relativePath: string): Promise<string | null> {
    try {
      const fullPath = path.join(this.kbRoot, relativePath);
      if (!fs.existsSync(fullPath)) return null;
      return fs.readFileSync(fullPath, 'utf8');
    } catch (error: any) {
      console.error(`[LocalProvider.readFile] Error reading ${relativePath}:`, error.message);
      return null;
    }
  }

  /**
   * Writes content to a file on local filesystem.
   * @param relativePath - Path relative to KB root.
   * @param content - Content to write.
   */
  async writeFile(relativePath: string, content: string): Promise<void> {
    const fullPath = path.join(this.kbRoot, relativePath);
    const dir = path.dirname(fullPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(fullPath, content, 'utf8');
  }

  /**
   * Lists files in a directory, optionally filtered by extension.
   * @param dirPath - Directory relative to KB root.
   * @param pattern - Optional extension filter (e.g. '*.md').
   * @returns Array of relative file paths.
   */
  async listFiles(dirPath: string, pattern?: string): Promise<string[]> {
    const fullDir = path.join(this.kbRoot, dirPath);
    if (!fs.existsSync(fullDir)) return [];

    const files = fs.readdirSync(fullDir, { recursive: true }) as string[];
    const ext = pattern?.replace('*', '') || '';

    return files
      .filter((f) => !ext || f.endsWith(ext))
      .map((f) => path.join(dirPath, f).replace(/\\/g, '/'));
  }

  /**
   * Checks if a path exists on local filesystem.
   * @param relativePath - Path relative to KB root.
   * @returns True if exists.
   */
  async fileExists(relativePath: string): Promise<boolean> {
    return fs.existsSync(path.join(this.kbRoot, relativePath));
  }
}
