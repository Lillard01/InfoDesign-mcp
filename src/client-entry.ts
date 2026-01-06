import { Infographic, getTemplates } from '@antv/infographic';

(window as any).getTemplateList = () => {
  const templates = getTemplates();
  // templates is an array of strings (names) or objects. 
  // Based on previous log, it seems to be an object where keys are names or an array of names.
  // Previous log: "Available templates count: 212", "Templates with 'list': [...]"
  // Let's assume getTemplates() returns an array of template names (strings) based on the log output `JSHandle@array`.
  return templates;
};

(window as any).renderInfographic = async (spec: string) => {
  console.log('Available templates count:', Object.keys(getTemplates()).length);
  const templates = getTemplates();
   console.log('Templates with "list":', JSON.stringify(templates.filter((t: any) => typeof t === 'string' && t.includes('list')).slice(0, 10)));
   // console.log('First template:', JSON.stringify(templates[0]));
   // Try to find the one in the example
   const target = Object.values(templates).find((t: any) => t === 'list-row-simple-horizontal-arrow');
   console.log('Target template found:', !!target);
  console.log('renderInfographic called');
  const container = document.getElementById('container');
  if (!container) throw new Error('Container not found');
  
  container.innerHTML = '';
  
  const infographic = new Infographic({
    container: container as HTMLElement,
    width: 800,
    height: 600,
    editable: false,
  });

  console.log('Infographic instance created');
  try {
      await infographic.render(spec);
      console.log('infographic.render completed');
  } catch (e) {
      console.error('infographic.render error:', e);
      throw e;
  }
  
  // Check if anything is in container
  console.log('Container innerHTML length:', container.innerHTML.length);
  console.log('Container shadowRoot:', !!container.shadowRoot);
  console.log('Body innerHTML length:', document.body.innerHTML.length);
  
  // Wait a bit more
  await new Promise(r => setTimeout(r, 1000));
  console.log('After wait, length:', container.innerHTML.length);
  if (container.children.length > 0) {
      console.log('First child tag:', container.children[0].tagName);
  }
  
  return container.innerHTML || (container.shadowRoot ? container.shadowRoot.innerHTML : '');
};
