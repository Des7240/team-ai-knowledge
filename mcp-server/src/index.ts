/**
 * MCP Server Entry Point — Dual-mode: stdio (local) + HTTP (remote).
 *
 * Auto-detects mode based on environment variables:
 * - GITHUB_TOKEN present → HTTP mode + GitHubProvider
 * - Otherwise → stdio mode + LocalProvider
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createMcpExpressApp } from '@modelcontextprotocol/sdk/server/express.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import path from 'path';

import { LocalProvider } from './providers/localProvider.js';
import { GitHubProvider } from './providers/gitHubProvider.js';
import type { DataProvider } from './providers/dataProvider.js';
import { createToolHandlers, type ToolHandlers } from './tools/toolHandlers.js';
import { analyzeIntent, type TaskType, type ToolIntent } from './tools/intentAnalyzer.js';

const SERVER_VERSION = '2.0.0';

/**
 * Detects which mode to run based on env variables.
 * @returns 'http' if GitHub credentials found, 'stdio' otherwise.
 */
function detectMode(): 'http' | 'stdio' {
  return process.env.GITHUB_TOKEN ? 'http' : 'stdio';
}

/**
 * Creates the appropriate DataProvider based on mode.
 * @param mode - 'http' or 'stdio'.
 * @returns DataProvider instance.
 */
function createProvider(mode: 'http' | 'stdio'): DataProvider {
  if (mode === 'http') {
    const token = process.env.GITHUB_TOKEN!;
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH || 'main';

    if (!owner || !repo) {
      throw new Error('GITHUB_OWNER and GITHUB_REPO are required in HTTP mode');
    }

    return new GitHubProvider({ token, owner, repo, branch });
  }

  const kbRoot = process.env.KB_ROOT || path.join(import.meta.dirname, '..', '..');
  return new LocalProvider(kbRoot);
}

/**
 * Tool definitions for MCP ListTools.
 */
const TOOL_DEFINITIONS = [
  {
    name: 'get_overview',
    description: 'Get global Knowledge Base overview, rules, global patterns, and list of projects.',
    inputSchema: { type: 'object' as const, properties: {} },
  },
  {
    name: 'get_project_context',
    description: 'Get context and overview documents for a specific project.',
    inputSchema: {
      type: 'object' as const,
      properties: { projectName: { type: 'string', description: 'Target project name' } },
      required: ['projectName'],
    },
  },
  {
    name: 'search_knowledge',
    description: 'Search knowledge base documents by query string and optional project.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        query: { type: 'string', description: 'Keyword query' },
        projectName: { type: 'string', description: 'Optional project filter' },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_pattern',
    description: 'Fetch design pattern by ID (e.g. PAT-001) or search query.',
    inputSchema: {
      type: 'object' as const,
      properties: { patternId: { type: 'string', description: 'Pattern ID or name' } },
      required: ['patternId'],
    },
  },
  {
    name: 'get_decision',
    description: 'Fetch Architecture Decision Record (ADR) by ID (e.g. ADR-0001).',
    inputSchema: {
      type: 'object' as const,
      properties: { decisionId: { type: 'string', description: 'ADR ID' } },
      required: ['decisionId'],
    },
  },
  {
    name: 'get_lesson',
    description: 'Fetch lesson learned record by ID or query.',
    inputSchema: {
      type: 'object' as const,
      properties: { lessonId: { type: 'string', description: 'Lesson ID' } },
      required: ['lessonId'],
    },
  },
  {
    name: 'list_recent_sessions',
    description: 'List AI session summaries from recent days.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        days: { type: 'number', description: 'Number of recent days (default: 3)' },
        projectName: { type: 'string', description: 'Optional project name' },
      },
    },
  },
  {
    name: 'save_session',
    description: 'Save a new session summary markdown file for a project.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        projectName: { type: 'string', description: 'Project name' },
        title: { type: 'string', description: 'Session title' },
        goals: { type: 'array', items: { type: 'string' }, description: 'Session goals' },
        filesChanged: { type: 'array', items: { type: 'string' }, description: 'Files modified' },
        summary: { type: 'string', description: 'Detailed session summary body' },
      },
      required: ['projectName', 'title', 'goals', 'summary'],
    },
  },
  {
    name: 'save_lesson',
    description: 'Save a new lesson learned file to team knowledge base.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        title: { type: 'string', description: 'Lesson title' },
        scope: { type: 'string', description: 'Scope (backend, frontend, devops, etc.)' },
        severity: { type: 'string', description: 'Severity (low, medium, high, critical)' },
        resolution: { type: 'string', description: 'Resolution (resolved, workaround)' },
        problem: { type: 'string', description: 'Problem description' },
        solution: { type: 'string', description: 'Solution details' },
      },
      required: ['title', 'scope', 'severity', 'resolution', 'problem', 'solution'],
    },
  },
  {
    name: 'archive_knowledge',
    description: 'Archive a knowledge base file (moves to archive folder and marks as superseded).',
    inputSchema: {
      type: 'object' as const,
      properties: {
        path: { type: 'string', description: 'Relative path of the file to archive' },
        reason: { type: 'string', description: 'Optional reason for archiving' },
      },
      required: ['path'],
    },
  },
  {
    name: 'restore_knowledge',
    description: 'Restore an archived knowledge base file to its active location.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        path: { type: 'string', description: 'Relative path of the archived file' },
      },
      required: ['path'],
    },
  },
  {
    name: 'auto_context',
    description:
      'Smart orchestrator — automatically analyzes chat context and calls the most relevant KB tools. ' +
      'Provide a summary of the current conversation/task and optionally a project name and task type. ' +
      'Returns aggregated results from multiple KB tools based on intent analysis.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        chatContext: {
          type: 'string',
          description: 'Summary or raw text of the current conversation/task context',
        },
        projectName: {
          type: 'string',
          description: 'Optional project name to scope the search',
        },
        taskType: {
          type: 'string',
          enum: ['coding', 'debug', 'architecture', 'general'],
          description: 'Optional task type hint to improve tool selection accuracy',
        },
      },
      required: ['chatContext'],
    },
  },
];

