export default class Renderer {
  constructor(canvasId = 'game-canvas') {
    this.canvasId = canvasId;
    this.canvas = null;
    this.ctx = null;
    this._init();
  }

  _init() {
    this.canvas = document.getElementById(this.canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
  }

  render(state) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const canvas = this.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const map = state.map || { walls: [], grass: [], rivers: [] };
    // rivers
    (map.rivers || []).forEach(r => {
      const grad = ctx.createLinearGradient(r.x, r.y, r.x + r.w, r.y + r.h);
      grad.addColorStop(0, '#2e86de'); grad.addColorStop(1, '#1b4f72');
      ctx.fillStyle = grad; ctx.fillRect(r.x, r.y, r.w, r.h);
      const t = Date.now() * 0.002;
      const rippleCount = Math.max(2, Math.floor(r.h / 16));
      for (let ri = 0; ri < rippleCount; ri++) {
        ctx.beginPath();
        const amp = 6 * (1 - ri / (rippleCount + 1));
        const yBase = r.y + (ri + 0.5) * (r.h / rippleCount);
        for (let x = r.x; x <= r.x + r.w; x += 8) {
          const yy = yBase + Math.sin((x * 0.03) + t * (1 + ri * 0.2)) * amp;
          if (x === r.x) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
        }
        ctx.strokeStyle = `rgba(255,255,255,${0.06 * (1 - ri / rippleCount)})`;
        ctx.lineWidth = 1; ctx.stroke();
      }
      ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(255,255,255,0.02)'; ctx.fillRect(r.x, r.y, r.w, 4); ctx.globalCompositeOperation = 'source-over';
    });

    // grass (more detailed)
    (map.grass || []).forEach(g => {
      const grad = ctx.createLinearGradient(g.x, g.y, g.x, g.y + g.h);
      grad.addColorStop(0, '#4fc28b'); grad.addColorStop(0.6, '#3cb371'); grad.addColorStop(1, '#2e8b57');
      ctx.fillStyle = grad; ctx.fillRect(g.x, g.y, g.w, g.h);

      let seed = ((g.x|0) * 73856093) ^ ((g.y|0) * 19349663);
      function rnd(){ seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 0x100000000; }
      const blades = Math.max(6, Math.floor(g.w / 6)); ctx.lineWidth = 1;
      for (let i = 0; i < blades; i++) {
        const bx = g.x + rnd() * g.w;
        const hblade = 8 + rnd() * (g.h * 0.6);
        const sway = Math.sin((Date.now() / 1000) * (0.8 + rnd()*0.6) + i) * (1.5 + rnd()*2);
        ctx.beginPath(); ctx.moveTo(bx, g.y + g.h);
        ctx.quadraticCurveTo(bx + sway, g.y + g.h - hblade/2, bx - 1 + sway, g.y + g.h - hblade);
        ctx.strokeStyle = `rgba(${30 + Math.floor(rnd()*40)},${80 + Math.floor(rnd()*80)},${30 + Math.floor(rnd()*40)},${0.6 + rnd()*0.3})`;
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(0,0,0,0.06)'; ctx.fillRect(g.x, g.y + g.h - Math.max(4, g.h * 0.12), g.w, Math.max(4, g.h * 0.12));
    });

    // walls with brick texture
    (map.walls || []).forEach(w => {
      ctx.fillStyle = '#8b4513'; ctx.fillRect(w.x, w.y, w.w, w.h);
      const brickH = 12; const brickW = 24;
      for (let row = 0; row * brickH < w.h; row++) {
        const by = w.y + row * brickH; const offset = (row % 2) ? brickW/2 : 0;
        for (let bx = w.x + offset; bx < w.x + w.w; bx += brickW) {
          const bw = Math.min(brickW - 2, w.x + w.w - bx);
          if (bw <= 0) break;
          ctx.fillStyle = '#a0522d'; ctx.fillRect(bx, by + 1, bw, brickH - 2);
          ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = 1; ctx.strokeRect(bx, by + 1, bw, brickH - 2);
        }
      }
      const topGrad = ctx.createLinearGradient(w.x, w.y, w.x, w.y + w.h);
      topGrad.addColorStop(0, 'rgba(255,255,255,0.02)'); topGrad.addColorStop(1, 'rgba(0,0,0,0.06)');
      ctx.fillStyle = topGrad; ctx.fillRect(w.x, w.y, w.w, w.h);
    });

    // items
    const tNow = Date.now() / 1000;
    (state.items || []).forEach(it => {
      const cx = it.x; const cy = it.y; const pulse = 1 + 0.06 * Math.sin(tNow * 4 + (it.x + it.y) * 0.01);
      ctx.save(); ctx.translate(cx, cy); ctx.globalCompositeOperation = 'source-over'; ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 6;

      const drawHeart = () => { const g = ctx.createLinearGradient(-8, -8, 8, 12); g.addColorStop(0, '#ff6b6b'); g.addColorStop(1, '#e74c3c'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, 6 * pulse); ctx.bezierCurveTo(8, -6, 22, 2, 0, 22); ctx.bezierCurveTo(-22, 2, -8, -6, 0, 6 * pulse); ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = 1; ctx.stroke(); };
      const drawShieldIcon = () => { const g = ctx.createLinearGradient(-10, -14, 10, 18); g.addColorStop(0, '#5dade2'); g.addColorStop(1, '#2e86c1'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, -12); ctx.quadraticCurveTo(12, -6, 8, 14); ctx.quadraticCurveTo(0, 20, -8, 14); ctx.quadraticCurveTo(-12, -6, 0, -12); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,0.18)'; ctx.lineWidth = 1; ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.font = '10px Arial'; ctx.textAlign = 'center'; ctx.fillText('S', 0, 4); };
      const drawLightning = () => { ctx.fillStyle = '#f1a9ff'; ctx.beginPath(); ctx.moveTo(-6, -10); ctx.lineTo(2, -10); ctx.lineTo(-2, 0); ctx.lineTo(6, 0); ctx.lineTo(-2, 14); ctx.lineTo(2, 2); ctx.lineTo(-6, 2); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = 1; ctx.stroke(); };
      const drawBullet = () => { const g = ctx.createLinearGradient(-8, 0, 8, 0); g.addColorStop(0, '#ffd39f'); g.addColorStop(1, '#e67e22'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(-2, 0, 6, 4, 0, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.moveTo(4, 0); ctx.lineTo(10, -4); ctx.lineTo(10, 4); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(255,200,150,0.6)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(12, -6); ctx.lineTo(18, -6); ctx.moveTo(12, 6); ctx.lineTo(18, 6); ctx.stroke(); };
      const drawShieldRing = () => { const coreG = ctx.createRadialGradient(0,0,2, 0,0,16); coreG.addColorStop(0, 'rgba(0,251,255,0.95)'); coreG.addColorStop(1, 'rgba(0,191,255,0.15)'); ctx.fillStyle = coreG; ctx.beginPath(); ctx.arc(0,0,6 * pulse, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = 'rgba(0,191,255,0.9)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0,0,14 + Math.sin(tNow*6)*0.6, 0, Math.PI * 2); ctx.stroke(); };
      const drawMulti = () => { ctx.fillStyle = '#f39c12'; for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(i*6 - 2, -4); ctx.lineTo(i*6 + 4, 0); ctx.lineTo(i*6 - 2, 6); ctx.closePath(); ctx.fill(); } };

      switch (it.type) {
        case 'heal': drawHeart(); break;
        case 'armor': drawShieldIcon(); break;
        case 'speed': drawLightning(); break;
        case 'rapid': drawBullet(); break;
        case 'shield': drawShieldRing(); break;
        case 'multi_shot': drawMulti(); break;
        default: drawMulti(); break;
      }

      ctx.shadowBlur = 0; ctx.globalAlpha = 0.9; ctx.restore();
    });

    // bullets
    (state.bullets || []).forEach(b => {
      ctx.fillStyle = '#f39c12'; ctx.shadowBlur = 5; ctx.shadowColor = '#f1c40f'; ctx.beginPath(); ctx.arc(b.x, b.y, 4, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
    });

    // players
    (state.players || []).forEach(p => {
      if (p.hidden) return; // skip drawing players hidden in grass
      this._drawTank(p);
      if (p.shieldActive) {
        const w = p.w || 32; const h = p.h || w; const cx = p.x + w/2; const cy = p.y + h/2; const s = w/32;
        ctx.strokeStyle = '#00fbff'; ctx.lineWidth = Math.max(1, 3 * s); ctx.beginPath(); ctx.arc(cx, cy, 25 * s, 0, Math.PI * 2); ctx.stroke();
      }
      const barW = p.w || 32;
      const barY = p.y - Math.max(10, 12 * ((p.w||32)/32));
      ctx.fillStyle = '#bdc3c7'; ctx.fillRect(p.x, barY, barW * (p.armor / 100), 4);
      ctx.fillStyle = '#e74c3c'; ctx.fillRect(p.x, barY + 6, barW * (p.hp / 100), 5);
      ctx.fillStyle = '#fff'; ctx.font = '12px Arial'; ctx.textAlign = 'center'; ctx.fillText(p.username, p.x + (p.w||32)/2, p.y + (p.h||32) + 18);
    });
  }

  _drawTank(p) {
    const ctx = this.ctx;
    const tankColor = p.dead ? '#555' : '#2ecc71';
    const turretColor = p.dead ? '#444' : '#27ae60';
    const w = p.w || 32; const h = p.h || w; const cx = p.x + w/2; const cy = p.y + h/2; const s = w/32;
    ctx.save();
    if (p.hidden) ctx.globalAlpha = 0.35;
    ctx.translate(cx, cy);
    ctx.save(); ctx.rotate(p.bodyAngle); ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(-14*s, -14*s, 32*s, 32*s); ctx.restore();
    ctx.save(); ctx.rotate(p.bodyAngle); ctx.fillStyle = '#333'; ctx.fillRect(-18*s, -16*s, 36*s, 8*s); ctx.fillRect(-18*s, 8*s, 36*s, 8*s); ctx.fillStyle = tankColor; ctx.fillRect(-14*s, -12*s, 28*s, 24*s); ctx.strokeStyle = '#111'; ctx.lineWidth = Math.max(1,2*s); ctx.strokeRect(-14*s, -12*s, 28*s, 24*s); ctx.restore();
    ctx.save(); ctx.rotate(p.turretAngle); ctx.fillStyle = '#7f8c8d'; ctx.fillRect(0, -3*s, 22*s, 6*s); ctx.strokeRect(0, -3*s, 22*s, 6*s); ctx.fillStyle = turretColor; ctx.beginPath(); ctx.arc(0, 0, 10*s, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore();
    ctx.restore();
  }
}
