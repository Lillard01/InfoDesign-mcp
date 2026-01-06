import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

async function run() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'] // Often needed in docker/environments
  });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err));
  page.on('request', request => console.log('REQ:', request.url()));
  page.on('requestfailed', request => console.log('REQ FAILED:', request.url(), request.failure()?.errorText));

  const bundlePath = path.resolve('dist/client-bundle.js');
  console.log('Loading bundle from:', bundlePath);
  
  await page.setContent('<!DOCTYPE html><html><body><div id="container"></div></body></html>');
  
  // Inject bundle
  await page.addScriptTag({ path: bundlePath });
  
  const spec = `
infographic list-grid-compact-card
data
  items:
    - title: Item 1
      description: Description 1
    - title: Item 2
      description: Description 2
`;

  console.log('Rendering...');
  try {
    const svg = await page.evaluate(async (s) => {
      // @ts-ignore
      return await window.renderInfographic(s);
    }, spec);
    
    console.log('--- SVG OUTPUT START ---');
    console.log(svg);
    console.log('--- SVG OUTPUT END ---');
  } catch (e) {
    console.error('Render failed:', e);
  }
  
  await browser.close();
}

run().catch(console.error);
