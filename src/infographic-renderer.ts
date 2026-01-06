import puppeteer, { Browser, Page } from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Fix __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class InfographicRenderer {
  private browser: Browser | null = null;
  private bundlePath: string;

  constructor() {
    this.bundlePath = path.resolve(__dirname, '../dist/client-bundle.js');
  }

  async init() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }
  }

  async render(spec: string): Promise<string> {
    if (!this.browser) await this.init();
    
    const page = await this.browser!.newPage();
    try {
        // Optional: Mirror logs for debugging
        // page.on('console', msg => console.error('PAGE LOG:', msg.text()));
        // page.on('pageerror', err => console.error('PAGE ERROR:', err));
        
        await page.setContent('<!DOCTYPE html><html><body><div id="container" style="width:800px;height:600px;"></div></body></html>');
        
        // Ensure bundle exists
        if (!fs.existsSync(this.bundlePath)) {
            throw new Error(`Bundle not found at ${this.bundlePath}. Please run 'npm run build' first.`);
        }

        await page.addScriptTag({ path: this.bundlePath });
        
        const svg = await page.evaluate(async (s) => {
            // @ts-ignore
            if (window.renderInfographic) {
                // @ts-ignore
                return await window.renderInfographic(s);
            } else {
                throw new Error("renderInfographic function not found in window");
            }
        }, spec);
        
        return svg as string;
    } finally {
        await page.close();
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}
