const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

function drawTank(p) {
    const tankColor = p.dead ? '#555' : '#2ecc71'; // Màu xanh cho xe tăng
    const turretColor = p.dead ? '#444' : '#27ae60';

    ctx.save();
  if (p.hidden) ctx.globalAlpha = 0.35;
    ctx.translate(p.x + 16, p.y + 16);

    // 1. Vẽ bóng đổ (Shadow)
    ctx.save();
    ctx.rotate(p.bodyAngle);
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(-14, -14, 32, 32);
    ctx.restore();

    // 2. Vẽ thân xe & Xích (Chassis) quay theo hướng di chuyển
    ctx.save();
    ctx.rotate(p.bodyAngle);
    // Xích xe
    ctx.fillStyle = '#333';
    ctx.fillRect(-18, -16, 36, 8); // Xích trái
    ctx.fillRect(-18, 8, 36, 8);  // Xích phải
    // Thân chính
    ctx.fillStyle = tankColor;
    ctx.fillRect(-14, -12, 28, 24);
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 2;
    ctx.strokeRect(-14, -12, 28, 24);
    ctx.restore();

    // 3. Vẽ tháp pháo & Nòng súng quay theo chuột
    ctx.save();
    ctx.rotate(p.turretAngle);
    // Nòng súng
    ctx.fillStyle = '#7f8c8d';
    ctx.fillRect(0, -3, 22, 6);
    ctx.strokeRect(0, -3, 22, 6);
    // Tháp pháo (hình tròn)
    ctx.fillStyle = turretColor;
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.restore();
}

