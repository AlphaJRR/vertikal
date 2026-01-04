// VIBE Danmaku Comments System
// Only binds to elements with data-vibe="true"

window.VIBE_PRESETS = window.VIBE_PRESETS || {};

// Preset for ARGUEably the Best Burgers
window.VIBE_PRESETS["vibe_argueably_best_burgers_v1"] = [
  { t: 2.5, u: "AVA_Member", m: "This intro is CRAZY 🔥" },
  { t: 6.0, u: "Founder50", m: "Vertical cinema is rotating. Not dying." },
  { t: 9.2, u: "BlackAwe", m: "Argue don't miss 🎬" },
  { t: 13.0, u: "KelFan", m: "That pacing is clean 😮‍💨" },
  { t: 18.5, u: "Showrunner", m: "This looks premium." },
  { t: 25.0, u: "Network", m: "We need Episode 1 ASAP." },
  { t: 33.0, u: "Creator", m: "The vibe overlay is the sauce." },
  { t: 45.0, u: "Viewer", m: "Okay… I'm locked in." }
];

(function() {
  'use strict';

  // Only target elements with data-vibe="true"
  const vibeTargets = document.querySelectorAll('[data-vibe="true"]');
  
  if (vibeTargets.length === 0) {
    console.log('[VIBE] No targets found with data-vibe="true"');
    return;
  }

  console.log(`[VIBE] Found ${vibeTargets.length} VIBE target(s)`);

  vibeTargets.forEach(el => {
    const threadId = el.getAttribute('data-vibe-thread');
    const preset = (window.VIBE_PRESETS && window.VIBE_PRESETS[threadId]) || [];
    
    if (preset.length === 0) {
      console.warn(`[VIBE] No preset found for thread: ${threadId}`);
      return;
    }

    // Create danmaku container
    const container = document.createElement('div');
    container.className = 'vibe-danmaku-container';
    container.style.cssText = `
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
      z-index: 50;
    `;
    el.style.position = 'relative';
    el.appendChild(container);

    // Create comment elements
    preset.forEach((comment, i) => {
      const commentEl = document.createElement('div');
      commentEl.className = 'vibe-danmaku-comment';
      commentEl.textContent = `${comment.u}: ${comment.m}`;
      commentEl.style.cssText = `
        position: absolute;
        top: ${10 + (i * 12)}%;
        left: 100%;
        white-space: nowrap;
        color: white;
        font-weight: bold;
        font-size: 14px;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(8px);
        padding: 8px 16px;
        border-radius: 9999px;
        border: 2px solid rgba(234, 179, 8, 0.5);
        box-shadow: 0 4px 12px rgba(234, 179, 8, 0.3);
        animation: vibe-danmaku-scroll 10s linear ${comment.t}s infinite;
      `;
      container.appendChild(commentEl);
    });
  });

  // Add animation keyframes
  if (!document.getElementById('vibe-danmaku-styles')) {
    const style = document.createElement('style');
    style.id = 'vibe-danmaku-styles';
    style.textContent = `
      @keyframes vibe-danmaku-scroll {
        0% {
          left: 100%;
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 1;
        }
        100% {
          left: -100%;
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
})();

