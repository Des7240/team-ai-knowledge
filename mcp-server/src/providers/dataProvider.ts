/**
 * DataProvider Interface — Abstraction layer for KB data access.
 *
 * Implementations:
 * - LocalProvider: reads/writes from local filesystem
 * - GitHubProvider: reads/writes via GitHub Contents API
 */

/**
 * Parsed markdown file result.
 */
export interface ParsedMarkdown {
  frontmatter: Record<string, any>;
  content: string;
}

/**
 * File entry in a directory listing.
 */
export interface FileEntry {
  path: string;
  name: string;
  isDirectory: boolean;
}

/**
 * Abstract data provider for KB file operations.
 */
export interface DataProvider {
  /**
   * Reads a file and returns its raw content.
   * @param relativePath - Path relative to KB root.
   * @returns File content as string, or null if not found.
   */
  readFile(relativePath: string): Promise<string | null>;

  /**
   * Writes content to a file, creating directories as needed.
   * @param relativePath - Path relative to KB root.
   * @param content - File content to write.
   */
  writeFile(relativePath: string, content: string): Promise<void>;

  /**
   * Lists files in a directory, optionally filtered by extension.
   * @param dirPath - Directory path relative to KB root.
   * @param pattern - Optional glob pattern (e.g. '*.md').
   * @returns Array of relative file paths.
   */
  listFiles(dirPath: string, pattern?: string): Promise<string[]>;

  /**
   * Checks if a file or directory exists.
   * @param relativePath - Path relative to KB root.
   * @returns True if exists.
   */
  fileExists(relativePath: string): Promise<boolean>;

  /**
   * Deletes a file.
   * @param relativePath - Path relative to KB root.
   */
  deleteFile(relativePath: string): Promise<void>;
}
