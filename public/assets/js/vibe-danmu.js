class VibeDanmu {
  constructor(video) {
    this.video = video;
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
    container.style.cssText = `
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
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
    comment.textContent = this.comments[Math.floor(Math.random() * this.comments.length)];
    const lane = Math.floor(Math.random() * 6);
    comment.style.cssText = `
      position: absolute;
      right: -100%;
      top: ${lane * 16}%;
      color: #FFF;
      font-size: 18px;
      font-weight: 900;
      text-shadow: -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000;
      white-space: nowrap;
      animation: danmu 8s linear;
    `;
    return comment;
  }

  init() {
    const style = document.createElement('style');
    style.textContent = '@keyframes danmu { from { right: -100%; } to { right: 100%; } }';
    document.head.appendChild(style);

    setInterval(() => {
      if (!this.video.paused) {
        const comment = this.createComment();
        this.container.appendChild(comment);
        setTimeout(() => comment.remove(), 8000);
      }
    }, 2500);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('video[data-vibe="true"]').forEach(v => new VibeDanmu(v));
});
