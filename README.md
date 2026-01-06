# InfoDesign MCP Server

这是一个基于 @antv/infographic 的 MCP 服务，旨在通过 LLM 快速生成高质量的信息可视化图表。

## 功能特性

- **Render Infographic**: 将 DSL 文本规范渲染为 SVG 图形。
- **List Templates**: 获取并分类展示可用的可视化模板，支持按信息组织逻辑（递进、对比、总分等）筛选。

## 快速开始

### 1. 安装与构建

```bash
npm install
npm run build
```

### 2. MCP 接入配置

请将以下配置添加到您的 MCP 客户端配置文件中（如 Claude Desktop 或 Trae）：

```json
{
  "mcpServers": {
    "infodesign": {
      "command": "node",
      "args": [
        "/Users/wangdada/Downloads/mcp/InfoDesign-mcp/dist/index.js"
      ],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

## 工具详情

### `list_templates`
获取可用模板列表。
- 参数 `category` (可选): 筛选类别。支持值：
  - `递进 (Progression)`: 步骤、流程、时间线
  - `对比 (Contrast)`: 方案对比、优劣势
  - `对齐架构图 (Aligned Architecture)`: 系统架构、组织结构、思维导图
  - `总分 (Hierarchy)`: 父子集包含关系、核心与分支层级
  - `列举 (List)`: 清单、网格
  - `图表 (Chart)`: 统计图表
  - `关系 (Relationship)`: 关联、循环、网络
  - `四象限 (Quadrant)`: 矩阵分布

### `render_architecture_diagram`
专门用于渲染架构图。
- 参数 `spec` (必填): Infographic DSL 字符串。

### `render_infographic`
通用渲染工具。
- 参数 `spec` (必填): Infographic DSL 字符串。

## 开发调试

- 提取最新模板: `npx tsx scripts/extract-templates.ts`
- 调试渲染: `npx tsx scripts/debug-render-puppeteer.ts`
