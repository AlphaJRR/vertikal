import { useEffect, useRef, useState } from 'react';

// Individual Danmaku Item Component (for dynamic keyframes)
const DanmakuItem = ({ item, containerWidth, totalDistance, topPercent }: {
  item: DanmakuItem;
  containerWidth: number;
  totalDistance: number;
  topPercent: number;
}) => {
  const animationId = `danmaku-${item.id.replace(/[^a-zA-Z0-9]/g, '')}`;
  
  useEffect(() => {
    const style = document.createElement('style');
    style.id = animationId;
    style.textContent = `
      @keyframes ${animationId} {
        0% {
          transform: translateX(0);
          opacity: 0;
        }
        5% {
          opacity: 1;
        }
        95% {
          opacity: 1;
        }
        100% {
          transform: translateX(-${totalDistance}px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      const existingStyle = document.getElementById(animationId);
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [animationId, totalDistance]);

  return (
    <div
      className="absolute text-white text-sm font-bold bg-black/70 backdrop-blur-md px-4 py-2 rounded-full border-2 border-yellow-500/50 shadow-lg shadow-yellow-500/30 whitespace-nowrap"
      style={{
        top: `${topPercent}%`,
        left: `${containerWidth}px`,
        animation: `${animationId} ${item.durationMs}ms linear forwards`,
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

// ✅ PREMIUM: Danmaku tuning constants
const LANES = 7;
const FONT_SIZE = 16;
const BASE_SPEED_PX_PER_S = 220; // Global "energy" knob (increase to 250 for more hype)
const LANE_HEIGHT_PX = 28;

// ✅ Adaptive speed by length (short faster, long slower)
function lengthSpeedMultiplier(text: string): number {
  const len = text.trim().length;
  if (len <= 16) return 1.25;
  if (len <= 28) return 1.05;
  if (len <= 44) return 0.90;
  return 0.78;
}

// ✅ Text width measurement (canvas-based, accurate)
let _measureCanvas: HTMLCanvasElement | null = null;
function measureTextWidth(text: string, font = `${FONT_SIZE}px system-ui`): number {
  if (!_measureCanvas) {
    _measureCanvas = document.createElement('canvas');
  }
  const ctx = _measureCanvas.getContext('2d')!;
  ctx.font = font;
  return ctx.measureText(text).width;
}

// ✅ Compute duration based on distance and adaptive speed
function computeDurationMs(text: string, containerWidth: number): number {
  const textW = measureTextWidth(text);
  const dist = containerWidth + textW + 40; // padding
  const speed = BASE_SPEED_PX_PER_S * lengthSpeedMultiplier(text);
  const ms = (dist / speed) * 1000;
  // Clamp for sanity
  return Math.max(3500, Math.min(8500, Math.round(ms)));
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
  const laneNextFreeAt = useRef<number[]>(Array(LANES).fill(0));
  const spawnTimeoutRef = useRef<number | null>(null);
  const presetQueueRef = useRef<Array<{ t: number; u: string; m: string }>>([]);
  const videoStartTimeRef = useRef<number>(Date.now());

  // ✅ Pick lane with collision avoidance
  function pickLane(now: number): number {
    // Prefer a lane that is already free
    for (let i = 0; i < LANES; i++) {
      if (laneNextFreeAt.current[i] <= now) return i;
    }
    // If all busy, pick the one that frees soonest
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

  // ✅ Spawn one comment with adaptive speed and collision avoidance
  function spawnComment(text: string, containerWidth: number) {
    const now = performance.now();
    const lane = pickLane(now);
    const durationMs = computeDurationMs(text, containerWidth);

    // Reserve lane time so next comment won't collide
    const textW = measureTextWidth(text);
    const speedPxPerS = BASE_SPEED_PX_PER_S * lengthSpeedMultiplier(text);
    const speedPxPerMs = speedPxPerS / 1000;
    const gap = minGapPx(text);
    const laneBlockMs = ((textW + gap) / speedPxPerMs) * 1000;

    // Clamp lane block to avoid stalling
    laneNextFreeAt.current[lane] = now + Math.max(600, Math.min(1600, laneBlockMs));

    const newItem: DanmakuItem = {
      id: crypto.randomUUID(),
      text,
      lane,
      durationMs,
      startTime: now,
    };

    setDanmakuItems(prev => [...prev, newItem]);

    // Remove item after animation completes
    setTimeout(() => {
      setDanmakuItems(prev => prev.filter(item => item.id !== newItem.id));
    }, durationMs);
  }

  // ✅ Adaptive spawn rate (faster when empty, slower when crowded)
  function nextSpawnDelayMs(): number {
    const n = danmakuItems.length;
    if (n <= 3) return 550; // Faster when empty (was 650)
    if (n <= 6) return 800;
    if (n <= 9) return 1000;
    return 1200;
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
      return;
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
      setTimeout(() => {
        presetQueueRef.current.push(p);
      }, delayMs);
    });

    // Start spawn loop
    scheduleSpawn();

    return () => {
      if (spawnTimeoutRef.current) {
        clearTimeout(spawnTimeoutRef.current);
      }
    };
  }, [active, vibeThreadId, vibePreset]);

  if (!active) return null;

  // ✅ Cap on-screen comments to max 8 for performance
  const MAX_ON_SCREEN_COMMENTS = 8;
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

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-40 pointer-events-none overflow-hidden"
    >
      {visibleItems.map(item => {
        const containerWidth = containerRef.current?.clientWidth ?? 360;
        const textW = measureTextWidth(item.text);
        const totalDistance = containerWidth + textW + 40;
        const topPercent = 10 + (item.lane * (100 / LANES));

        return (
          <DanmakuItem
            key={item.id}
            item={item}
            containerWidth={containerWidth}
            totalDistance={totalDistance}
            topPercent={topPercent}
          />
        );
      })}
    </div>
  );
};
