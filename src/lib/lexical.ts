// Serialise un document Lexical JSON (produit par l'éditeur Payload
// `@payloadcms/richtext-lexical`) en HTML.
//
// Pourquoi un walker maison plutôt que le renderer React officiel :
// notre stack Astro SSR n'a pas React installé — tirer une dépendance
// React + les helpers Payload juste pour ce rendu serait
// disproportionné. La structure JSON Lexical est simple à parcourir
// (récurence sur `children`), et on couvre uniquement les nodes que
// l'éditeur peut produire pour ce projet (Audrey ne touche pas aux
// nodes "exotiques" type relationship/upload, on les ignore).
//
// Si on a besoin un jour de nodes plus complexes (uploads inline,
// relations, code blocks, etc.), on étendra ce walker.

/** Bits de formatage Lexical sur les nodes `text`. */
const FORMAT_BOLD = 1;
const FORMAT_ITALIC = 1 << 1;
const FORMAT_STRIKETHROUGH = 1 << 2;
const FORMAT_UNDERLINE = 1 << 3;
const FORMAT_CODE = 1 << 4;
// 1 << 5 = subscript, 1 << 6 = superscript — on les ignore (non utilisé).

type LexicalNode = {
  type: string;
  version?: number;
  children?: LexicalNode[];
  text?: string;
  format?: number | string;
  tag?: string;
  listType?: 'bullet' | 'number';
  fields?: {
    linkType?: 'custom' | 'internal';
    url?: string;
    newTab?: boolean;
  };
};

type LexicalRoot = {
  root: {
    type: 'root';
    children: LexicalNode[];
  };
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&quot;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderTextNode(node: LexicalNode): string {
  const text = escapeHtml(node.text ?? '');
  const fmt = typeof node.format === 'number' ? node.format : 0;
  let out = text;
  if (fmt & FORMAT_CODE) out = `<code>${out}</code>`;
  if (fmt & FORMAT_BOLD) out = `<strong>${out}</strong>`;
  if (fmt & FORMAT_ITALIC) out = `<em>${out}</em>`;
  if (fmt & FORMAT_UNDERLINE) out = `<u>${out}</u>`;
  if (fmt & FORMAT_STRIKETHROUGH) out = `<s>${out}</s>`;
  return out;
}

function renderChildren(children: LexicalNode[] | undefined): string {
  if (!children) return '';
  return children.map(renderNode).join('');
}

function renderNode(node: LexicalNode): string {
  switch (node.type) {
    case 'text':
      return renderTextNode(node);

    case 'paragraph':
      return `<p>${renderChildren(node.children)}</p>`;

    case 'heading': {
      const tag = node.tag ?? 'h2';
      return `<${tag}>${renderChildren(node.children)}</${tag}>`;
    }

    case 'list': {
      const tag = node.listType === 'number' ? 'ol' : 'ul';
      return `<${tag}>${renderChildren(node.children)}</${tag}>`;
    }

    case 'listitem':
      return `<li>${renderChildren(node.children)}</li>`;

    case 'quote':
    case 'blockquote':
      return `<blockquote>${renderChildren(node.children)}</blockquote>`;

    case 'link': {
      const url = node.fields?.url ?? '#';
      const newTab = node.fields?.newTab;
      const attrs = newTab
        ? ` target="_blank" rel="noopener noreferrer"`
        : '';
      return `<a href="${escapeHtml(url)}"${attrs}>${renderChildren(node.children)}</a>`;
    }

    case 'horizontalrule':
      return '<hr />';

    case 'linebreak':
      return '<br />';

    default:
      // Node type inconnu (upload, relationship, etc.) : on rend
      // récursivement les enfants au moins, pour ne pas perdre le texte.
      return renderChildren(node.children);
  }
}

/** Convertit un document Lexical JSON (forme `{ root: {...} }`) en HTML. */
export function lexicalToHtml(doc: unknown): string {
  if (!doc || typeof doc !== 'object') return '';
  const root = (doc as LexicalRoot).root;
  if (!root || !Array.isArray(root.children)) return '';
  return renderChildren(root.children);
}

/** Vrai si un document Lexical est vide (ou ne contient que des paragraphes
 *  vides). Permet au PageRenderer de fallback sur le markdown legacy
 *  quand `body_rich` n'a pas été rempli par Audrey. */
export function isLexicalEmpty(doc: unknown): boolean {
  if (!doc || typeof doc !== 'object') return true;
  const root = (doc as LexicalRoot).root;
  if (!root || !Array.isArray(root.children) || root.children.length === 0) {
    return true;
  }
  const html = lexicalToHtml(doc).replace(/<\/?p>/g, '').trim();
  return html === '';
}

/** Sérialise un Lexical en HTML inline (sans wrapping <p>) : utile pour
 *  les champs courts comme la banderole d'urgence, où on veut juste les
 *  formatages inline (gras, italique, liens) sans bloc paragraphe.
 *  Concatène tous les paragraphes en aplatissant. */
export function lexicalToHtmlInline(doc: unknown): string {
  return lexicalToHtml(doc)
    .replace(/<p[^>]*>/g, '')
    .replace(/<\/p>/g, ' ')
    .trim();
}

/** Convertit Lexical → texte brut (strip HTML/markdown). Utile pour
 *  RSS, ICS, JSON-LD : formats qui veulent du texte plain. */
export function lexicalToPlainText(doc: unknown): string {
  return lexicalToHtml(doc)
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/** Retourne le contenu d'un champ rich-or-markdown en texte plain
 *  (sans HTML/markdown). Si rich rempli → lexicalToPlainText ; sinon →
 *  markdown brut. Utile pour RSS, JSON-LD, ICS. */
export function richOrMarkdownToPlainText(
  rich: unknown,
  markdown: string | null | undefined,
): string {
  if (rich && !isLexicalEmpty(rich)) return lexicalToPlainText(rich);
  return (markdown ?? '').trim();
}

