import { useEffect, useRef, useState } from 'react';

const GLOBAL_KEYFRAMES_ID = 'danmaku-global-keyframes';

// Individual Danmaku Item Component (premium: uses global keyframes + CSS custom properties)
const DanmakuItem = ({
  item,
  containerWidth,
  totalDistance,
  topPx,
}: {
  item: DanmakuItem;
  containerWidth: number;
  totalDistance: number;
  topPx: number;
}) => {
  // Inject global keyframes once (premium: no per-item <style>)
  useEffect(() => {
    if (document.getElementById(GLOBAL_KEYFRAMES_ID)) return;

    const style = document.createElement('style');
    style.id = GLOBAL_KEYFRAMES_ID;
    style.textContent = `
      @keyframes danmaku-move {
        0%   { transform: translateX(0); opacity: 0; }
        5%   { opacity: 1; }
        95%  { opacity: 1; }
        100% { transform: translateX(calc(-1 * var(--danmaku-distance))); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div
      className="absolute text-white text-sm font-bold bg-black/70 backdrop-blur-md px-4 py-2 rounded-full border-2 border-yellow-500/50 shadow-lg shadow-yellow-500/30 whitespace-nowrap"
      style={{
        top: topPx,
        left: containerWidth,
        // CSS custom property for distance
        ['--danmaku-distance' as any]: `${totalDistance}px`,
        animationName: 'danmaku-move',
        animationDuration: `${item.durationMs}ms`,
        animationTimingFunction: 'linear',
        animationFillMode: 'forwards',
        willChange: 'transform',
      }}
    >
      {item.text}
    </div>
  );
};

interface DanmakuOverlayProps {
  active: boolean;
  vibeThreadId?: string;
  vibePreset?: Array<{ t: number; u: string; m: string }>;
}

interface DanmakuItem {
  id: string;
  text: string;
  lane: number;
  durationMs: number;
  startTime: number;
}

// ✅ PREMIUM tuning constants (keep yours)
const LANES = 7;
const FONT_SIZE = 16;
const BASE_SPEED_PX_PER_S = 240; // bump from 220 -> more premium energy
const LANE_HEIGHT_PX = 28;
const TOP_PADDING_PX = 18;
const MAX_ON_SCREEN_COMMENTS = 8;

// ✅ Adaptive speed by length (short faster, long slower)
function lengthSpeedMultiplier(text: string): number {
  const len = text.trim().length;
  if (len <= 16) return 1.25;
  if (len <= 28) return 1.05;
  if (len <= 44) return 0.90;
  return 0.78;
}

let _measureCanvas: HTMLCanvasElement | null = null;
function measureTextWidth(text: string, font = `${FONT_SIZE}px system-ui`): number {
  if (!_measureCanvas) _measureCanvas = document.createElement('canvas');
  const ctx = _measureCanvas.getContext('2d')!;
  ctx.font = font;
  return ctx.measureText(text).width;
}

function computeDurationMs(text: string, containerWidth: number): number {
  const textW = measureTextWidth(text);
  const dist = containerWidth + textW + 40;
  const speed = BASE_SPEED_PX_PER_S * lengthSpeedMultiplier(text);
  const ms = (dist / speed) * 1000;
  return Math.max(3200, Math.min(8200, Math.round(ms)));
}

// ✅ Minimum gap in px between items in same lane
function minGapPx(text: string): number {
  const len = text.trim().length;
  if (len <= 16) return 70;
  if (len <= 30) return 95;
  return 120;
}

// VIBE Presets
const VIBE_PRESETS: Record<string, Array<{ t: number; u: string; m: string }>> = {
  vibe_argueably_best_burgers_v1: [
    { t: 2.5, u: "AVA_Member", m: "This intro is CRAZY 🔥" },
    { t: 6.0, u: "Founder50", m: "Vertical cinema is rotating. Not dying." },
    { t: 9.2, u: "BlackAwe", m: "Argue don't miss 🎬" },
    { t: 13.0, u: "KelFan", m: "That pacing is clean 😮‍💨" },
    { t: 18.5, u: "Showrunner", m: "This looks premium." },
    { t: 25.0, u: "Network", m: "We need Episode 1 ASAP." },
    { t: 33.0, u: "Creator", m: "The vibe overlay is the sauce." },
    { t: 45.0, u: "Viewer", m: "Okay… I'm locked in." },
  ],
};

export const DanmakuOverlay = ({ active, vibeThreadId, vibePreset }: DanmakuOverlayProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [danmakuItems, setDanmakuItems] = useState<DanmakuItem[]>([]);
  const itemsRef = useRef<DanmakuItem[]>([]);
  useEffect(() => {
    itemsRef.current = danmakuItems;
  }, [danmakuItems]);
  
  const laneNextFreeAt = useRef<number[]>(Array(LANES).fill(0));
  const spawnTimeoutRef = useRef<number | null>(null);
  const presetQueueRef = useRef<Array<{ t: number; u: string; m: string }>>([]);
  const presetTimeoutsRef = useRef<number[]>([]);
  const videoStartTimeRef = useRef<number>(Date.now());

  function pickLane(now: number): number {
    for (let i = 0; i < LANES; i++) {
      if (laneNextFreeAt.current[i] <= now) return i;
    }
    let best = 0;
    let bestTime = laneNextFreeAt.current[0];
    for (let i = 1; i < LANES; i++) {
      if (laneNextFreeAt.current[i] < bestTime) {
        bestTime = laneNextFreeAt.current[i];
        best = i;
      }
    }
    return best;
  }

  function spawnComment(text: string, containerWidth: number) {
    const now = performance.now();

    // Hard cap: don't spawn if we're already at max visible density
    if (itemsRef.current.length >= MAX_ON_SCREEN_COMMENTS) return;

    const lane = pickLane(now);
    const durationMs = computeDurationMs(text, containerWidth);

    // Reserve lane time so next comment won't collide (FIXED math)
    const textW = measureTextWidth(text);
    const speedPxPerS = BASE_SPEED_PX_PER_S * lengthSpeedMultiplier(text);
    const gap = minGapPx(text);

    // ✅ time (ms) until enough space opens in that lane
    const laneBlockMs = ((textW + gap) / speedPxPerS) * 1000; // <-- THIS is the correct formula

    laneNextFreeAt.current[lane] = now + Math.max(600, Math.min(1800, laneBlockMs));

    // ✅ Ensure absolutely unique ID (timestamp + random + counter to prevent collisions)
    const uniqueId = `danmaku-${now}-${Math.random().toString(36).substr(2, 9)}-${itemsRef.current.length}`;

    const newItem: DanmakuItem = {
      id: uniqueId,
      text,
      lane,
      durationMs,
      startTime: now,
    };

    setDanmakuItems(prev => [...prev, newItem]);

    // One cleanup path only (premium): remove after animation completes
    window.setTimeout(() => {
      setDanmakuItems(prev => prev.filter(item => item.id !== newItem.id));
    }, durationMs + 50);
  }

  function nextSpawnDelayMs(): number {
    const n = itemsRef.current.length;
    if (n <= 2) return 520;  // more premium energy
    if (n <= 5) return 720;
    if (n <= 7) return 920;
    return 1150;
  }

  // ✅ Self-scheduling spawn loop
  function scheduleSpawn() {
    if (!active || !containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth;
    
    // Check if we have preset comments to spawn
    if (presetQueueRef.current.length > 0) {
      const preset = presetQueueRef.current.shift()!;
      const text = `${preset.u}: ${preset.m}`;
      spawnComment(text, containerWidth);
    }

    const delay = nextSpawnDelayMs();
    spawnTimeoutRef.current = window.setTimeout(() => {
      scheduleSpawn();
    }, delay);
  }

  // Initialize preset queue from vibePreset or vibeThreadId
  useEffect(() => {
    if (!active) {
      presetQueueRef.current = [];
      setDanmakuItems([]); // ✅ Clear all items when inactive
      // Clear preset timeouts when inactive
      presetTimeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId));
      presetTimeoutsRef.current = [];
      if (spawnTimeoutRef.current) {
        clearTimeout(spawnTimeoutRef.current);
        spawnTimeoutRef.current = null;
      }
      return;
    }

    // ✅ CRITICAL: Clear existing items and queue when preset changes to prevent duplicates
    setDanmakuItems([]);
    presetQueueRef.current = [];
    
    // Clear any existing timeouts before scheduling new ones
    presetTimeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId));
    presetTimeoutsRef.current = [];
    if (spawnTimeoutRef.current) {
      clearTimeout(spawnTimeoutRef.current);
      spawnTimeoutRef.current = null;
    }

    let preset: Array<{ t: number; u: string; m: string }> = [];
    
    if (vibePreset && vibePreset.length > 0) {
      preset = vibePreset;
    } else if (vibeThreadId && VIBE_PRESETS[vibeThreadId]) {
      preset = VIBE_PRESETS[vibeThreadId];
    } else {
      // Default comments
      preset = [
        { t: 0, u: "Viewer", m: "This lighting is insane 🔥" },
        { t: 1, u: "Fan", m: "Wait for the drop..." },
        { t: 2, u: "Creator", m: "Chicago represent! 🏙️" },
        { t: 3, u: "Network", m: "VIBE is live! ✨" },
        { t: 4, u: "Member", m: "Best content on Vertikal!" },
        { t: 5, u: "Viewer", m: "This is fire! 🔥" },
      ];
    }

    // Schedule preset comments based on their timing
    videoStartTimeRef.current = Date.now();
    
    preset.forEach(p => {
      const delayMs = p.t * 1000;
      const timeoutId = window.setTimeout(() => {
        presetQueueRef.current.push(p);
      }, delayMs);
      presetTimeoutsRef.current.push(timeoutId);
    });

    // Start spawn loop
    scheduleSpawn();

    return () => {
      if (spawnTimeoutRef.current) {
        clearTimeout(spawnTimeoutRef.current);
        spawnTimeoutRef.current = null;
      }
      // Clear all preset timeouts on cleanup
      presetTimeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId));
      presetTimeoutsRef.current = [];
      presetQueueRef.current = [];
    };
  }, [active, vibeThreadId, vibePreset]);

  // ✅ Cap on-screen comments to max 8 for performance
  const visibleItems = danmakuItems.slice(-MAX_ON_SCREEN_COMMENTS);

  // Clean up expired items
  useEffect(() => {
    if (!active || visibleItems.length === 0) return;

    const interval = setInterval(() => {
      const now = performance.now();
      setDanmakuItems(prev => prev.filter(item => {
        const elapsed = now - item.startTime;
        return elapsed < item.durationMs;
      }));
    }, 200);

    return () => clearInterval(interval);
  }, [active, visibleItems.length]);

  if (!active) return null;

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-40 pointer-events-none overflow-hidden"
    >
      {visibleItems.map(item => {
            const containerWidth = containerRef.current?.clientWidth ?? 360;
            const textW = measureTextWidth(item.text);
            const totalDistance = containerWidth + textW + 40;
            const topPx = TOP_PADDING_PX + (item.lane * LANE_HEIGHT_PX);

            return (
              <DanmakuItem
                key={item.id}
                item={item}
                containerWidth={containerWidth}
                totalDistance={totalDistance}
                topPx={topPx}
              />
            );
      })}
    </div>
  );
};
