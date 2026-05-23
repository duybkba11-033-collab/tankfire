import { getToken } from '../ui/login.js';
import { startInputCapture, setSendFn } from './input.js';
import { renderState } from './render.js';
import { io } from 'socket.io-client';

let socket = null;
// Biến lưu trữ tọa độ chuột hiện tại
let mouseCoords = { mouseX: 0, mouseY: 0 };

export function initGame() {
  window.addEventListener('find_match', () => {
    connectAndFind();
  });

  // --- ĐOẠN THÊM VÀO: Lắng nghe di chuyển chuột trên Canvas ---
  const canvas = document.getElementById('game-canvas');
  if (canvas) {
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      // Tính toán tọa độ chuột tương đối so với Canvas
      mouseCoords.mouseX = e.clientX - rect.left;
      mouseCoords.mouseY = e.clientY - rect.top;
    });
  }
}

function connectAndFind() {
  if (socket && socket.connected) {
    socket.emit('find_match');
    return;
  }
  const token = getToken();
  if (!token) return alert('Not logged in');
  socket = io('http://10.103.4.70:3001', { auth: { token } });

  socket.on('connect_error', (err) => { alert('Socket error: ' + err.message); });
  socket.on('connect', () => { console.log('connected', socket.id); socket.emit('find_match'); });

  socket.on('matched', (data) => {
    // --- HIỆU ỨNG FLASH ---
    const flash = document.createElement('div');
    flash.style.cssText = "position:fixed; inset:0; background:white; z-index:9999; transition:opacity 0.8s;";
    document.body.appendChild(flash);
    setTimeout(() => {
      flash.style.opacity = "0";
      setTimeout(() => flash.remove(), 800);
    }, 100);

    // --- LOGIC CHUYỂN CẢNH ---
    const appEl = document.getElementById('app');
    if (appEl) appEl.classList.add('only-game');

    const lobbyEl = document.getElementById('lobby'); if (lobbyEl) lobbyEl.classList.add('hidden');
    const gameEl = document.getElementById('game'); if (gameEl) gameEl.classList.remove('hidden');
    const statusEl = document.getElementById('status'); if (statusEl) statusEl.innerText = 'Matched: ' + data.roomId;

    // --- SỬA ĐỔI TẠI ĐÂY: Gửi kèm tọa độ chuột khi nhấn phím ---
    startInputCapture((input) => {
      // Gộp phím bấm (input) và tọa độ chuột (mouseCoords) để gửi lên server
      const fullInput = { ...input, ...mouseCoords };
      socket.emit('input', fullInput);
    });
  });

  socket.on('state', (state) => {
    renderState(state);
    if (state && state.gameOver) {
      showGameOverModal(state);
    }
  });

  socket.on('game_over', (winner) => {
    const state = { gameOver: true, winner, players: [] };
    showGameOverModal(state);
  });

  let _modalShown = false;
  function showGameOverModal(state) {
    if (_modalShown) return;
    _modalShown = true;
    try { setSendFn(null); } catch (e) { }

    const modal = document.getElementById('game-over-modal');
    const winnerEl = document.getElementById('gom-winner');
    const playersEl = document.getElementById('gom-players');
    if (!modal || !winnerEl || !playersEl) return;

    if (state.winner) {
      winnerEl.innerText = `Winner: ${state.winner.username}`;
    } else {
      winnerEl.innerText = `No Winner`;
    }

    playersEl.innerHTML = '';
    const players = (state.players || []).slice().sort((a, b) => (b.finalScore || 0) - (a.finalScore || 0));
    players.forEach(p => {
      const row = document.createElement('div');
      row.className = 'gom-player' + ((state.winner && state.winner.userId === p.userId) ? ' winner' : '');
      const name = document.createElement('div'); name.className = 'name'; name.innerText = p.username || p.userId || 'Player';
      const score = document.createElement('div'); score.className = 'score'; score.innerText = String(typeof p.finalScore === 'number' ? p.finalScore : 0);
      row.appendChild(name); row.appendChild(score);
      playersEl.appendChild(row);
    });

    modal.classList.remove('hidden');

    const ret = document.getElementById('gom-return');
    if (ret) {
      const onReturn = () => {
        hideGameOverModal();
        try { socket.disconnect(); } catch (e) { }
        socket = null;
        try { setSendFn(null); } catch (e) { }
        const g = document.getElementById('game'); if (g) g.classList.add('hidden');
        const l = document.getElementById('lobby'); if (l) l.classList.remove('hidden');
        const appEl2 = document.getElementById('app'); if (appEl2) appEl2.classList.remove('only-game');
        const status = document.getElementById('status'); if (status) status.innerText = state.winner ? `Winner: ${state.winner.username}` : 'Match ended';
        ret.removeEventListener('click', onReturn);
      };
      ret.addEventListener('click', onReturn);
    }
  }

  function hideGameOverModal() {
    const modal = document.getElementById('game-over-modal');
    if (modal) modal.classList.add('hidden');
    _modalShown = false;
  }

  socket.on('disconnect', () => { console.log('disconnected'); });
}

window.addEventListener('logout', () => {
  if (socket) {
    try { socket.disconnect(); } catch (e) { }
    socket = null;
  }
  try { setSendFn(null); } catch (e) { }
  const g = document.getElementById('game'); if (g) g.classList.add('hidden');
  const l = document.getElementById('lobby'); if (l) l.classList.remove('hidden');
  const appEl3 = document.getElementById('app'); if (appEl3) appEl3.classList.remove('only-game');
});