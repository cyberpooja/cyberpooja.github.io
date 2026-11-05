function addCodeCopyButtons() {
  const blocks = document.querySelectorAll<HTMLPreElement>('article pre.astro-code');
  blocks.forEach((pre) => {
    if (pre.parentElement?.classList.contains('code-block-wrapper')) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper';
    pre.parentNode?.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'code-copy-btn';
    button.textContent = 'Copy';
    button.setAttribute('aria-label', 'Copy code to clipboard');
    button.addEventListener('click', async () => {
      const code = pre.querySelector('code')?.textContent ?? '';
      try {
        await navigator.clipboard.writeText(code);
        button.textContent = 'Copied!';
      } catch {
        button.textContent = 'Failed';
      }
      setTimeout(() => (button.textContent = 'Copy'), 1800);
    });
    wrapper.appendChild(button);
  });
}

function addHeadingAnchors() {
  const headings = document.querySelectorAll<HTMLElement>('article :is(h2, h3, h4)[id]');
  headings.forEach((heading) => {
    if (heading.querySelector('.heading-anchor')) return;
    const anchor = document.createElement('a');
    anchor.href = `#${heading.id}`;
    anchor.className = 'heading-anchor';
    anchor.setAttribute('aria-label', 'Link to this section');
    anchor.textContent = '#';
    heading.appendChild(anchor);
  });
}

function enableImageZoom() {
  const images = document.querySelectorAll<HTMLImageElement>('article img');
  images.forEach((img) => {
    img.classList.add('zoomable-image');
    img.addEventListener('click', () => {
      const overlay = document.createElement('div');
      overlay.className =
        'fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-6 cursor-zoom-out';
      const full = document.createElement('img');
      full.src = img.src;
      full.alt = img.alt;
      full.className = 'max-h-full max-w-full rounded-lg shadow-2xl';
      overlay.appendChild(full);
      overlay.addEventListener('click', () => overlay.remove());
      document.addEventListener(
        'keydown',
        function escClose(e) {
          if (e.key === 'Escape') {
            overlay.remove();
            document.removeEventListener('keydown', escClose);
          }
        },
        { once: true },
      );
      document.body.appendChild(overlay);
    });
  });
}

async function renderMermaidDiagrams() {
  const charts = document.querySelectorAll<HTMLElement>('.mermaid-diagram[data-chart]');
  if (charts.length === 0) return;

  const { default: mermaid } = await import('mermaid');
  const isDark = document.documentElement.classList.contains('dark');
  mermaid.initialize({ startOnLoad: false, theme: isDark ? 'dark' : 'default', securityLevel: 'strict' });

  for (const [i, el] of Array.from(charts).entries()) {
    const source = el.getAttribute('data-chart') ?? '';
    try {
      const { svg } = await mermaid.render(`mermaid-diagram-${i}`, source);
      el.innerHTML = svg;
    } catch {
      el.innerHTML = '<p class="text-sm text-red-500">Failed to render diagram.</p>';
    }
  }
}

function initReadingProgress() {
  const bar = document.getElementById('reading-progress');
  const article = document.querySelector('article');
  if (!bar || !article) return;

  const update = () => {
    const rect = article.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    const scrolled = Math.min(Math.max(-rect.top, 0), total);
    const pct = total > 0 ? (scrolled / total) * 100 : 0;
    bar.style.width = `${pct}%`;
  };

  document.addEventListener('scroll', update, { passive: true });
  update();
}

function initTocActiveState() {
  const tocLinks = document.querySelectorAll<HTMLAnchorElement>('#table-of-contents a[href^="#"]');
  const headings = Array.from(tocLinks)
    .map((link) => document.getElementById(link.hash.slice(1)))
    .filter((el): el is HTMLElement => !!el);

  if (headings.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = document.querySelector(`#table-of-contents a[href="#${entry.target.id}"]`);
        if (!link) return;
        if (entry.isIntersecting) {
          tocLinks.forEach((l) => l.classList.remove('text-accent-600', 'dark:text-accent-400', 'font-medium'));
          link.classList.add('text-accent-600', 'dark:text-accent-400', 'font-medium');
        }
      });
    },
    { rootMargin: '-80px 0px -70% 0px' },
  );

  headings.forEach((heading) => observer.observe(heading));
}

function init() {
  addCodeCopyButtons();
  addHeadingAnchors();
  enableImageZoom();
  renderMermaidDiagrams();
  initReadingProgress();
  initTocActiveState();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
