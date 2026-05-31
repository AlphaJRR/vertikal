/**
 * Verify all 44 curriculum cheat sheets resolve to pre-baked card data.
 * Run: npx tsx scripts/verify-cheat-sheets.ts
 */
import {
  CHEAT_SHEET_BY_SLIDE_ID,
  getCheatSheetCards,
} from "../data/toolkitCheatSheetCards";
import { toolkitLessons } from "../data/toolkitCurriculum";

const htmlLessons = toolkitLessons.filter(
  (l) => l.type === "html_presentation" && l.htmlSlideId && l.htmlSlidePath,
);

let failed = 0;

for (const lesson of htmlLessons) {
  const slideId = lesson.htmlSlideId!;
  const cards = getCheatSheetCards(slideId);
  if (!cards || cards.length < 3) {
    console.error("FAIL", lesson.id, slideId, cards?.length ?? 0);
    failed++;
    continue;
  }
  const hasHeading = cards.some((c) => c.heading || c.subheading);
  if (!hasHeading) {
    console.error("FAIL no headings", lesson.id, slideId);
    failed++;
    continue;
  }
  console.log("OK", lesson.id, slideId, cards.length, "cards");
}

const mapCount = Object.keys(CHEAT_SHEET_BY_SLIDE_ID).length;
if (mapCount !== htmlLessons.length) {
  console.error("Map count mismatch", mapCount, htmlLessons.length);
  failed++;
}

console.log(`\n${htmlLessons.length - failed}/${htmlLessons.length} passed`);
process.exit(failed > 0 ? 1 : 0);
