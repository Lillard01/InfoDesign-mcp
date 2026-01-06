import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface TemplateCategory {
  category: string;
  description: string;
  keywords: string[];
}

const CATEGORIES: TemplateCategory[] = [
  {
    category: '递进 (Progression)',
    description: '展示步骤、流程、时间线或顺序关系',
    keywords: ['sequence', 'step', 'process', 'timeline', 'roadmap', 'arrow', 'flow']
  },
  {
    category: '对比 (Contrast)',
    description: '对比两个或多个项目的差异或优劣',
    keywords: ['compare', 'vs', 'contrast', 'pros-cons']
  },
  {
    category: '对齐架构图 (Aligned Architecture)',
    description: '展示系统架构、组织结构或思维导图',
    keywords: ['structure', 'mindmap', 'tree', 'organization']
  },
  {
    category: '总分 (Hierarchy)',
    description: '展示信息内容的父子集包含关系、核心与分支的层级关系',
    keywords: ['hierarchy', 'pyramid', 'inclusion', 'subset', 'level']
  },
  {
    category: '列举 (List)',
    description: '并列展示多个项目，无明显顺序或层级',
    keywords: ['list', 'grid', 'collection', 'catalog']
  },
  {
    category: '图表 (Chart)',
    description: '数据可视化图表',
    keywords: ['chart', 'bar', 'column', 'line', 'pie', 'wordcloud']
  },
  {
    category: '关系 (Relationship)',
    description: '展示元素间的关联、循环或网络关系',
    keywords: ['relation', 'cycle', 'network']
  },
  {
    category: '四象限 (Quadrant)',
    description: '展示四象限分布或矩阵关系',
    keywords: ['quadrant', 'matrix']
  },
  {
    category: '其他 (Other)',
    description: '未分类的模板',
    keywords: []
  }
];

function classifyTemplate(name: string): string {
  const lowerName = name.toLowerCase();
  for (const cat of CATEGORIES) {
    if (cat.keywords.some(k => lowerName.includes(k))) {
      return cat.category;
    }
  }
  return '其他 (Other)';
}

async function run() {
  console.log('Launching browser to extract templates...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  const bundlePath = path.resolve(__dirname, '../dist/client-bundle.js');
  
  await page.setContent('<!DOCTYPE html><html><body><div id="container"></div></body></html>');
  await page.addScriptTag({ path: bundlePath });
  
  const templates = await page.evaluate(() => {
    // @ts-ignore
    return window.getTemplateList();
  });
  
  await browser.close();

  console.log(`Extracted ${templates.length} templates.`);

  const categorizedTemplates: Record<string, string[]> = {};
  
  // Initialize categories
  CATEGORIES.forEach(c => categorizedTemplates[c.category] = []);

  templates.forEach((t: string) => {
    const cat = classifyTemplate(t);
    categorizedTemplates[cat].push(t);
  });

  // Remove empty categories if any (except Other)
  // Object.keys(categorizedTemplates).forEach(k => {
  //   if (categorizedTemplates[k].length === 0 && k !== '其他 (Other)') {
  //     delete categorizedTemplates[k];
  //   }
  // });

  const outputPath = path.resolve(__dirname, '../src/templates.json');
  fs.writeFileSync(outputPath, JSON.stringify(categorizedTemplates, null, 2));
  console.log(`Templates saved to ${outputPath}`);
  
  // Also print a summary
  Object.entries(categorizedTemplates).forEach(([cat, list]) => {
      console.log(`${cat}: ${list.length} templates`);
  });
}

run().catch(console.error);
