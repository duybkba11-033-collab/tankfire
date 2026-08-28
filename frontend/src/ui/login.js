import { apiRequest } from '../api.js';
import { closeDataPanels, showPlayer, showView } from './view.js';

const TOKEN_KEY = 'tf_token';
const USER_KEY = 'tf_user';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function initUI() {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const loginFeedback = document.getElementById('login-feedback');
  const registerFeedback = document.getElementById('register-feedback');

  document.getElementById('btn-show-register').addEventListener('click', () => {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    registerFeedback.textContent = '';
  });
  document.getElementById('btn-cancel-register').addEventListener('click', () => {
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    loginFeedback.textContent = '';
  });

  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = document.getElementById('btn-register');
    button.disabled = true;
    registerFeedback.className = 'feedback';
    registerFeedback.textContent = 'Creating account...';
    try {
      const username = document.getElementById('reg-username').value.trim();
      const password = document.getElementById('reg-password').value;
      await apiRequest('/register', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      registerFeedback.classList.add('success');
      registerFeedback.textContent = 'Account created. You can sign in now.';
      document.getElementById('login-username').value = username;
      document.getElementById('login-password').focus();
      window.setTimeout(() => {
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
      }, 700);
    } catch (error) {
      registerFeedback.textContent = error.message;
    } finally {
      button.disabled = false;
    }
  });

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = document.getElementById('btn-login');
    button.disabled = true;
    loginFeedback.textContent = 'Signing in...';
    try {
      const username = document.getElementById('login-username').value.trim();
      const password = document.getElementById('login-password').value;
      const result = await apiRequest('/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      localStorage.setItem(TOKEN_KEY, result.token);
      localStorage.setItem(USER_KEY, JSON.stringify(result.user));
      showPlayer(result.user);
      showView('lobby');
      loginFeedback.textContent = '';
    } catch (error) {
      loginFeedback.textContent = error.message;
    } finally {
      button.disabled = false;
    }
  });

  document.getElementById('btn-logout-top').addEventListener('click', logout);
  window.addEventListener('auth_expired', () => logout(false));
  const savedUser = readSavedUser();
  if (getToken() && savedUser) {
    showPlayer(savedUser);
    showView('lobby');
  } else {
    logout(false);
  }
}

export function logout(notify = true) {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  closeDataPanels();
  showView('auth');
  if (notify) window.dispatchEvent(new Event('logout'));
}

function readSavedUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
}
