// VIBE Presets
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

// Preset for AVA KT Consignment Trailer
window.VIBE_PRESETS["vibe_ava_kt_trailer_v1"] = [
  { t: 2.0, u: "Founder50", m: "AVA always looks cinematic 😮‍💨" },
  { t: 6.0, u: "Network", m: "This trailer energy is crazy 🔥" },
  { t: 11.0, u: "Producer", m: "KT Consignment bout to go UP." },
  { t: 18.0, u: "Creator", m: "That cut timing is clean." },
  { t: 28.0, u: "Viewer", m: "Need the full series ASAP." },
  { t: 42.0, u: "AVA_Member", m: "VIBE™ makes this feel live." },
  { t: 60.0, u: "Director", m: "Okay… this is premium." }
];

class VibeDanmu {
  constructor(element, threadId) {
    this.element = element;
    this.threadId = threadId;
    this.container = document.createElement('div');
    this.container.className = 'vibe-danmu-container';
    this.container.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:50';
    
    const parent = element.parentElement;
    parent.style.position = 'relative';
    parent.appendChild(this.container);
    
    // Get preset comments or use defaults
    const preset = (window.VIBE_PRESETS && window.VIBE_PRESETS[threadId]) || [];
    this.comments = preset.length > 0 ? preset : [
      { t: 0, u: "Viewer", m: '🔥 This is fire!' },
      { t: 2, u: "Fan", m: 'Loving this content' },
      { t: 4, u: "Creator", m: 'More of this please!' }
    ];
    
    this.addStyles();
    this.startSpawning();
  }
  
  addStyles() {
    if (!document.getElementById('vibe-styles')) {
      const style = document.createElement('style');
      style.id = 'vibe-styles';
      style.textContent = `
        @keyframes vibe-float {
          from { right: -100%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          to { right: 100%; opacity: 0; }
        }
        .vibe-danmaku-comment {
          position: absolute;
          right: -100%;
          color: #FFF;
          font-size: 18px;
          font-weight: 900;
          text-shadow: -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000;
          white-space: nowrap;
          pointer-events: none;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          padding: 8px 16px;
          border-radius: 9999px;
          border: 2px solid rgba(234, 179, 8, 0.5);
          box-shadow: 0 4px 12px rgba(234, 179, 8, 0.3);
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  createComment(comment, topPosition) {
    const div = document.createElement('div');
    div.className = 'vibe-danmaku-comment';
    div.textContent = `${comment.u}: ${comment.m}`;
    div.style.cssText += `
      top: ${topPosition}%;
      animation: vibe-float 10s linear ${comment.t}s infinite;
    `;
    return div;
  }
  
  startSpawning() {
    // Spawn preset comments at their specified times
    this.comments.forEach((comment, index) => {
      const topPosition = 10 + (index % 5) * 15; // Spread vertically
      const commentEl = this.createComment(comment, topPosition);
      this.container.appendChild(commentEl);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Target elements with data-vibe="true" (works with both video and iframe containers)
  document.querySelectorAll('[data-vibe="true"]').forEach(el => {
    const threadId = el.getAttribute('data-vibe-thread');
    if (threadId) {
      new VibeDanmu(el, threadId);
    }
  });
});
