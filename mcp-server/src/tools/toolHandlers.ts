/**
 * Tool Handlers — Extracted handler functions for each KB tool.
 *
 * Uses DataProvider abstraction so handlers work with both
 * local filesystem and GitHub API transparently.
 */

import matter from 'gray-matter';
import type { DataProvider, ParsedMarkdown } from '../providers/dataProvider.js';

/**
 * Factory that creates all tool handler functions bound to a DataProvider.
 * @param provider - DataProvider instance (LocalProvider or GitHubProvider).
 * @returns Object containing all handler functions.
 */
export function createToolHandlers(provider: DataProvider) {

  /**
   * Reads and parses a markdown file safely.
   * @param relativePath - Relative path from KB root.
   * @returns Parsed frontmatter + content, or null if not found.
   */
  async function readMarkdown(relativePath: string): Promise<ParsedMarkdown | null> {
    try {
      const raw = await provider.readFile(relativePath);
      if (!raw) return null;
      const { data: frontmatter, content } = matter(raw);
      return { frontmatter, content };
    } catch (error: any) {
      console.error(`[readMarkdown] Error reading ${relativePath}:`, error.message);
      return null;
    }
  }

  /**
   * Searches markdown files by keyword within KB.
   * @param query - Search term.
   * @param projectName - Optional project filter.
   * @returns Matching file summaries.
   */
  async function searchMarkdownFiles(
    query: string,
    projectName?: string
  ): Promise<Array<{ path: string; title: string; snippet: string }>> {
    const results: Array<{ path: string; title: string; snippet: string }> = [];
    const searchDir = projectName ? `projects/${projectName}` : '';

    const files = await provider.listFiles(searchDir, '*.md');
    const queryLower = query.toLowerCase();

    for (const filePath of files) {
      const doc = await readMarkdown(filePath);
      if (!doc) continue;

      const fullText = (
        JSON.stringify(doc.frontmatter) + ' ' + doc.content
      ).toLowerCase();

      if (fullText.includes(queryLower)) {
        const baseName = filePath.split('/').pop() || filePath;
        const title = doc.frontmatter.title || baseName.replace('.md', '');
        const snippet = doc.content.slice(0, 200).replace(/\n/g, ' ') + '...';
        results.push({ path: filePath, title, snippet });
      }
    }

    return results;
  }

  /**
   * Handles get_overview — returns KB overview and navigation map.
   * @returns Overview content string.
   */
  async function handleGetOverview(): Promise<string> {
    const mapDoc = await readMarkdown('KNOWLEDGE_MAP.md');
    const startDoc = await readMarkdown('START_HERE.md');
    return `# Overview\n\n${startDoc?.content || 'START_HERE.md not found.'}\n\n# Navigation Map\n\n${mapDoc?.content || 'KNOWLEDGE_MAP.md not found.'}`;
  }

  /**
   * Handles get_project_context — returns project context/overview.
   * @param projectName - Target project name.
   * @returns Project context content.
   */
  async function handleGetProjectContext(projectName: string): Promise<string> {
    const doc = await readMarkdown(`projects/${projectName}/context/overview.md`);
    if (!doc) {
      return `Project '${projectName}' context not found.`;
    }
    return `# Context: ${projectName}\n\n${doc.content}`;
  }

  /**
   * Handles search_knowledge — searches KB by query string.
   * @param query - Keyword query.
   * @param projectName - Optional project filter.
   * @returns JSON stringified results.
   */
  async function handleSearchKnowledge(
    query: string,
    projectName?: string
  ): Promise<string> {
    const matches = await searchMarkdownFiles(query, projectName);
    return matches.length
      ? JSON.stringify(matches, null, 2)
      : `No matches found for '${query}'.`;
  }

  /**
   * Handles get_pattern — fetches design pattern by ID or query.
   * @param patternId - Pattern ID or search query.
   * @returns JSON stringified results.
   */
  async function handleGetPattern(patternId: string): Promise<string> {
    const matches = await searchMarkdownFiles(patternId);
    return JSON.stringify(matches, null, 2);
  }

  /**
   * Handles get_decision — fetches ADR by ID or query.
   * @param decisionId - ADR ID or search query.
   * @returns JSON stringified results.
   */
  async function handleGetDecision(decisionId: string): Promise<string> {
    const matches = await searchMarkdownFiles(decisionId);
    return JSON.stringify(matches, null, 2);
  }

  /**
   * Handles get_lesson — fetches lesson learned by ID or query.
   * @param lessonId - Lesson ID or search query.
   * @returns JSON stringified results.
   */
  async function handleGetLesson(lessonId: string): Promise<string> {
    const matches = await searchMarkdownFiles(lessonId);
    return JSON.stringify(matches, null, 2);
  }

  /**
   * Handles list_recent_sessions — lists recent session summaries.
   * @param _days - Number of recent days (currently searches all).
   * @param _projectName - Optional project filter.
   * @returns JSON stringified results.
   */
  async function handleListRecentSessions(
    _days?: number,
    _projectName?: string
  ): Promise<string> {
    const matches = await searchMarkdownFiles('Session Summary');
    return JSON.stringify(matches, null, 2);
  }

  function toSlug(str: string): string {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/gi, 'd')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Handles save_session — saves a new session summary.
   * @param params - Session data.
   * @returns Success message with file path.
   */
  async function handleSaveSession(params: {
    projectName: string;
    title: string;
    goals: string[];
    filesChanged?: string[];
    summary: string;
  }): Promise<string> {
    const { projectName, title, goals, filesChanged, summary } = params;

    const date = new Date().toISOString().split('T')[0];
    const fileName = `${date}-${toSlug(title)}.md`;
    const targetPath = `projects/${projectName}/sessions/${fileName}`;

    const content = [
      '---',
      `id: SES-${date}-${Math.floor(100 + Math.random() * 900)}`,
      `date: "${date}"`,
      `author: AI-Agent`,
      `project: ${projectName}`,
      `goals: ${JSON.stringify(goals)}`,
      `status: completed`,
      `files_changed: ${JSON.stringify(filesChanged || [])}`,
      `tags: [session, summary]`,
      '---',
      '',
      `# Session Summary: ${title}`,
      '',
      summary,
    ].join('\n');

    await provider.writeFile(targetPath, content);
    return `✅ Session summary successfully saved to: ${targetPath}`;
  }

  /**
   * Handles save_lesson — saves a new lesson learned.
   * @param params - Lesson data.
   * @returns Success message with file path.
   */
  async function handleSaveLesson(params: {
    title: string;
    scope: string;
    severity: string;
    resolution: string;
    problem: string;
    solution: string;
  }): Promise<string> {
    const { title, scope, severity, resolution, problem, solution } = params;

    const date = new Date().toISOString().split('T')[0];
    const lessonId = `LL-${date}-${Math.floor(100 + Math.random() * 900)}`;
    const fileName = `${lessonId}-${toSlug(title)}.md`;
    const targetPath = `_global/lessons/${fileName}`;

    const content = [
      '---',
      `id: ${lessonId}`,
      `title: "${title}"`,
      `date: "${date}"`,
      `author: AI-Agent`,
      `scope: ${scope}`,
      `severity: ${severity}`,
      `resolution: ${resolution}`,
      `tags: [lesson, agent-generated]`,
      '---',
      '',
      `# ${lessonId}: ${title}`,
      '',
      '## Problem',
      problem,
      '',
      '## Solution',
      solution,
    ].join('\n');

    await provider.writeFile(targetPath, content);
    return `✅ Lesson learned successfully saved to: ${targetPath}`;
  }

  return {
    readMarkdown,
    searchMarkdownFiles,
    handleGetOverview,
    handleGetProjectContext,
    handleSearchKnowledge,
    handleGetPattern,
    handleGetDecision,
    handleGetLesson,
    handleListRecentSessions,
    handleSaveSession,
    handleSaveLesson,
  };
}

/** Type helper for the handlers object */
export type ToolHandlers = ReturnType<typeof createToolHandlers>;
