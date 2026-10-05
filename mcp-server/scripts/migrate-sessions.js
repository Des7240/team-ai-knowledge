import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { globSync } from 'glob';

function migrateSessions() {
  const kbRoot = path.resolve(import.meta.dirname, '..', '..');
  const sessionFiles = globSync('projects/*/sessions/*.md', { cwd: kbRoot });

  const projectMap = {}; // { projectName: { epicName: [ { date, title, fileName } ] } }

  for (const relPath of sessionFiles) {
    const fullPath = path.join(kbRoot, relPath);
    const content = fs.readFileSync(fullPath, 'utf8');
    const doc = matter(content);

    const parts = relPath.split(/[\\/]/);
    const projectName = parts[1];
    const fileName = parts[3];

    let epic = doc.data.epic;
    let modified = false;

    if (!epic) {
      epic = 'Legacy';
      doc.data.epic = epic;
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(fullPath, matter.stringify(doc.content, doc.data));
      console.log(`Updated frontmatter for ${relPath}`);
    }

    // Prepare data for SESSION_INDEX.md
    if (!projectMap[projectName]) {
      projectMap[projectName] = {};
    }
    if (!projectMap[projectName][epic]) {
      projectMap[projectName][epic] = [];
    }

    const date = doc.data.date || fileName.substring(0, 10);
    const title = doc.data.title || fileName.replace('.md', '');
    
    projectMap[projectName][epic].push({ date, title, fileName });
  }

  // Rewrite SESSION_INDEX.md for each project
  for (const [projectName, epics] of Object.entries(projectMap)) {
    const indexPath = path.join(kbRoot, 'projects', projectName, 'SESSION_INDEX.md');
    let indexContent = `# Bảng theo dõi Phiên làm việc\n\n`;

    for (const [epic, sessions] of Object.entries(epics)) {
      indexContent += `## [Epic] ${epic}\n\n`;
      // Sort sessions by date descending
      sessions.sort((a, b) => b.date.localeCompare(a.date));
      for (const session of sessions) {
        indexContent += `- [${session.date} - ${session.title}](./sessions/${session.fileName})\n`;
      }
      indexContent += '\n';
    }

    fs.writeFileSync(indexPath, indexContent);
    console.log(`Re-generated SESSION_INDEX.md for project: ${projectName}`);
  }
}

migrateSessions();
