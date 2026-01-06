#!/bin/bash

# 获取当前绝对路径
CURRENT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DIST_PATH="$CURRENT_DIR/dist/index.js"

echo "=== InfoDesign MCP Server Setup ==="
echo "Building project..."
npm run build

echo ""
echo "=== MCP Configuration ==="
echo "Please add the following configuration to your MCP client (Claude Desktop / Trae):"
echo ""
echo "{"
echo "  \"mcpServers\": {"
echo "    \"infodesign\": {"
echo "      \"command\": \"node\","
echo "      \"args\": ["
echo "        \"$DIST_PATH\""
echo "      ],"
echo "      \"env\": {"
echo "        \"NODE_ENV\": \"production\""
echo "      }"
echo "    }"
echo "  }"
echo "}"
echo ""
echo "Setup complete. Copy the JSON above to your config file."