export function renderState(state) {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw map (walls, grass, rivers) if provided
  const map = state.map || { walls: [], grass: [], rivers: [] };
  // rivers (blue)
  (map.rivers || []).forEach(r => {
    const grad = ctx.createLinearGradient(r.x, r.y, r.x + r.w, r.y + r.h);
    grad.addColorStop(0, '#2e86de'); grad.addColorStop(1, '#1b4f72');
    ctx.fillStyle = grad; ctx.fillRect(r.x, r.y, r.w, r.h);
    // subtle waves
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      const yy = r.y + (i + 0.5) * (r.h / 6);
      ctx.beginPath(); ctx.moveTo(r.x, yy); ctx.quadraticCurveTo(r.x + r.w/4, yy + 4 * Math.sin(i + Date.now()*0.001), r.x + r.w, yy); ctx.stroke();
    }
  });
  // grass (green)
  (map.grass || []).forEach(g => {
    const grad = ctx.createLinearGradient(g.x, g.y, g.x, g.y + g.h);
    grad.addColorStop(0, '#3cb371'); grad.addColorStop(1, '#2e8b57');
    ctx.fillStyle = grad; ctx.fillRect(g.x, g.y, g.w, g.h);
    // draw simple blades pattern
    ctx.strokeStyle = 'rgba(0,0,0,0.08)'; ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      const bx = g.x + 6 + i * (g.w / 6);
      ctx.beginPath(); ctx.moveTo(bx, g.y + g.h); ctx.lineTo(bx - 3, g.y + g.h - 12); ctx.stroke();
    }
  });
  // walls (brown bricks)
  (map.walls || []).forEach(w => {
    const sd = w.sideDamage || { left: 0, right: 0, top: 0, bottom: 0 };
    const steps = w.maxSteps || 3;
    const leftOff = (sd.left / steps) * w.w;
    const rightOff = (sd.right / steps) * w.w;
    const topOff = (sd.top / steps) * w.h;
    const bottomOff = (sd.bottom / steps) * w.h;
    const drawW = Math.max(0, w.w - leftOff - rightOff);
    const drawH = Math.max(0, w.h - topOff - bottomOff);
    if (drawW <= 0 || drawH <= 0) return;
    const drawX = w.x + leftOff;
    const drawY = w.y + topOff;
    const destructible = typeof w.sideDamage === 'object';
    ctx.fillStyle = destructible ? '#8b4513' : '#c0c0c0';
    ctx.fillRect(drawX, drawY, drawW, drawH);
    ctx.strokeStyle = destructible ? '#642f10' : '#888'; ctx.lineWidth = 1; ctx.strokeRect(drawX, drawY, drawW, drawH);

    if (destructible) {
      ctx.strokeStyle = 'rgba(0,0,0,0.08)';
      const brickH = 10;
      for (let by = drawY; by < drawY + drawH; by += brickH) {
        ctx.beginPath(); ctx.moveTo(drawX, by); ctx.lineTo(drawX + drawW, by); ctx.stroke();
      }
      // subtle crack when partially damaged
      if ((sd.left || sd.right || sd.top || sd.bottom) && (sd.left + sd.right + sd.top + sd.bottom > 0)) {
        ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 2;
        ctx.beginPath();
        const cx = drawX + drawW / 2; const cy = drawY + drawH / 2;
        ctx.moveTo(drawX + 2, cy - 4); ctx.lineTo(cx, cy + 4); ctx.lineTo(drawX + drawW - 2, cy - 2); ctx.stroke();
      }
    }
  });

  // Vẽ Items (giữ nguyên logic cũ nhưng làm đẹp màu sắc)
  // nicer item icons with subtle gradients and shadows
  const tNow = Date.now() / 1000;
  (state.items || []).forEach(it => {
    const cx = it.x;
    const cy = it.y;
    const pulse = 1 + 0.06 * Math.sin(tNow * 4 + (it.x + it.y) * 0.01);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.globalCompositeOperation = 'source-over';
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = 6;

    function drawHeart() {
      const g = ctx.createLinearGradient(-8, -8, 8, 12);
      g.addColorStop(0, '#ff6b6b'); g.addColorStop(1, '#e74c3c');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(0, 6 * pulse);
      ctx.bezierCurveTo(8, -6, 22, 2, 0, 22);
      ctx.bezierCurveTo(-22, 2, -8, -6, 0, 6 * pulse);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = 1; ctx.stroke();
    }

    function drawShieldIcon() {
      const g = ctx.createLinearGradient(-10, -14, 10, 18);
      g.addColorStop(0, '#5dade2'); g.addColorStop(1, '#2e86c1');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(0, -12);
      ctx.quadraticCurveTo(12, -6, 8, 14);
      ctx.quadraticCurveTo(0, 20, -8, 14);
      ctx.quadraticCurveTo(-12, -6, 0, -12);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.18)'; ctx.lineWidth = 1; ctx.stroke();
      // emblem
      ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.font = '10px Arial'; ctx.textAlign = 'center'; ctx.fillText('S', 0, 4);
    }

    function drawLightning() {
      ctx.fillStyle = '#f1a9ff';
      ctx.beginPath();
      ctx.moveTo(-6, -10);
      ctx.lineTo(2, -10);
      ctx.lineTo(-2, 0);
      ctx.lineTo(6, 0);
      ctx.lineTo(-2, 14);
      ctx.lineTo(2, 2);
      ctx.lineTo(-6, 2);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = 1; ctx.stroke();
    }

    function drawBullet() {
      // body gradient
      const g = ctx.createLinearGradient(-8, 0, 8, 0);
      g.addColorStop(0, '#ffd39f'); g.addColorStop(1, '#e67e22');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.ellipse(-2, 0, 6, 4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(4, 0); ctx.lineTo(10, -4); ctx.lineTo(10, 4); ctx.closePath(); ctx.fill();
      // motion lines
      ctx.strokeStyle = 'rgba(255,200,150,0.6)'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(12, -6); ctx.lineTo(18, -6); ctx.moveTo(12, 6); ctx.lineTo(18, 6); ctx.stroke();
    }

    function drawShieldRing() {
      // core
      const coreG = ctx.createRadialGradient(0,0,2, 0,0,16);
      coreG.addColorStop(0, 'rgba(0,251,255,0.95)'); coreG.addColorStop(1, 'rgba(0,191,255,0.15)');
      ctx.fillStyle = coreG; ctx.beginPath(); ctx.arc(0,0,6 * pulse, 0, Math.PI * 2); ctx.fill();
      // outer ring
      ctx.strokeStyle = 'rgba(0,191,255,0.9)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0,0,14 + Math.sin(tNow*6)*0.6, 0, Math.PI * 2); ctx.stroke();
    }

    function drawMulti() {
      ctx.fillStyle = '#f39c12';
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath(); ctx.moveTo(i*6 - 2, -4); ctx.lineTo(i*6 + 4, 0); ctx.lineTo(i*6 - 2, 6); ctx.closePath(); ctx.fill();
      }
    }

    // pick renderer
    switch (it.type) {
      case 'heal': drawHeart(); break;
      case 'armor': drawShieldIcon(); break;
      case 'speed': drawLightning(); break;
      case 'rapid': drawBullet(); break;
      case 'shield': drawShieldRing(); break;
      case 'multi_shot': drawMulti(); break;
      default: drawMulti(); break;
    }

    // subtle halo
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 0.9;
    ctx.restore();
  });

  // Vẽ Đạn (Dạng tia lửa cho hiện đại)
  (state.bullets || []).forEach(b => {
    ctx.fillStyle = '#f39c12';
    ctx.shadowBlur = 5;
    ctx.shadowColor = '#f1c40f';
    ctx.beginPath(); ctx.arc(b.x, b.y, 4, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
  });

  // Vẽ Người chơi
  (state.players || []).forEach(p => {
    drawTank(p);

    // Shield effect
    if (p.shieldActive) {
        ctx.strokeStyle = '#00fbff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(p.x + 16, p.y + 16, 25, 0, Math.PI * 2);
        ctx.stroke();
    }

    // UI (HP & Armor)
    const barW = 32;
    // Armor bar
    ctx.fillStyle = '#bdc3c7';
    ctx.fillRect(p.x, p.y - 12, barW * (p.armor / 100), 4);
    // HP bar
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(p.x, p.y - 7, barW * (p.hp / 100), 5);

    // Name tag
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(p.username, p.x + 16, p.y + 45);
  });
}