/**
 * Registers MCP request handlers on the server.
 * @param server - MCP Server instance.
 * @param handlers - Tool handlers bound to a DataProvider.
 */
function registerHandlers(server: Server, handlers: ToolHandlers): void {
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOL_DEFINITIONS,
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      switch (name) {
        case 'get_overview':
          return { content: [{ type: 'text' as const, text: await handlers.handleGetOverview() }] };

        case 'get_project_context': {
          const { projectName } = args as { projectName: string };
          return { content: [{ type: 'text' as const, text: await handlers.handleGetProjectContext(projectName) }] };
        }

        case 'search_knowledge': {
          const { query, projectName } = args as { query: string; projectName?: string };
          return { content: [{ type: 'text' as const, text: await handlers.handleSearchKnowledge(query, projectName) }] };
        }

        case 'get_pattern': {
          const { patternId } = args as { patternId: string };
          return { content: [{ type: 'text' as const, text: await handlers.handleGetPattern(patternId) }] };
        }

        case 'get_decision': {
          const { decisionId } = args as { decisionId: string };
          return { content: [{ type: 'text' as const, text: await handlers.handleGetDecision(decisionId) }] };
        }

        case 'get_lesson': {
          const { lessonId } = args as { lessonId: string };
          return { content: [{ type: 'text' as const, text: await handlers.handleGetLesson(lessonId) }] };
        }

        case 'list_recent_sessions':
          return { content: [{ type: 'text' as const, text: await handlers.handleListRecentSessions() }] };

        case 'save_session': {
          const sessionParams = args as {
            projectName: string;
            title: string;
            goals: string[];
            filesChanged?: string[];
            summary: string;
          };
          return { content: [{ type: 'text' as const, text: await handlers.handleSaveSession(sessionParams) }] };
        }

        case 'save_lesson': {
          const lessonParams = args as {
            title: string;
            scope: string;
            severity: string;
            resolution: string;
            problem: string;
            solution: string;
          };
          return { content: [{ type: 'text' as const, text: await handlers.handleSaveLesson(lessonParams) }] };
        }

        case 'archive_knowledge': {
          const { path, reason } = args as { path: string; reason?: string };
          return { content: [{ type: 'text' as const, text: await handlers.handleArchiveKnowledge(path, reason) }] };
        }

        case 'restore_knowledge': {
          const { path } = args as { path: string };
          return { content: [{ type: 'text' as const, text: await handlers.handleRestoreKnowledge(path) }] };
        }

        case 'auto_context': {
          const { chatContext, projectName, taskType } = args as {
            chatContext: string;
            projectName?: string;
            taskType?: TaskType;
          };

          const intents = analyzeIntent({ chatContext, projectName, taskType });

          const toolResults = await Promise.all(
            intents.map(async (intent) => ({
              tool: intent.toolName,
              score: intent.score,
              params: intent.extractedParams,
              result: await executeToolIntent(intent, handlers),
            }))
          );

          const detectedIntents = intents.map((i) => i.toolName);
          const totalResults = toolResults.reduce((acc, tr) => {
            try {
              const parsed = JSON.parse(tr.result);
              return acc + (Array.isArray(parsed) ? parsed.length : 1);
            } catch {
              return acc + (tr.result.length > 0 ? 1 : 0);
            }
          }, 0);

          const response = {
            intent_analysis: {
              detected_intents: detectedIntents,
              task_type: taskType || 'auto-detected',
              project: projectName || 'all',
              tools_called: intents.length,
            },
            tools_called: toolResults,
            summary: `Analyzed context → called ${intents.length} tool(s): [${detectedIntents.join(', ')}]. Found ${totalResults} result(s) total.`,
          };

          return {
            content: [{ type: 'text' as const, text: JSON.stringify(response, null, 2) }],
          };
        }

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error: any) {
      console.error(`[CallToolError] Tool '${name}' failed:`, error);
      return {
        isError: true,
        content: [{ type: 'text' as const, text: `Error executing tool '${name}': ${error.message}` }],
      };
    }
  });
}

