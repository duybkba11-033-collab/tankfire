const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

function drawTank(p) {
    const tankColor = p.dead ? '#555' : '#2ecc71'; // Màu xanh cho xe tăng
    const turretColor = p.dead ? '#444' : '#27ae60';

    ctx.save();
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

  // Vẽ Items (giữ nguyên logic cũ nhưng làm đẹp màu sắc)
  (state.items || []).forEach(it => {
    ctx.fillStyle = '#f1c40f';
    ctx.fillRect(it.x - 8, it.y - 8, 16, 16);
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(it.x - 8, it.y - 8, 16, 16);
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