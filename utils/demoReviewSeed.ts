import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DEMO_REVIEW_EMAIL,
  EDIT_STORAGE_KEY,
  SHOOT_STORAGE_KEYS,
} from "../constants/demoReview";

type ChecklistItem = { id: string; text: string; done: boolean };

const DEMO_PROJECT_LABEL = "Project: AVA Brand Film (Demo)";

const PRE_SHOOT_SEED: string[] = [
  "Lock concept + creative brief with client",
  "Build shot list / storyboard",
  "Scout location (light, sound, power)",
  "Confirm talent + wardrobe",
  "Pull permits + insurance if needed",
  "Send call sheet 24h ahead",
  "Pack gear: cameras, lenses, audio, lights",
  "Charge ALL batteries, format ALL cards",
];

const DAY_SHOOT_SEED: string[] = [
  "Arrive 30 min early — scout sun + outlets",
  "Set up audio first, monitor levels",
  "White balance + expose for skin tones",
  "Slate every take (scene + take #)",
  "Capture B-roll: wide, medium, detail",
  "Get safety takes — always one more",
  "Back up cards to SSD before leaving set",
  "Confirm talent release signed",
];

const POST_SHOOT_SEED: string[] = [
  "Offload + back up footage (3-2-1 rule)",
  "Sync audio, organize bins by scene",
  "String-out selects, build rough cut",
  "Lock picture, send to client for notes",
  "Color grade + mix audio",
  "Render masters: 16:9, 9:16, 1:1",
  "Upload to client portal for approval",
  "Archive project to cold storage",
];

function buildShootPhase(
  phase: "pre" | "day" | "post",
  texts: string[],
  doneCount: number,
): ChecklistItem[] {
  const items: ChecklistItem[] = [
    {
      id: `demo-${phase}-project`,
      text: DEMO_PROJECT_LABEL,
      done: true,
    },
  ];

  texts.forEach((text, index) => {
    items.push({
      id: `demo-${phase}-${index}`,
      text,
      done: index < doneCount,
    });
  });

  return items;
}

async function storageIsEmpty(key: string): Promise<boolean> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw == null || raw === "" || raw === "[]";
  } catch {
    return true;
  }
}

async function seedShootChecklists(): Promise<void> {
  const preEmpty = await storageIsEmpty(SHOOT_STORAGE_KEYS.pre);
  const dayEmpty = await storageIsEmpty(SHOOT_STORAGE_KEYS.day);
  const postEmpty = await storageIsEmpty(SHOOT_STORAGE_KEYS.post);

  if (!preEmpty && !dayEmpty && !postEmpty) return;

  const writes: [string, string][] = [];

  if (preEmpty) {
    writes.push([
      SHOOT_STORAGE_KEYS.pre,
      JSON.stringify(buildShootPhase("pre", PRE_SHOOT_SEED, 4)),
    ]);
  }
  if (dayEmpty) {
    writes.push([
      SHOOT_STORAGE_KEYS.day,
      JSON.stringify(buildShootPhase("day", DAY_SHOOT_SEED, 2)),
    ]);
  }
  if (postEmpty) {
    writes.push([
      SHOOT_STORAGE_KEYS.post,
      JSON.stringify(buildShootPhase("post", POST_SHOOT_SEED, 0)),
    ]);
  }

  await AsyncStorage.multiSet(writes);
}

async function seedEditChecklist(): Promise<void> {
  if (!(await storageIsEmpty(EDIT_STORAGE_KEY))) return;

  const items: ChecklistItem[] = [
    { id: "demo-edit-0", text: DEMO_PROJECT_LABEL, done: true },
    {
      id: "demo-edit-1",
      text: "Offload + back up all cards (3-2-1 rule)",
      done: true,
    },
    {
      id: "demo-edit-2",
      text: "Create project, set sequence to delivery res/fps",
      done: true,
    },
    {
      id: "demo-edit-3",
      text: "Import & label bins: A-cam, B-cam, audio, B-roll, music",
      done: false,
    },
  ];

  await AsyncStorage.setItem(EDIT_STORAGE_KEY, JSON.stringify(items));
}

/**
 * Non-destructive demo seed for App Review account.
 * Only writes when matching email and target keys are empty.
 */
export async function seedDemoReviewDataIfNeeded(email: string): Promise<void> {
  if (email.trim().toLowerCase() !== DEMO_REVIEW_EMAIL) return;

  try {
    await seedShootChecklists();
    await seedEditChecklist();
  } catch (error) {
    console.error("[demoReviewSeed] seedDemoReviewDataIfNeeded failed:", error);
  }
}
