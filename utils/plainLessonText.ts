/** Strip guided-link markup for safe plain-Text rendering on iOS. */
export function toPlainLessonText(text: string): string {
  return text
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$1")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/\[IMAGE:\s*[^\]|]+(?:\s*\|\s*[^\]]+)?\]/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
