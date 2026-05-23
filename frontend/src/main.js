import { initUI } from './ui/login.js';
import { initLobby } from './ui/lobby.js';
import { initGame } from './game/socket.js';
import { initHistory } from './ui/history.js';
import { initRanking } from './ui/ranking.js';

window.app = {};

document.addEventListener('DOMContentLoaded', ()=>{
  initUI();
  initLobby();
  initGame();
  initHistory();
  initRanking();
});
