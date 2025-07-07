#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as cheerio from 'cheerio';
const server = new McpServer({
    name: "title",
    version: "1.0.0",
});
async function getHtmlTitle(url) {
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);
    //console.log($('title').text());
    return $('title').text();
}
;

/*
server.tool(
  "title",
  "数値を11倍にする",
  { num: z.number().describe("数値") },
  ({ num }) => (
    {
      content: [{ type: "text", text: (num * 11).toString() }]
    }
  )
);
*/

server.tool("title", "与えられたURLのタイトルを返す", {
    url: z.string().describe("URL")
}, async ({ url }) => {
    const title = await getHtmlTitle(url);
    return {
        content: [
            {
                type: "text",
                text: title || "タイトルが見つかりません",
            }
        ]
    };
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Example MCP Server running on stdio");
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
