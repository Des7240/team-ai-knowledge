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
   * Resolves and validates a project name against KNOWLEDGE_MAP.md.
   * @param requestedName - The project name provided by the tool caller.
   * @returns The exact project name to use.
   */
  async function resolveProjectName(requestedName: string): Promise<string> {
    const mapDoc = await readMarkdown('KNOWLEDGE_MAP.md');
    let validProjects: string[] = [];
    if (mapDoc) {
      const lines = mapDoc.content.split('\n');
      for (const line of lines) {
        if (line.includes('| [') && line.includes('](./projects/')) {
          const match = line.match(/\|\s*\[(.*?)\]\(\.\/projects\/(.*?)\/\)/);
          if (match && match[2]) {
            validProjects.push(match[2].trim());
          }
        }
      }
    }

    if (validProjects.length === 0) {
      validProjects = ['MT-GRMS', 'document-workspace-hub', 'team-ai-knowledge'];
    }

    if (validProjects.includes(requestedName)) {
      return requestedName;
    }

    for (const vp of validProjects) {
      if (requestedName.toLowerCase().includes(vp.toLowerCase()) || vp.toLowerCase().includes(requestedName.toLowerCase())) {
        return vp;
      }
    }

    throw new Error(`Tên dự án không hợp lệ: "${requestedName}". Vui lòng chọn một trong các dự án sau: ${validProjects.join(', ')}.`);
  }

  /**
   * Handles xem_tong_quan — returns KB overview and navigation map.
   * @returns Overview content string.
   */
  async function handleXemTongQuan(): Promise<string> {
    const mapDoc = await readMarkdown('KNOWLEDGE_MAP.md');
    const startDoc = await readMarkdown('START_HERE.md');
    return `# Overview\n\n${startDoc?.content || 'START_HERE.md not found.'}\n\n# Navigation Map\n\n${mapDoc?.content || 'KNOWLEDGE_MAP.md not found.'}`;
  }

  /**
   * Handles xem_ngu_canh_du_an — returns project context/overview.
   * @param projectName - Target project name.
   * @returns Project context content.
   */
  async function handleXemNguCanhDuAn(projectName: string): Promise<string> {
    const resolvedProject = await resolveProjectName(projectName);
    const doc = await readMarkdown(`projects/${resolvedProject}/context/overview.md`);
    if (!doc) {
      return `Project '${resolvedProject}' context not found.`;
    }
    return `# Context: ${resolvedProject}\n\n${doc.content}`;
  }

  /**
   * Handles tim_kiem_kien_thuc — searches KB by query string.
   * @param query - Keyword query.
   * @param projectName - Optional project filter.
   * @returns JSON stringified results.
   */
  async function handleTimKiemKienThuc(
    query: string,
    projectName?: string
  ): Promise<string> {
    const resolvedProject = projectName ? await resolveProjectName(projectName) : undefined;
    const matches = await searchMarkdownFiles(query, resolvedProject);
    return matches.length
      ? JSON.stringify(matches, null, 2)
      : `No matches found for '${query}'.`;
  }

  /**
   * Handles xem_mau_thiet_ke — fetches design pattern by ID or query.
   * @param patternId - Pattern ID or search query.
   * @returns JSON stringified results.
   */
  async function handleXemMauThietKe(patternId: string): Promise<string> {
    const matches = await searchMarkdownFiles(patternId);
    return JSON.stringify(matches, null, 2);
  }

  /**
   * Handles xem_quyet_dinh — fetches ADR by ID or query.
   * @param decisionId - ADR ID or search query.
   * @returns JSON stringified results.
   */
  async function handleXemQuyetDinh(decisionId: string): Promise<string> {
    const matches = await searchMarkdownFiles(decisionId);
    return JSON.stringify(matches, null, 2);
  }

  /**
   * Handles xem_bai_hoc — fetches lesson learned by ID or query.
   * @param lessonId - Lesson ID or search query.
   * @returns JSON stringified results.
   */
  async function handleXemBaiHoc(lessonId: string): Promise<string> {
    const matches = await searchMarkdownFiles(lessonId);
    return JSON.stringify(matches, null, 2);
  }

  /**
   * Handles danh_sach_phien_gan_day — lists recent session summaries.
   * @param _days - Number of recent days (currently searches all).
   * @param _projectName - Optional project filter.
   * @returns JSON stringified results.
   */
  async function handleDanhSachPhienGanDay(
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
   * Handles luu_phien_lam_viec — saves a new session summary.
   * @param params - Session data.
   * @returns Success message with file path.
   */
  async function handleLuuPhienLamViec(params: {
    projectName: string;
    epicOrFeature: string;
    title: string;
    goals: string[];
    filesChanged?: string[];
    summary: string;
  }): Promise<string> {
    const { projectName, epicOrFeature, title, goals, filesChanged, summary } = params;
    const resolvedProject = await resolveProjectName(projectName);

    const date = new Date().toISOString().split('T')[0];
    const fileName = `${date}-${toSlug(title)}.md`;
    const targetPath = `projects/${resolvedProject}/sessions/${fileName}`;

    if (await provider.fileExists(targetPath)) {
      return `Error: Phiên làm việc với tiêu đề này đã tồn tại trong ngày (${targetPath}). Vui lòng đổi tiêu đề khác hoặc dùng tool 'sua_tai_lieu' để cập nhật nội dung có ghi log chi tiết.`;
    }

    const content = [
      '---',
      `id: SES-${date}-${Math.floor(100 + Math.random() * 900)}`,
      `date: "${date}"`,
      `author: AI-Agent`,
      `project: ${projectName}`,
      `epic: "${epicOrFeature}"`,
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

    // Update SESSION_INDEX.md
    const indexPath = `projects/${resolvedProject}/SESSION_INDEX.md`;
    const indexDoc = await readMarkdown(indexPath);
    let indexContent = indexDoc ? (indexDoc.frontmatter ? matter.stringify(indexDoc.content, indexDoc.frontmatter) : indexDoc.content) : `# Bảng theo dõi Phiên làm việc\n`;
    
    const epicHeader = `## [Epic] ${epicOrFeature}`;
    if (!indexContent.includes(epicHeader)) {
      indexContent += `\n${epicHeader}\n`;
    }
    
    const sessionLink = `- [${date} - ${title}](./sessions/${fileName})`;
    const parts = indexContent.split(epicHeader);
    indexContent = parts[0] + epicHeader + '\n' + sessionLink + (parts[1].startsWith('\n') ? parts[1] : '\n' + parts[1]);
    
    await provider.writeFile(indexPath, indexContent);

    return `✅ Session summary successfully saved to: ${targetPath} and indexed in SESSION_INDEX.md`;
  }

  /**
   * Handles luu_bai_hoc — saves a new lesson learned.
   * @param params - Lesson data.
   * @returns Success message with file path.
   */
  async function handleLuuBaiHoc(params: {
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

  /**
   * Helper to determine archive path.
   */
  function getArchivePath(originalPath: string): string {
    if (originalPath.startsWith('projects/')) {
      const parts = originalPath.split('/');
      if (parts[2] !== 'archive') {
        parts.splice(2, 0, 'archive');
        return parts.join('/');
      }
    } else if (originalPath.startsWith('_global/')) {
      const parts = originalPath.split('/');
      if (parts[1] !== 'archive') {
        parts.splice(1, 0, 'archive');
        return parts.join('/');
      }
    }
    return originalPath;
  }

  /**
   * Helper to determine restore path.
   */
  function getRestorePath(archivePath: string): string {
    return archivePath.replace('/archive/', '/');
  }

  /**
   * Handles luu_tru_kien_thuc — archives a KB file.
   * @param path - Path to file.
   * @param reason - Optional reason for archiving.
   * @returns Success message.
   */
  async function handleLuuTruKienThuc(path: string, reason?: string): Promise<string> {
    const doc = await readMarkdown(path);
    if (!doc) return `Error: File not found at ${path}`;

    doc.frontmatter.status = 'archived';
    doc.frontmatter.superseded = true;
    if (reason) doc.frontmatter.archive_reason = reason;

    const newPath = getArchivePath(path);
    if (newPath === path) return `Error: Could not determine archive path for ${path}`;

    const content = matter.stringify(doc.content, doc.frontmatter);
    await provider.writeFile(newPath, content);
    await provider.deleteFile(path);

    return `✅ Successfully archived to: ${newPath}`;
  }

  /**
   * Handles phuc_hoi_kien_thuc — restores an archived KB file.
   * @param path - Path to archived file.
   * @returns Success message.
   */
  async function handlePhucHoiKienThuc(path: string): Promise<string> {
    const doc = await readMarkdown(path);
    if (!doc) return `Error: File not found at ${path}`;

    doc.frontmatter.status = 'active';
    delete doc.frontmatter.superseded;
    delete doc.frontmatter.archive_reason;

    const newPath = getRestorePath(path);
    if (newPath === path) return `Error: File does not appear to be in an archive path.`;

    const content = matter.stringify(doc.content, doc.frontmatter);
    await provider.writeFile(newPath, content);
    await provider.deleteFile(path);

    return `✅ Successfully restored to: ${newPath}`;
  }

  /**
   * Handles xem_bieu_mau — returns a template content.
   * @param type - Template type (pattern, decision, lesson, session).
   * @returns Template content string.
   */
  async function handleXemBieuMau(type: string): Promise<string> {
    const safeType = toSlug(type);
    const doc = await readMarkdown(`_global/templates/${safeType}.md`);
    if (!doc) {
      return `Template '${safeType}' not found. Available templates might be: pattern, decision, lesson, session.`;
    }
    return `# Template: ${type}\n\n${doc.content}`;
  }
  /**
   * Handles xem_khao_sat — fetches exploration doc by ID or query.
   * @param explorationId - Exploration ID or search query.
   * @returns JSON stringified results.
   */
  async function handleXemKhaoSat(explorationId: string): Promise<string> {
    const matches = await searchMarkdownFiles(explorationId);
    return JSON.stringify(matches, null, 2);
  }

  /**
   * Handles xem_dac_ta — fetches spec by ID or query.
   * @param specId - Spec ID or search query.
   * @returns JSON stringified results.
   */
  async function handleXemDacTa(specId: string): Promise<string> {
    const matches = await searchMarkdownFiles(specId);
    return JSON.stringify(matches, null, 2);
  }

  /**
   * Handles luu_danh_gia — saves a new verification review.
   * @param params - Review data.
   * @returns Success message with file path.
   */
  async function handleLuuDanhGia(params: {
    projectName: string;
    title: string;
    completeness: string;
    correctness: string;
    coherence: string;
    constraints: string;
    blastRadius: string;
    summary: string;
  }): Promise<string> {
    const { projectName, title, completeness, correctness, coherence, constraints, blastRadius, summary } = params;
    const resolvedProject = await resolveProjectName(projectName);

    const date = new Date().toISOString().split('T')[0];
    const fileName = `${date}-${toSlug(title)}.md`;
    const targetPath = `projects/${resolvedProject}/reviews/${fileName}`;

    const content = [
      '---',
      `id: REV-${date}-${Math.floor(100 + Math.random() * 900)}`,
      `date: "${date}"`,
      `author: AI-Agent`,
      `project: ${projectName}`,
      `tags: [review, verification]`,
      '---',
      '',
      `# Verification Report: ${title}`,
      '',
      '## 5-Dimension Assessment',
      `| Dimension | Status |`,
      `|-----------|--------|`,
      `| D1: Completeness | ${completeness} |`,
      `| D2: Correctness | ${correctness} |`,
      `| D3: Coherence | ${coherence} |`,
      `| D4: Constraints | ${constraints} |`,
      `| D5: Blast Radius | ${blastRadius} |`,
      '',
      '## Summary',
      summary,
    ].join('\n');

    await provider.writeFile(targetPath, content);
    return `✅ Verification report successfully saved to: ${targetPath}`;
  }

  /**
   * Handles doc_tai_lieu — reads any file.
   */
  async function handleDocTaiLieu(path: string): Promise<string> {
    const raw = await provider.readFile(path);
    if (!raw) return `Error: File not found at ${path}`;
    return raw;
  }

  /**
   * Handles sua_tai_lieu — edits a file and updates the changelog frontmatter.
   */
  async function handleSuaTaiLieu(params: { path: string; content: string; author: string; reason: string; impact: string }): Promise<string> {
    const { path, content, author, reason, impact } = params;
    
    let raw = await provider.readFile(path);
    let doc: ParsedMarkdown;
    if (raw) {
      const parsed = matter(raw);
      doc = { frontmatter: parsed.data, content: parsed.content };
    } else {
      doc = { frontmatter: {}, content: '' };
    }
    
    let finalContent = content;
    if (content.trim().startsWith('---')) {
      const newParsed = matter(content);
      doc.frontmatter = { ...doc.frontmatter, ...newParsed.data };
      finalContent = newParsed.content;
    }

    if (!doc.frontmatter.changelog) {
      doc.frontmatter.changelog = [];
    }
    
    const date = new Date().toISOString();
    doc.frontmatter.changelog.push({ date, author, reason, impact });
    
    const fullText = matter.stringify(finalContent, doc.frontmatter);
    await provider.writeFile(path, fullText);
    
    return `✅ File ${path} successfully updated and changelog appended.`;
  }

  return {
    readMarkdown,
    searchMarkdownFiles,
    handleXemTongQuan,
    handleXemNguCanhDuAn,
    handleTimKiemKienThuc,
    handleXemMauThietKe,
    handleXemQuyetDinh,
    handleXemBaiHoc,
    handleDanhSachPhienGanDay,
    handleLuuPhienLamViec,
    handleLuuBaiHoc,
    handleLuuTruKienThuc,
    handlePhucHoiKienThuc,
    handleXemBieuMau,
    handleXemKhaoSat,
    handleXemDacTa,
    handleLuuDanhGia,
    handleDocTaiLieu,
    handleSuaTaiLieu,
  };
}

/** Type helper for the handlers object */
export type ToolHandlers = ReturnType<typeof createToolHandlers>;
