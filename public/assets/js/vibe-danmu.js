class VibeDanmu {
  constructor(video) {
    this.video = video;
    this.container = document.createElement('div');
    this.container.className = 'vibe-danmu-container';
    this.container.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:5';
    
    const parent = video.parentElement;
    parent.style.position = 'relative';
    parent.appendChild(this.container);
    
    this.comments = [
      '🔥 This is fire!',
      'Loving this content',
      'More of this please!',
      'Amazing work 👏',
      "Can't stop watching",
      'This is what we need',
      'Vertical cinema future',
      'Revolutionary 🚀',
      'Keep it coming!',
      'Instant classic'
    ];
    
    this.addStyles();
    this.startSpawning();
  }
  
  addStyles() {
    if (!document.getElementById('vibe-styles')) {
      const style = document.createElement('style');
      style.id = 'vibe-styles';
      style.textContent = '@keyframes vibe-float{from{right:-100%}to{right:100%}}';
      document.head.appendChild(style);
    }
  }
  
  createComment() {
    const div = document.createElement('div');
    div.textContent = this.comments[Math.floor(Math.random() * this.comments.length)];
    div.style.cssText = `
      position:absolute;
      right:-100%;
      top:${Math.floor(Math.random() * 6) * 16}%;
      color:#FFF;
      font-size:20px;
      font-weight:900;
      text-shadow:-2px -2px 0 #000,2px -2px 0 #000,-2px 2px 0 #000,2px 2px 0 #000;
      white-space:nowrap;
      animation:vibe-float 8s linear;
      pointer-events:none;
    `;
    return div;
  }
  
  startSpawning() {
    setInterval(() => {
      if (!this.video.paused) {
        const comment = this.createComment();
        this.container.appendChild(comment);
        setTimeout(() => comment.remove(), 8000);
      }
    }, 2000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('video[data-vibe="true"]').forEach(v => {
    new VibeDanmu(v);
  });
});
