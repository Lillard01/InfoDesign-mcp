import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html><html><body><div id="container"></div></body></html>', {
  pretendToBeVisual: true,
  resources: 'usable'
});

global.window = dom.window as any;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;
global.SVGElement = dom.window.SVGElement;
global.Element = dom.window.Element;
Object.defineProperty(global, 'navigator', {
  value: dom.window.navigator,
  writable: true
});

// RAF polyfill
(global as any).requestAnimationFrame = (callback: any) => {
    // console.log('RAF called');
    return setTimeout(callback, 16);
};
(global as any).cancelAnimationFrame = (id: any) => clearTimeout(id);

(global as any).ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
};
(global as any).window.matchMedia = (global as any).window.matchMedia || function() {
    return {
        matches: false,
        addListener: function() {},
        removeListener: function() {}
    };
};

async function run() {
  console.log('Importing Infographic...');
  // Dynamic import to ensure polyfills are active
  const { Infographic } = await import('@antv/infographic');
  console.log('Infographic imported.');
  
  const infographic = new Infographic({
    container: '#container',
    width: 800,
    height: 600,
    editable: false,
  });

  const spec = `
infographic list-row-simple-horizontal-arrow
data
  items:
    - label: Step 1
      desc: Start
    - label: Step 2
      desc: In Progress
    - label: Step 3
      desc: Complete
`;

  console.log('Starting render...');
  await infographic.render(spec);
  console.log('Render promise resolved.');
  
  // Wait for G rendering
  console.log('Waiting for async rendering...');
  await new Promise(resolve => setTimeout(resolve, 5000));

  const container = document.getElementById('container');
  if (container) {
     console.log('--- SVG OUTPUT START ---');
     console.log(container.innerHTML);
     console.log('--- SVG OUTPUT END ---');
     console.log('Container child nodes:', container.childNodes.length);
  } else {
     console.error('Container not found');
  }
}

run().catch(console.error);
