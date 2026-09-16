/**
 * Tool Handlers — Extracted handler functions for each KB tool.
 *
 * These functions can be called directly by auto_context
 * without going through the MCP protocol layer.
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

/** KB root directory, resolved from environment */
const KB_ROOT = path.resolve(process.env.KB_ROOT || path.join(import.meta.dirname, '..', '..'));

/**
 * Reads and parses a markdown file safely.
 * @param {string} relativePath - Relative path from KB root.
 * @returns {{ frontmatter: Record<string, any>, content: string } | null}
 */
export function readMarkdown(relativePath: string) {
  try {
    const fullPath = path.join(KB_ROOT, relativePath);
    if (!fs.existsSync(fullPath)) return null;
    const raw = fs.readFileSync(fullPath, 'utf8');
    const { data: frontmatter, content } = matter(raw);
    return { frontmatter, content };
  } catch (error) {
    console.error(`[readMarkdown] Error reading ${relativePath}:`, error);
    return null;
  }
}

/**
 * Searches markdown files by keyword within KB.
 * @param {string} query - Search term.
 * @param {string} [projectName] - Optional project filter.
 * @returns {Array<{ path: string, title: string, snippet: string }>}
 */
export function searchMarkdownFiles(query: string, projectName?: string) {
  const results: Array<{ path: string; title: string; snippet: string }> = [];
  const searchDir = projectName
    ? path.join(KB_ROOT, 'projects', projectName)
    : KB_ROOT;

  if (!fs.existsSync(searchDir)) return results;

  const files = fs.readdirSync(searchDir, { recursive: true }) as string[];
  const queryLower = query.toLowerCase();

  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    const relPath = projectName
      ? path.join('projects', projectName, file)
      : file;
    const doc = readMarkdown(relPath);
    if (!doc) continue;

    const fullText = (
      JSON.stringify(doc.frontmatter) + ' ' + doc.content
    ).toLowerCase();
    if (fullText.includes(queryLower)) {
      const title = doc.frontmatter.title || path.basename(file, '.md');
      const snippet = doc.content.slice(0, 200).replace(/\n/g, ' ') + '...';
      results.push({ path: relPath.replace(/\\/g, '/'), title, snippet });
    }
  }

  return results;
}

/**
 * Handles get_overview — returns KB overview and navigation map.
 * @returns {string} Overview content.
 */
export function handleGetOverview(): string {
  const mapDoc = readMarkdown('KNOWLEDGE_MAP.md');
  const startDoc = readMarkdown('START_HERE.md');
  return `# Overview\n\n${startDoc?.content || 'START_HERE.md not found.'}\n\n# Navigation Map\n\n${mapDoc?.content || 'KNOWLEDGE_MAP.md not found.'}`;
}

/**
 * Handles get_project_context — returns project context/overview.
 * @param {string} projectName - Target project name.
 * @returns {string} Project context content.
 */
export function handleGetProjectContext(projectName: string): string {
  const doc = readMarkdown(`projects/${projectName}/context/overview.md`);
  if (!doc) {
    return `Project '${projectName}' context not found.`;
  }
  return `# Context: ${projectName}\n\n${doc.content}`;
}

/**
 * Handles search_knowledge — searches KB by query string.
 * @param {string} query - Keyword query.
 * @param {string} [projectName] - Optional project filter.
 * @returns {string} JSON stringified results.
 */
export function handleSearchKnowledge(
  query: string,
  projectName?: string
): string {
  const matches = searchMarkdownFiles(query, projectName);
  return matches.length
    ? JSON.stringify(matches, null, 2)
    : `No matches found for '${query}'.`;
}

/**
 * Handles get_pattern — fetches design pattern by ID or query.
 * @param {string} patternId - Pattern ID or search query.
 * @returns {string} JSON stringified results.
 */
export function handleGetPattern(patternId: string): string {
  const matches = searchMarkdownFiles(patternId);
  return JSON.stringify(matches, null, 2);
}

/**
 * Handles get_decision — fetches ADR by ID or query.
 * @param {string} decisionId - ADR ID or search query.
 * @returns {string} JSON stringified results.
 */
export function handleGetDecision(decisionId: string): string {
  const matches = searchMarkdownFiles(decisionId);
  return JSON.stringify(matches, null, 2);
}

/**
 * Handles get_lesson — fetches lesson learned by ID or query.
 * @param {string} lessonId - Lesson ID or search query.
 * @returns {string} JSON stringified results.
 */
export function handleGetLesson(lessonId: string): string {
  const matches = searchMarkdownFiles(lessonId);
  return JSON.stringify(matches, null, 2);
}

/**
 * Handles list_recent_sessions — lists recent session summaries.
 * @param {number} [_days] - Number of recent days (currently unused, searches all).
 * @param {string} [_projectName] - Optional project filter (currently unused).
 * @returns {string} JSON stringified results.
 */
export function handleListRecentSessions(
  _days?: number,
  _projectName?: string
): string {
  const matches = searchMarkdownFiles('Session Summary');
  return JSON.stringify(matches, null, 2);
}

/**
 * Handles save_session — saves a new session summary.
 * @param {object} params - Session data.
 * @returns {string} Success message with file path.
 */
export function handleSaveSession(params: {
  projectName: string;
  title: string;
  goals: string[];
  filesChanged?: string[];
  summary: string;
}): string {
  const { projectName, title, goals, filesChanged, summary } = params;

  const date = new Date().toISOString().split('T')[0];
  const fileName = `${date}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
  const targetDir = path.join(KB_ROOT, 'projects', projectName, 'sessions');

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

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

  const fullPath = path.join(targetDir, fileName);
  fs.writeFileSync(fullPath, content, 'utf8');

  return `✅ Session summary successfully saved to: projects/${projectName}/sessions/${fileName}`;
}

/**
 * Handles save_lesson — saves a new lesson learned.
 * @param {object} params - Lesson data.
 * @returns {string} Success message with file path.
 */
export function handleSaveLesson(params: {
  title: string;
  scope: string;
  severity: string;
  resolution: string;
  problem: string;
  solution: string;
}): string {
  const { title, scope, severity, resolution, problem, solution } = params;

  const date = new Date().toISOString().split('T')[0];
  const lessonId = `LL-${date}-${Math.floor(100 + Math.random() * 900)}`;
  const fileName = `${lessonId}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
  const targetDir = path.join(KB_ROOT, '_global', 'lessons');

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

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

  const fullPath = path.join(targetDir, fileName);
  fs.writeFileSync(fullPath, content, 'utf8');

  return `✅ Lesson learned successfully saved to: _global/lessons/${fileName}`;
}
