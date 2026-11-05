import { visit } from 'unist-util-visit';

/**
 * Converts ```mermaid fenced code blocks into a placeholder <div> before Shiki
 * highlighting runs, so the raw diagram source survives untouched. A client-side
 * script (src/scripts/enhance.ts) finds these placeholders at runtime and renders
 * them with mermaid.js.
 */
export function remarkMermaid() {
  return (tree) => {
    visit(tree, 'code', (node, index, parent) => {
      if (node.lang !== 'mermaid' || !parent || index === null) return;

      const escaped = node.value
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      parent.children[index] = {
        type: 'html',
        value: `<div class="mermaid-diagram not-prose" data-chart="${escaped}"><p class="mermaid-fallback text-sm opacity-60">Rendering diagram…</p></div>`,
      };
    });
  };
}
