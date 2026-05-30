export interface GuidedLink {
  label: string;
  href: string;
}

export type ContentSegment =
  | { type: "text"; value: string }
  | { type: "link"; label: string; href: string };

export type ResolvedGuidedLink =
  | { kind: "lesson"; lessonId: string; label: string; href: string }
  | { kind: "external"; url: string; label: string; href: string };

const AVA_LINK_REGEX = /\[\[([^\]|]+)\|([^\]]+)\]\]/g;
const MARKDOWN_LINK_REGEX = /\[([^\]]+)\]\(([^)]+)\)/g;
const IMAGE_TAG_REGEX = /\[IMAGE:\s*([^\]|]+?)(?:\s*\|\s*([^\]]+))?\]/g;

interface RawMatch {
  start: number;
  end: number;
  label: string;
  href: string;
}

function findLinkMatches(text: string): RawMatch[] {
  const matches: RawMatch[] = [];

  for (const regex of [AVA_LINK_REGEX, MARKDOWN_LINK_REGEX]) {
    regex.lastIndex = 0;
    let match = regex.exec(text);
    while (match) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        label: match[1].trim(),
        href: match[2].trim(),
      });
      match = regex.exec(text);
    }
  }

  matches.sort((a, b) => a.start - b.start || b.end - a.end - (a.end - a.start));

  const nonOverlapping: RawMatch[] = [];
  let cursor = 0;
  for (const item of matches) {
    if (item.start < cursor) continue;
    nonOverlapping.push(item);
    cursor = item.end;
  }

  return nonOverlapping;
}

/** Parse inline guided links using [[Label|href]] or [Label](href). */
export function parseInlineContent(text: string): ContentSegment[] {
  if (!text) return [];

  const matches = findLinkMatches(text);
  if (matches.length === 0) {
    return [{ type: "text", value: text }];
  }

  const segments: ContentSegment[] = [];
  let lastIndex = 0;

  for (const match of matches) {
    if (match.start > lastIndex) {
      segments.push({ type: "text", value: text.slice(lastIndex, match.start) });
    }
    segments.push({ type: "link", label: match.label, href: match.href });
    lastIndex = match.end;
  }

  if (lastIndex < text.length) {
    segments.push({ type: "text", value: text.slice(lastIndex) });
  }

  return segments;
}

/** Collect unique guided links from parsed segments. */
export function collectGuidedLinks(segments: ContentSegment[]): GuidedLink[] {
  const seen = new Set<string>();
  const links: GuidedLink[] = [];

  for (const segment of segments) {
    if (segment.type !== "link") continue;
    const key = `${segment.label}::${segment.href}`;
    if (seen.has(key)) continue;
    seen.add(key);
    links.push({ label: segment.label, href: segment.href });
  }

  return links;
}

/** Strip [IMAGE: path | alt] tags and return normalized image metadata. */
export function parseImageTag(text: string): {
  cleanText: string;
  imagePath?: string;
  imageAlt?: string;
} {
  let imagePath: string | undefined;
  let imageAlt: string | undefined;

  const cleanText = text.replace(IMAGE_TAG_REGEX, (_, rawPath: string, rawAlt?: string) => {
    if (!imagePath) {
      imagePath = normalizeToolkitImagePath(rawPath);
      imageAlt = rawAlt?.trim() || undefined;
    }
    return "";
  }).replace(/\n{3,}/g, "\n\n").trim();

  return { cleanText, imagePath, imageAlt };
}

/** Parse lesson text field: inline links + optional trailing image tag. */
export function parseLessonTextField(text: string): {
  cleanText: string;
  segments: ContentSegment[];
  guidedLinks: GuidedLink[];
  imagePath?: string;
  imageAlt?: string;
} {
  const { cleanText, imagePath, imageAlt } = parseImageTag(text);
  const segments = parseInlineContent(cleanText);
  return {
    cleanText,
    segments,
    guidedLinks: collectGuidedLinks(segments),
    imagePath,
    imageAlt,
  };
}

/** Normalize toolkit image paths from template or public URLs. */
export function normalizeToolkitImagePath(path: string): string {
  return path
    .trim()
    .replace(/^\/public\//, "")
    .replace(/^public\//, "")
    .replace(/^\/assets\//, "assets/");
}

/** Resolve guided link href to internal lesson id or external URL. */
export function resolveGuidedLinkHref(
  href: string,
  label: string,
): ResolvedGuidedLink {
  const trimmed = href.trim();

  if (/^https?:\/\//i.test(trimmed)) {
    return { kind: "external", url: trimmed, label, href: trimmed };
  }

  let lessonId = trimmed;
  if (lessonId.startsWith("/lesson/")) {
    lessonId = lessonId.slice("/lesson/".length);
  } else if (lessonId.startsWith("lesson/")) {
    lessonId = lessonId.slice("lesson/".length);
  }
  lessonId = lessonId.replace(/^\/+|\/+$/g, "");

  return { kind: "lesson", lessonId, label, href: trimmed };
}
