import './style.css';
import { mountSlides } from './slides.js';

// Cada arquivo em aulas/ exporta os dados da aula e, opcionalmente, uma montagem própria.
const modules = import.meta.glob('./aulas/*.js', { eager: true });
const aulas = Object.values(modules).map(module => module.default)
  .sort((a, b) => a.number - b.number);
const ids = new Set();
for (const aula of aulas) {
  if (!aula.id || ids.has(aula.id) || !Number.isInteger(aula.number) || !aula.title ||
      (typeof aula.mount !== 'function' && !aula.slides?.length)) {
    throw new Error('Cadastro de aula inválido: confira id único, number, title e slides ou mount.');
  }
  ids.add(aula.id);
}
export const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));
const app = document.querySelector('#app');
app.innerHTML = `<header><a class="brand" href="#/">LAB<span>/</span>PROG <small>ENERGIF</small></a><div class="course-picker"><label for="aula-select">AULAS</label><select id="aula-select"><option value="">Todas as aulas</option>${aulas.map(a => `<option value="${escapeHtml(a.id)}">Aula ${String(a.number).padStart(2, '0')} · ${escapeHtml(a.title)}</option>`).join('')}</select></div><button id="fullscreen" class="quiet">⛶ <span>Tela cheia</span></button></header><div id="course-content"></div>`;
const root = document.querySelector('#course-content');
const select = document.querySelector('#aula-select');
let cleanup;
function showRoute() {
  cleanup?.();
  cleanup = undefined;
  const id = location.hash.replace(/^#\/?/, '');
  const aula = aulas.find(a => a.id === id);
  select.value = aula?.id || '';
  if (aula) {
    document.title = `Aula ${String(aula.number).padStart(2, '0')} · ${aula.title} | LAB/PROG`;
    cleanup = aula.mount ? aula.mount(root) : mountSlides(root, aula);
  } else {
    document.title = 'Aulas de programação | LAB/PROG';
    root.innerHTML = `<main class="catalog"><div class="eyebrow">LABORATÓRIO DE LÓGICA · PYTHON</div><section class="intro"><div><h1 class="brand bigger">LAB<span>/</span>PROG. <br><em>Aulas interativas.</em></h1><p>Escolha uma aula para explorar conceitos, testar exemplos e aprender na prática.</p></div></section>${id ? '<p role="status">Aula não encontrada. Escolha uma das aulas disponíveis.</p>' : ''}<div class="lesson-catalog">${aulas.map(a => `<a class="lesson-card" href="#/${escapeHtml(a.id)}"><span class="eyebrow">AULA ${String(a.number).padStart(2, '0')}</span><h2>${escapeHtml(a.title)}</h2><p>${escapeHtml(a.description || '')}</p><span class="open-lesson">Abrir aula →</span></a>`).join('')}</div></main>`;
  }
}
select.addEventListener('change', () => { location.hash = select.value ? `/${select.value}` : '/'; });
window.addEventListener('hashchange', showRoute);
document.querySelector('#fullscreen').onclick = async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  } catch {
    document.querySelector('#fullscreen').textContent = 'Use o modo de apresentação do navegador';
  }
};
showRoute();
