import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import {
  handleGetOverview,
  handleGetProjectContext,
  handleSearchKnowledge,
  handleGetPattern,
  handleGetDecision,
  handleGetLesson,
  handleListRecentSessions,
  handleSaveSession,
  handleSaveLesson,
} from './tools/toolHandlers.js';
import { analyzeIntent, type TaskType, type ToolIntent } from './tools/intentAnalyzer.js';

const server = new Server(
  { name: 'team-ai-knowledge-server', version: '1.1.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_overview',
        description: 'Get global Knowledge Base overview, rules, global patterns, and list of projects.',
        inputSchema: { type: 'object', properties: {} },
      },
      {
        name: 'get_project_context',
        description: 'Get context and overview documents for a specific project.',
        inputSchema: {
          type: 'object',
          properties: { projectName: { type: 'string', description: 'Target project name' } },
          required: ['projectName'],
        },
      },
      {
        name: 'search_knowledge',
        description: 'Search knowledge base documents by query string and optional project.',
        inputSchema: {
          type: 'object',
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
          type: 'object',
          properties: { patternId: { type: 'string', description: 'Pattern ID or name' } },
          required: ['patternId'],
        },
      },
      {
        name: 'get_decision',
        description: 'Fetch Architecture Decision Record (ADR) by ID (e.g. ADR-0001).',
        inputSchema: {
          type: 'object',
          properties: { decisionId: { type: 'string', description: 'ADR ID' } },
          required: ['decisionId'],
        },
      },
      {
        name: 'get_lesson',
        description: 'Fetch lesson learned record by ID or query.',
        inputSchema: {
          type: 'object',
          properties: { lessonId: { type: 'string', description: 'Lesson ID' } },
          required: ['lessonId'],
        },
      },
      {
        name: 'list_recent_sessions',
        description: 'List AI session summaries from recent days.',
        inputSchema: {
          type: 'object',
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
          type: 'object',
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
          type: 'object',
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
        name: 'auto_context',
        description:
          'Smart orchestrator — automatically analyzes chat context and calls the most relevant KB tools. ' +
          'Provide a summary of the current conversation/task and optionally a project name and task type. ' +
          'Returns aggregated results from multiple KB tools based on intent analysis.',
        inputSchema: {
          type: 'object',
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
    ],
  };
});

/**
 * Executes a single tool intent and returns the result string.
 * @param {ToolIntent} intent - Tool intent from the analyzer.
 * @returns {string} Result of the tool execution.
 */
function executeToolIntent(intent: ToolIntent): string {
  const { toolName, extractedParams: params } = intent;

  try {
    switch (toolName) {
      case 'get_overview':
        return handleGetOverview();
      case 'get_project_context':
        return handleGetProjectContext(params.projectName as string);
      case 'search_knowledge':
        return handleSearchKnowledge(
          params.query as string,
          params.projectName as string | undefined
        );
      case 'get_pattern':
        return handleGetPattern(params.patternId as string);
      case 'get_decision':
        return handleGetDecision(params.decisionId as string);
      case 'get_lesson':
        return handleGetLesson(params.lessonId as string);
      case 'list_recent_sessions':
        return handleListRecentSessions(
          params.days as number | undefined,
          params.projectName as string | undefined
        );
      default:
        return `Unknown tool: ${toolName}`;
    }
  } catch (error: any) {
    console.error(`[executeToolIntent] Error executing ${toolName}:`, error);
    return `Error executing ${toolName}: ${error.message}`;
  }
}

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'get_overview') {
      return { content: [{ type: 'text', text: handleGetOverview() }] };
    }

    if (name === 'get_project_context') {
      const { projectName } = args as { projectName: string };
      return { content: [{ type: 'text', text: handleGetProjectContext(projectName) }] };
    }

    if (name === 'search_knowledge') {
      const { query, projectName } = args as { query: string; projectName?: string };
      return { content: [{ type: 'text', text: handleSearchKnowledge(query, projectName) }] };
    }

    if (name === 'get_pattern') {
      const { patternId } = args as { patternId: string };
      return { content: [{ type: 'text', text: handleGetPattern(patternId) }] };
    }

    if (name === 'get_decision') {
      const { decisionId } = args as { decisionId: string };
      return { content: [{ type: 'text', text: handleGetDecision(decisionId) }] };
    }

    if (name === 'get_lesson') {
      const { lessonId } = args as { lessonId: string };
      return { content: [{ type: 'text', text: handleGetLesson(lessonId) }] };
    }

    if (name === 'list_recent_sessions') {
      return { content: [{ type: 'text', text: handleListRecentSessions() }] };
    }

    if (name === 'save_session') {
      const params = args as {
        projectName: string;
        title: string;
        goals: string[];
        filesChanged?: string[];
        summary: string;
      };
      return { content: [{ type: 'text', text: handleSaveSession(params) }] };
    }

    if (name === 'save_lesson') {
      const params = args as {
        title: string;
        scope: string;
        severity: string;
        resolution: string;
        problem: string;
        solution: string;
      };
      return { content: [{ type: 'text', text: handleSaveLesson(params) }] };
    }

    if (name === 'auto_context') {
      const { chatContext, projectName, taskType } = args as {
        chatContext: string;
        projectName?: string;
        taskType?: TaskType;
      };

      // Step 1: Analyze intent
      const intents = analyzeIntent({ chatContext, projectName, taskType });

      // Step 2: Execute each tool and collect results
      const toolResults = intents.map((intent) => ({
        tool: intent.toolName,
        score: intent.score,
        params: intent.extractedParams,
        result: executeToolIntent(intent),
      }));

      // Step 3: Build summary
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
        content: [{ type: 'text', text: JSON.stringify(response, null, 2) }],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error: any) {
    console.error(`[CallToolError] Tool '${name}' failed:`, error);
    return {
      isError: true,
      content: [{ type: 'text', text: `Error executing tool '${name}': ${error.message}` }],
    };
  }
});

/**
 * Starts the MCP Server.
 * @returns {Promise<void>}
 */
async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('🚀 Team AI Knowledge Base MCP Server v1.1.0 running on stdio');
}

runServer().catch((error) => {
  console.error('[Fatal Error] MCP Server failed to start:', error);
  process.exit(1);
});
