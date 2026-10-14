const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Apresentação padrão: novas aulas podem fornecer apenas os dados de seus slides.
export function mountSlides(root, aula) {
  let current = 0;
  const number = String(aula.number).padStart(2, '0');
  root.innerHTML = `<main><div class="eyebrow">AULA ${number}<span id="counter"></span></div><section class="intro"><div><h1>${escape(aula.title)}</h1><p>${escape(aula.description || '')}</p></div></section><nav aria-label="Conteúdo da aula" style="grid-template-columns:repeat(${Math.min(aula.slides.length, 6)}, minmax(0, 1fr))">${aula.slides.map((s, i) => `<button data-page="${i}">${escape(s.label || s.title)}</button>`).join('')}</nav><section id="lesson"></section><footer><a href="#/">← Todas as aulas</a><div><button id="previous" class="quiet">← Anterior</button><span id="position"></span><button id="next">Próximo →</button></div></footer></main>`;
  function render() {
    const slide = aula.slides[current];
    root.querySelector('#counter').textContent = `${current + 1} / ${aula.slides.length}`;
    root.querySelector('#position').textContent = `${current + 1} / ${aula.slides.length}`;
    root.querySelector('#previous').disabled = current === 0;
    root.querySelector('#next').disabled = current === aula.slides.length - 1;
    root.querySelectorAll('[data-page]').forEach(b => {
      b.classList.toggle('active', +b.dataset.page === current);
      b.setAttribute('aria-current', +b.dataset.page === current ? 'step' : 'false');
    });
    root.querySelector('#lesson').innerHTML = `<div class="section-heading"><h2>${escape(slide.title)}</h2></div>${(slide.paragraphs || []).map(p => `<p class="explanation">${escape(p)}</p>`).join('')}${slide.code ? `<pre><code>${escape(slide.code)}</code></pre>` : ''}${slide.tip ? `<aside class="takeaway"><span>✦</span><p>${escape(slide.tip)}</p></aside>` : ''}`;
  }
  function go(index) { current = Math.max(0, Math.min(aula.slides.length - 1, index)); render(); }
  root.querySelectorAll('[data-page]').forEach(b => b.onclick = () => go(+b.dataset.page));
  root.querySelector('#previous').onclick = () => go(current - 1);
  root.querySelector('#next').onclick = () => go(current + 1);
  const keydown = e => {
    if (['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'].includes(document.activeElement.tagName) || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === 'ArrowRight') go(current + 1);
    if (e.key === 'ArrowLeft') go(current - 1);
  };
  document.addEventListener('keydown', keydown);
  render();
  return () => document.removeEventListener('keydown', keydown);
}
