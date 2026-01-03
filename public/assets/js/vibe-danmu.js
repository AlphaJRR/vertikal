// VIBE™ DANMU EFFECT - Floating comments overlay
class VibeDanmu {
  constructor(videoElement) {
    this.video = videoElement;
    this.container = this.createContainer();
    this.comments = [
      "🔥 This is fire!",
      "Loving this content",
      "More of this please!",
      "Amazing work 👏",
      "Can't stop watching",
      "This is what we need",
      "Vertical cinema future",
      "Revolutionary 🚀",
      "Keep it coming!",
      "Instant classic"
    ];
    this.init();
  }

  createContainer() {
    const container = document.createElement('div');
    container.className = 'vibe-danmu-container';
    container.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: hidden;
      z-index: 5;
    `;
    this.video.parentElement.style.position = 'relative';
    this.video.parentElement.appendChild(container);
    return container;
  }

  createComment() {
    const comment = document.createElement('div');
    comment.className = 'danmu-comment';
    comment.textContent = this.comments[Math.floor(Math.random() * this.comments.length)];
    
    const lanes = 6;
    const laneHeight = 100 / lanes;
    const lane = Math.floor(Math.random() * lanes);
    
    comment.style.cssText = `
      position: absolute;
      right: -100%;
      top: ${lane * laneHeight}%;
      color: #FFF;
      font-size: 16px;
      font-weight: 700;
      text-shadow: 
        -1px -1px 0 #000,
        1px -1px 0 #000,
        -1px 1px 0 #000,
        1px 1px 0 #000,
        0 0 8px rgba(0,0,0,0.8);
      white-space: nowrap;
      animation: danmu-scroll 8s linear;
      opacity: 0.9;
    `;
    
    return comment;
  }

  init() {
    // Add CSS animation
    if (!document.getElementById('danmu-styles')) {
      const style = document.createElement('style');
      style.id = 'danmu-styles';
      style.textContent = `
        @keyframes danmu-scroll {
          from { right: -100%; }
          to { right: 100%; }
        }
      `;
      document.head.appendChild(style);
    }

    // Spawn comments every 2-4 seconds
    setInterval(() => {
      if (this.video.paused) return;
      const comment = this.createComment();
      this.container.appendChild(comment);
      setTimeout(() => comment.remove(), 8000);
    }, 2000 + Math.random() * 2000);
  }
}

// Auto-init on video elements with data-vibe attribute
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('video[data-vibe="true"]').forEach(video => {
    new VibeDanmu(video);
  });
});

