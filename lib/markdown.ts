import { remark } from 'remark';
import html from 'remark-html';

type DocsLinkContext = {
  sourceSlug: string;
  currentSlug: string[];
};

const DOC_MARKDOWN_EXTENSIONS = new Set(['md', 'markdown', 'html', 'htm']);

export async function markdownToHtml(markdown: string, docsLinkContext?: DocsLinkContext): Promise<string> {
  const result = await remark().use(html).process(markdown);
  const htmlOutput = result.toString();

  if (!docsLinkContext) {
    return htmlOutput;
  }

  return rewriteDocAnchorLinks(htmlOutput, docsLinkContext);
}

function rewriteDocAnchorLinks(htmlContent: string, docsLinkContext: DocsLinkContext): string {
  return htmlContent.replace(/href="([^"]+)"/g, (_full, href: string) => {
    const rewritten = rewriteDocHref(href, docsLinkContext);
    return `href="${rewritten}"`;
  });
}

function rewriteDocHref(href: string, docsLinkContext: DocsLinkContext): string {
  if (
    href.startsWith('#') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('//') ||
    /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(href) ||
    href.startsWith('/docs/')
  ) {
    return href;
  }

  const [pathPart, suffix] = splitHrefSuffix(href);
  if (!pathPart) {
    return href;
  }

  const pathExtension = getFileExtension(pathPart);
  if (pathExtension && !DOC_MARKDOWN_EXTENSIONS.has(pathExtension)) {
    return href;
  }

  const normalizedPath = normalizeDocPath(pathPart, docsLinkContext);
  if (normalizedPath === null) {
    return href;
  }

  return normalizedPath ? `/docs/${docsLinkContext.sourceSlug}/${normalizedPath}${suffix}` : `/docs/${docsLinkContext.sourceSlug}${suffix}`;
}

function splitHrefSuffix(href: string): [string, string] {
  const markerIndex = href.search(/[?#]/);
  if (markerIndex === -1) {
    return [href, ''];
  }
  return [href.slice(0, markerIndex), href.slice(markerIndex)];
}

function getFileExtension(pathPart: string): string | null {
  const match = pathPart.match(/\.([a-zA-Z0-9]+)$/);
  return match ? match[1].toLowerCase() : null;
}

function normalizeDocPath(pathPart: string, docsLinkContext: DocsLinkContext): string | null {
  const sourceSlug = docsLinkContext.sourceSlug;
  const currentDocPath = docsLinkContext.currentSlug.slice(1);
  const baseDir = currentDocPath.slice(0, -1);

  let pathSegments: string[];

  if (pathPart.startsWith('/')) {
    const cleaned = pathPart
      .replace(/^\/+/, '')
      .replace(/^source\/documentation\//, '')
      .replace(/^documentation\//, '')
      .replace(new RegExp(`^${escapeRegExp(sourceSlug)}\/`), '');

    pathSegments = cleaned.split('/').filter(Boolean);
  } else {
    pathSegments = normalizePathSegments([...baseDir, ...pathPart.split('/')]);
  }

  const joined = pathSegments.join('/').replace(/\.(html?|md|markdown)$/i, '').replace(/\/+$/, '');
  if (!joined || joined === 'index') {
    return '';
  }
  if (joined.endsWith('/index')) {
    return joined.slice(0, -('/index'.length));
  }
  return joined;
}

function normalizePathSegments(segments: string[]): string[] {
  const output: string[] = [];
  for (const segment of segments) {
    if (!segment || segment === '.') {
      continue;
    }
    if (segment === '..') {
      output.pop();
      continue;
    }
    output.push(segment);
  }
  return output;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
