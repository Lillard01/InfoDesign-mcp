import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { InfographicRenderer } from './infographic-renderer.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load templates
const templatesPath = path.resolve(__dirname, 'templates.json');
let templatesData: Record<string, string[]> = {};
try {
  if (fs.existsSync(templatesPath)) {
    templatesData = JSON.parse(fs.readFileSync(templatesPath, 'utf-8'));
  } else {
    console.error(`Warning: templates.json not found at ${templatesPath}`);
  }
} catch (e) {
  console.error('Error loading templates.json:', e);
}

const server = new Server(
  {
    name: "infodesign-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const renderer = new InfographicRenderer();

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list_templates",
        description: "List available infographic templates, optionally filtered by category. Categories include: '递进 (Progression)', '对比 (Contrast)', '对齐架构图 (Aligned Architecture)', '总分 (Hierarchy)', '列举 (List)', '图表 (Chart)', '关系 (Relationship)', '四象限 (Quadrant)'. Note: '总分 (Hierarchy)' specifically targets parent-child subset relationships.",
        inputSchema: {
          type: "object",
          properties: {
            category: {
              type: "string",
              description: "Filter templates by category name (e.g., '对齐架构图 (Aligned Architecture)'). If omitted, returns all categories and their templates."
            }
          }
        }
      },
      {
        name: "render_architecture_diagram",
        description: "Specialized tool for rendering system architectures, organization charts, and mind maps. Automatically uses 'Aligned Architecture' templates logic. Input is a standard infographic spec.",
        inputSchema: {
          type: "object",
          properties: {
            spec: {
              type: "string",
              description: "The infographic specification (DSL). e.g. 'infographic hierarchy-structure\\ndata...'"
            }
          },
          required: ["spec"]
        }
      },
      {
        name: "render_infographic",
        description: "Render an infographic from a text specification using AntV Infographic. Returns SVG content string. Use list_templates to find suitable template names.",
        inputSchema: {
          type: "object",
          properties: {
            spec: {
              type: "string",
              description: "The infographic specification (DSL). e.g. 'infographic <template_name>\\ndata\\n  items:\\n    - title: Item 1\\n      description: Desc...'"
            }
          },
          required: ["spec"]
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "list_templates") {
    const category = request.params.arguments?.category as string;
    
    if (category) {
      if (templatesData[category]) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(templatesData[category], null, 2)
            }
          ]
        };
      } else {
         // Try partial match
         const matchedKey = Object.keys(templatesData).find(k => k.includes(category));
         if (matchedKey) {
             return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(templatesData[matchedKey], null, 2)
                    }
                ]
             };
         }
         return {
            content: [
              {
                type: "text",
                text: `Category '${category}' not found. Available categories: ${Object.keys(templatesData).join(', ')}`
              }
            ],
            isError: true
         };
      }
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(templatesData, null, 2)
        }
      ]
    };
  }

  if (request.params.name === "render_infographic" || request.params.name === "render_architecture_diagram") {
    const spec = request.params.arguments?.spec as string;
    if (!spec) {
      throw new Error("Missing 'spec' argument");
    }
    
    try {
      // Ensure renderer is initialized
      const svg = await renderer.render(spec);
      return {
        content: [
          {
            type: "text",
            text: svg || "<svg><!-- Empty Output --></svg>"
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `Error rendering infographic: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }
  
  throw new Error(`Unknown tool: ${request.params.name}`);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("InfoDesign MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main:", error);
  process.exit(1);
});
