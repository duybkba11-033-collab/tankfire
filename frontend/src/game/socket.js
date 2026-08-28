import { io } from 'socket.io-client';
import { API_URL } from '../config.js';
import { getToken } from '../ui/login.js';
import { showView } from '../ui/view.js';
import { initInput, startInput, stopInput } from './input.js';
import { createRenderer } from './render.js';

let socket = null;
let renderer = null;
let phase = 'IDLE';
let pendingMapId = null;
let currentMap = null;

function setMatchmakingStatus(state, message) {
  phase = state;
  window.dispatchEvent(new CustomEvent('matchmaking_status', { detail: { state, message } }));
}

export function initGame() {
  const canvas = document.getElementById('game-canvas');
  renderer = createRenderer(canvas);
  initInput(canvas);

  window.addEventListener('find_match', (event) => findMatch(event.detail.mapId));
  window.addEventListener('cancel_match', cancelMatch);
  window.addEventListener('logout', disconnectSocket);
  document.getElementById('gom-return').addEventListener('click', returnToLobby);
}

function findMatch(mapId) {
  if (phase !== 'IDLE') return;
  pendingMapId = mapId;
  if (socket && socket.connected) {
    socket.emit('find_match', { mapId });
    setMatchmakingStatus('CONNECTING', 'Joining matchmaking...');
    return;
  }

  const token = getToken();
  if (!token) return;
  setMatchmakingStatus('CONNECTING', 'Connecting to the game server...');
  socket = io(API_URL, { auth: { token }, reconnectionAttempts: 3, timeout: 5000 });
  bindSocketEvents(socket);
}

function bindSocketEvents(client) {
  client.on('connect', () => {
    if (pendingMapId && (phase === 'CONNECTING' || phase === 'QUEUED')) {
      client.emit('find_match', { mapId: pendingMapId });
    }
  });

  client.on('connect_error', (error) => {
    if (/token/i.test(error.message)) {
      window.dispatchEvent(new Event('auth_expired'));
    }
    setMatchmakingStatus('IDLE', `Connection failed: ${error.message}`);
    pendingMapId = null;
  });

  client.on('queue_joined', ({ position }) => {
    setMatchmakingStatus('QUEUED', `Searching for an opponent. Queue position: ${position}`);
  });

  client.on('queue_cancelled', () => {
    pendingMapId = null;
    setMatchmakingStatus('IDLE', 'Search cancelled.');
  });

  client.on('matchmaking_error', ({ code }) => {
    pendingMapId = null;
    const message =
      code === 'ALREADY_ACTIVE'
        ? 'This account is already queued or playing in another tab.'
        : 'That action is not available in the current state.';
    setMatchmakingStatus('IDLE', message);
  });

  client.on('matched', (data) => {
    pendingMapId = null;
    phase = 'IN_GAME';
    currentMap = data.map;
    renderer.setLocalSocketId(data.yourSocketId);
    renderer.start();
    startInput((input) => {
      renderer.recordInput(input);
      client.emit('input', input);
    });
    document.getElementById('match-label').textContent = `${data.map.name} vs ${data.opponentName}`;
    showView('game');
  });

  client.on('state', (state) => {
    if (state.mapUpdate && currentMap) {
      currentMap = {
        ...currentMap,
        revision: state.mapUpdate.revision,
        walls: state.mapUpdate.walls
      };
    }
    renderer.pushState({ ...state, map: currentMap });
  });
  client.on('game_over', showGameOver);

  client.on('disconnect', (reason) => {
    stopInput();
    if (!getToken()) return;
    if (phase === 'IN_GAME') {
      renderer.stop();
    }
    pendingMapId = null;
    showView('lobby');
    setMatchmakingStatus('IDLE', `Disconnected: ${reason}`);
  });
}

function cancelMatch() {
  if (socket && socket.connected && phase === 'QUEUED') socket.emit('cancel_match');
}

function showGameOver(result) {
  if (phase === 'RESULT') return;
  phase = 'RESULT';
  stopInput();
  const reasonText = {
    WIN: 'Victory by elimination',
    ABORTED: 'Opponent disconnected',
    DRAW: 'Match ended without a winner'
  };
  document.getElementById('gom-reason').textContent =
    reasonText[result.endReason] || 'Match complete';
  document.getElementById('gom-winner').textContent = result.winner
    ? `${result.winner.username} wins the match.`
    : 'No winner was recorded.';

  const playersElement = document.getElementById('gom-players');
  playersElement.replaceChildren();
  const players = [...(result.players || [])].sort((a, b) => b.finalScore - a.finalScore);
  for (const player of players) {
    const row = document.createElement('div');
    row.className = `result-player${result.winner?.userId === player.userId ? ' winner' : ''}`;
    const name = document.createElement('span');
    const score = document.createElement('strong');
    name.textContent = player.username;
    score.textContent = String(player.finalScore);
    row.append(name, score);
    playersElement.appendChild(row);
  }
  document.getElementById('game-over-modal').classList.remove('hidden');
}

function returnToLobby() {
  document.getElementById('game-over-modal').classList.add('hidden');
  renderer.stop();
  showView('lobby');
  setMatchmakingStatus('IDLE', 'Ready for another match.');
}

function disconnectSocket() {
  stopInput();
  renderer.stop();
  pendingMapId = null;
  currentMap = null;
  phase = 'IDLE';
  if (socket) socket.disconnect();
  socket = null;
}
