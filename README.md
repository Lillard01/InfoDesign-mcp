# InfoDesign MCP Server

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/language-TypeScript-blue.svg)
![MCP](https://img.shields.io/badge/MCP-Compatible-green.svg)

这是一个基于 [@antv/infographic](https://github.com/antvis/Infographic) 的 [Model Context Protocol (MCP)](https://modelcontextprotocol.io) 服务，旨在通过 LLM 快速生成高质量的信息可视化图表。

它能够将自然语言描述转化为结构化的 Infographic DSL，并渲染为 SVG 格式，特别适用于生成流程图、架构图、对比图等信息图表。

## ✨ 功能特性

- **Render Infographic**: 将 DSL 文本规范渲染为 SVG 图形。
- **Render Architecture**: 专门针对架构图、组织结构图优化的渲染入口。
- **List Templates**: 获取并分类展示可用的可视化模板，支持按信息组织逻辑筛选：
  - `递进 (Progression)`: 步骤、流程、时间线
  - `对比 (Contrast)`: 方案对比、优劣势
  - `对齐架构图 (Aligned Architecture)`: 系统架构、组织结构、思维导图
  - `总分 (Hierarchy)`: 父子集包含关系、核心与分支层级
  - `列举 (List)`: 清单、网格
  - `图表 (Chart)`: 统计图表
  - `关系 (Relationship)`: 关联、循环、网络
  - `四象限 (Quadrant)`: 矩阵分布

## 🚀 快速开始

### 1. 安装与构建

```bash
# 克隆项目
git clone https://github.com/Lillard01/InfoDesign-mcp.git
cd InfoDesign-mcp

# 安装依赖
npm install

# 构建项目
npm run build
```

### 2. MCP 接入配置

请将以下配置添加到您的 MCP 客户端配置文件中（如 Claude Desktop 或 Trae）：

**Claude Desktop / Trae Config:**

```json
{
  "mcpServers": {
    "infodesign": {
      "command": "node",
      "args": [
        "/path/to/InfoDesign-mcp/dist/index.js"
      ],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```
*注意：请将 `/path/to/InfoDesign-mcp` 替换为实际的绝对路径。*

## 🛠 工具详情

### `list_templates`
获取可用模板列表。
- 参数 `category` (可选): 筛选类别。例如：`对齐架构图 (Aligned Architecture)`。

### `render_architecture_diagram`
专门用于渲染架构图。
- 参数 `spec` (必填): Infographic DSL 字符串。

### `render_infographic`
通用渲染工具。
- 参数 `spec` (必填): Infographic DSL 字符串。

## 💻 开发调试

- **提取最新模板**: 
  ```bash
  npx tsx scripts/extract-templates.ts
  ```
  该脚本会自动从 `@antv/infographic` 中提取模版并更新 `src/templates.json`。

- **调试渲染**: 
  ```bash
  npx tsx scripts/debug-render-puppeteer.ts
  ```

## 🤝 贡献指南 (Contributing)

欢迎提交 Issue 和 Pull Request！详细信息请参考 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 📄 许可证 (License)

本项目采用 MIT 许可证。详情请见 [LICENSE](LICENSE) 文件。
