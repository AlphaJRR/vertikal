export interface CheatSheetStep {
  label: string;
  text: string;
}

export interface CheatSheetCallout {
  label: string;
  text: string;
}

export interface CheatSheetCard {
  topic?: string;
  heading?: string;
  subheading?: string;
  bullets: string[];
  steps: CheatSheetStep[];
  callout?: CheatSheetCallout;
  warning?: CheatSheetCallout;
  caption?: string;
  hasDiagram: boolean;
}

function stripTags(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function firstMatch(html: string, pattern: RegExp): string | undefined {
  const match = html.match(pattern);
  if (!match?.[1]) return undefined;
  const text = stripTags(match[1]);
  return text || undefined;
}

function allMatches(html: string, pattern: RegExp): string[] {
  return [...html.matchAll(pattern)]
    .map((match) => stripTags(match[1] ?? ""))
    .filter(Boolean);
}

function parseCallout(
  html: string,
  className: "presentation-callout" | "presentation-warning",
): CheatSheetCallout | undefined {
  const block = html.match(
    new RegExp(`class="${className}"[\\s\\S]*?(?=<\\/div>\\s*<\\/div>|$)`, "i"),
  )?.[0];
  if (!block) return undefined;

  const label = firstMatch(block, /class="presentation-label"[^>]*>([^<]+)/i);
  const text = firstMatch(block, /<p[^>]*>([^<]+)/i);
  if (!label || !text) return undefined;
  return { label, text };
}

function parseArticle(articleHtml: string): CheatSheetCard | null {
  const topic = firstMatch(articleHtml, /class="presentation-topic"[^>]*>([^<]+)/i);
  const heading = firstMatch(articleHtml, /class="presentation-heading"[^>]*>([^<]+)/i);
  const subheading = firstMatch(
    articleHtml,
    /class="presentation-subheading"[^>]*>([^<]+)/i,
  );
  const bullets = allMatches(articleHtml, /<li>([\s\S]*?)<\/li>/gi);
  const steps = [...articleHtml.matchAll(
    /class="davinci-step-num"[^>]*>([^<]+)[\s\S]*?<p[^>]*>([^<]+)/gi,
  )].map((match) => ({
    label: stripTags(match[1]),
    text: stripTags(match[2]),
  }));
  const callout = parseCallout(articleHtml, "presentation-callout");
  const warning = parseCallout(articleHtml, "presentation-warning");
  const caption = firstMatch(articleHtml, /class="presentation-caption"[^>]*>([^<]+)/i);
  const hasDiagram = /class="presentation-diagram-wrap"/i.test(articleHtml);

  if (!heading && !subheading && bullets.length === 0 && steps.length === 0) {
    return null;
  }

  return {
    topic,
    heading,
    subheading,
    bullets,
    steps,
    callout,
    warning,
    caption,
    hasDiagram,
  };
}

/** Parse bundled toolkit HTML into native cheat sheet cards (one per slide article). */
export function parseToolkitSlideHtml(html: string): CheatSheetCard[] {
  const parts = html.split(/<article\b/i).slice(1);
  return parts
    .map((part) => parseArticle(part))
    .filter((card): card is CheatSheetCard => card != null);
}