/**
 * Executes a single tool intent from auto_context.
 * @param intent - Tool intent from the analyzer.
 * @param handlers - Tool handler functions.
 * @returns Result string.
 */
async function executeToolIntent(intent: ToolIntent, handlers: ToolHandlers): Promise<string> {
  const { toolName, extractedParams: params } = intent;

  try {
    switch (toolName) {
      case 'get_overview':
        return await handlers.handleGetOverview();
      case 'get_project_context':
        return await handlers.handleGetProjectContext(params.projectName as string);
      case 'search_knowledge':
        return await handlers.handleSearchKnowledge(
          params.query as string,
          params.projectName as string | undefined
        );
      case 'get_pattern':
        return await handlers.handleGetPattern(params.patternId as string);
      case 'get_decision':
        return await handlers.handleGetDecision(params.decisionId as string);
      case 'get_lesson':
        return await handlers.handleGetLesson(params.lessonId as string);
      case 'list_recent_sessions':
        return await handlers.handleListRecentSessions(
          params.days as number | undefined,
          params.projectName as string | undefined
        );
      case 'archive_knowledge':
        return await handlers.handleArchiveKnowledge(params.path as string, params.reason as string | undefined);
      case 'restore_knowledge':
        return await handlers.handleRestoreKnowledge(params.path as string);
      default:
        return `Unknown tool: ${toolName}`;
    }
  } catch (error: any) {
    console.error(`[executeToolIntent] Error executing ${toolName}:`, error);
    return `Error executing ${toolName}: ${error.message}`;
  }
}

/**
 * Starts MCP Server in stdio mode (local development).
 * @param handlers - Tool handlers.
 */
async function startStdioMode(handlers: ToolHandlers): Promise<void> {
  const server = new Server(
    { name: 'team-ai-knowledge-server', version: SERVER_VERSION },
    { capabilities: { tools: {} } }
  );

  registerHandlers(server, handlers);

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`🚀 MCP Server v${SERVER_VERSION} running on stdio`);
}

/**
 * Starts MCP Server in HTTP mode (remote / Render).
 * @param handlers - Tool handlers.
 */
async function startHttpMode(handlers: ToolHandlers): Promise<void> {
  const port = parseInt(process.env.PORT || '3100', 10);

  const app = createMcpExpressApp({ host: '0.0.0.0' });

  app.post('/mcp', async (req, res) => {
    const server = new Server(
      { name: 'team-ai-knowledge-server', version: SERVER_VERSION },
      { capabilities: { tools: {} } }
    );

    registerHandlers(server, handlers);

    try {
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined, // stateless
      });

      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);

      res.on('close', () => {
        transport.close();
        server.close();
      });
    } catch (error: any) {
      console.error('[HTTP] Error handling MCP request:', error);
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: '2.0',
          error: { code: -32603, message: 'Internal server error' },
          id: null,
        });
      }
    }
  });

  app.get('/mcp', async (_req, res) => {
    res.writeHead(405).end(JSON.stringify({
      jsonrpc: '2.0',
      error: { code: -32000, message: 'Method not allowed.' },
      id: null,
    }));
  });

  app.delete('/mcp', async (_req, res) => {
    res.writeHead(405).end(JSON.stringify({
      jsonrpc: '2.0',
      error: { code: -32000, message: 'Method not allowed.' },
      id: null,
    }));
  });

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', version: SERVER_VERSION, mode: 'http' });
  });

  app.listen(port, () => {
    console.error(`🚀 MCP Server v${SERVER_VERSION} running on HTTP at port ${port}`);
  });
}

/**
 * Main entry point — auto-detects mode and starts server.
 */
async function main(): Promise<void> {
  const mode = detectMode();
  const provider = createProvider(mode);
  const handlers = createToolHandlers(provider);

  console.error(`[Mode] ${mode.toUpperCase()} detected`);

  // Warm up cache in HTTP mode
  if (mode === 'http' && 'warmUp' in provider) {
    await (provider as GitHubProvider).warmUp();
  }

  if (mode === 'http') {
    await startHttpMode(handlers);
  } else {
    await startStdioMode(handlers);
  }
}

main().catch((error) => {
  console.error('[Fatal Error] MCP Server failed to start:', error);
  process.exit(1);
});
