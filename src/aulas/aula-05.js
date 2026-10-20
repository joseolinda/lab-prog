import * as Blockly from 'blockly';
import 'blockly/blocks';
import * as Pt from 'blockly/msg/pt-br';
import { advance, createState, forXml, pythonLines, rangeExpression } from '../for-model.js';

Blockly.setLocale(Pt);

export default {
  id: 'aula-05',
  number: 5,
  title: 'Repetição com for',
  description: 'Aprenda for e range passo a passo, execute os exemplos no seu computador e resolva três exercícios.',
  mount,
};

const pages = [
  { label: 'Conceito', title: 'Repetir sem reescrever.', text: 'Na aula 03, o if escolhia um caminho. Agora, o for percorre os itens de uma sequência e executa o mesmo bloco para cada item. Vamos começar com sequências de números.', tip: 'Uma sequência → um valor por vez → o mesmo bloco em cada volta.' },
  { label: 'Primeiro for', title: 'Seu primeiro laço, linha por linha.', text: 'Abra seu editor: esta aula também acontece no seu computador. Primeiro escreva o programa, depois preveja a saída e só então execute para conferir.', tip: 'Os dois-pontos abrem o bloco. Use quatro espaços antes de print(numero).' },
  { label: 'range', title: 'Onde começa? Onde para?', text: 'range produz uma sequência de inteiros. Com um argumento, começa em 0. Com dois, você escolhe o início. Nas duas formas, o passo é 1 e o limite final fica de fora.', tip: 'Para incluir o número 5 em uma contagem crescente de 1 em 1, use limite 6.' },
  { label: 'Passo', title: 'Mude o ritmo da contagem.', text: 'O terceiro argumento de range é o passo: quanto o valor muda entre uma volta e outra. Um passo positivo avança; um passo negativo permite uma contagem regressiva.', tip: 'O passo deve combinar com a direção da contagem. Passo 0 causa ValueError no Python.' },
  { label: 'Prática guiada', title: 'Guarde o resultado de cada volta.', text: 'Vamos somar os números de 1 a 5. A variável total começa em 0 e acumula cada número visitado pelo for. Acompanhe as contas e depois faça o programa rodar no seu computador.', tip: 'Inicialize total antes do laço. O print sem recuo mostra o resultado apenas uma vez, ao final.' },
  { label: 'Exercícios', title: 'Agora é com você.', text: 'Resolva as três questões usando for. Para cada uma: preveja a saída, escreva o programa em um arquivo .py, salve, execute no seu computador e compare o resultado.', tip: 'Entregue os três arquivos .py e registre a saída de cada programa no terminal.' },
];

const firstConfig = { start: 1, stop: 4, step: 1, form: 'start-stop' };
const rangeExamples = [
  { start: 0, stop: 5, step: 1, form: 'stop', note: 'Um argumento: o início é 0. O 5 é o limite e não entra.' },
  { start: 1, stop: 6, step: 1, form: 'start-stop', note: 'Dois argumentos: começa em 1 e para antes de 6.' },
  { start: 1, stop: 5, step: 1, form: 'start-stop', note: 'Ao trocar o limite de 6 para 5, o último valor passa a ser 4.' },
];
const stepExamples = [
  { start: 2, stop: 11, step: 2, note: 'De 2 em 2: visita 2, 4, 6, 8 e 10. O próximo valor seria 12, além do limite.' },
  { start: 5, stop: 0, step: -1, note: 'De trás para frente: visita 5, 4, 3, 2 e 1. O limite 0 também fica de fora.' },
  { start: 5, stop: 0, step: 1, note: 'Sequência vazia: um passo positivo não leva de 5 até um limite menor. O bloco não executa; só aparece Fim.' },
];
const sumLines = ['total = 0', 'for numero in range(1, 6):', '    total = total + numero', 'print("Total:", total)'];
const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));

function mount(root) {
  let page = 0, rangeMode = 0, stepMode = 0, sumStep = 0;
  let config = { ...firstConfig }, state = createState(config), workspace;
  const query = selector => root.querySelector(selector);

  root.innerHTML = `<main class="for-lesson">
    <div class="eyebrow">AULA 05 · REPETIÇÃO COM FOR <span id="for-counter"></span></div>
    <section class="intro"><div><h1>Aprenda a <em>repetir.</em></h1><p>Entenda uma volta. Execute no seu computador. Descubra as próximas.</p></div><div class="lesson-stamp"><span>PARA CADA → REPITA</span><small>PENSE · ESCREVA · EXECUTE</small></div></section>
    <nav aria-label="Conteúdo da aula">${pages.map((item, index) => `<button data-for-page="${index}"><small>0${index + 1}</small>${item.label}</button>`).join('')}</nav>
    <section id="for-content"></section>
    <footer><a href="#/">← Todas as aulas</a><div><button id="for-prev" class="quiet">← Anterior</button><span id="for-position"></span><button id="next" data-for-next>Próximo →</button></div><span class="keyboard">NAVEGUE COM ← →</span></footer>
  </main>`;

  function code(lines, active = -1) {
    return `<div class="code-title"><span>PYTHON</span></div><pre aria-label="Código Python"><code>${lines.map((line, index) => `<span class="code-line ${index === active ? 'highlight' : ''}"><i aria-hidden="true">${index + 1}</i>${escapeHtml(line)}</span>`).join('')}</code></pre>`;
  }

  function computerTask(file, steps) {
    return `<aside class="for-computer"><div class="for-task-title"><span class="eyebrow">NO SEU COMPUTADOR</span><code>${file}</code></div><ol>${steps.map(text => `<li>${text}</li>`).join('')}</ol><p>Salve após cada alteração e execute novamente com o comando da etapa “Primeiro for”, trocando o nome do arquivo.</p></aside>`;
  }

  function blockPanel() {
    return `<div class="example-blocks"><div class="blockly-caption">O MESMO EXEMPLO EM BLOCOS <span>Blockly · português</span></div><div id="for-blocks" class="blockly-example" role="img" aria-label="Para cada número da sequência, exibir o número; depois exibir Fim"></div><p class="blocks-note">Nos blocos, a lista mostra os números produzidos por <code>range</code>. O bloco encaixado representa o recuo do Python.</p></div>`;
  }

  function overview() {
    return `<div class="overview"><div class="concept-map for-concept"><span class="flow-start">SEQUÊNCIA: 1, 2, 3</span><div class="stem"></div><div class="for-sequence" aria-label="Um número por volta"><span>1<small>1ª volta</small></span><span>2<small>2ª volta</small></span><span>3<small>3ª volta</small></span></div><div class="stem"></div><div class="flow-result selected">Para cada número: <code>print(numero)</code></div><p class="loop-return">↶ O mesmo bloco, um novo valor.</p><div class="flow-end">Depois do último item<br>↓<br>Continuar o programa</div></div><div class="overview-right"><span class="eyebrow">TRÊS IDEIAS PARA COMEÇAR</span>${[
      ['01', 'Uma sequência', 'range define os números que vamos percorrer.', 2],
      ['02', 'Uma variável', 'numero recebe um valor diferente a cada volta.', 1],
      ['03', 'Um bloco', 'As linhas com recuo se repetem para cada valor.', 1],
    ].map(([number, title, text, target]) => `<button class="mode-card" data-jump="${target}"><span class="mode-symbol">${number}</span><span><b>${title}</b><small>${text}</small></span><span aria-hidden="true">↗</span></button>`).join('')}${blockPanel()}</div></div>${computerTask('aula04.py', ['Abra a pasta da aula no seu editor de Python e crie o arquivo <code>aula04.py</code>.', 'Deixe o terminal pronto. Na próxima etapa, você vai digitar e executar seu primeiro <code>for</code>.'])}`;
  }

  function firstFor() {
    return `<div class="for-setup"><span class="eyebrow">PREPARE → ESCREVA → SALVE → EXECUTE</span><ol class="for-steps"><li><b>Prepare o arquivo.</b> Use Python 3 instalado no computador. Abra <code>aula04.py</code> no editor e digite as três linhas abaixo, sem os números da margem.</li><li><b>Cuide do recuo.</b> Termine a primeira linha com <code>:</code>. Na segunda, use quatro espaços. Na terceira, volte à margem esquerda.</li><li><b>Salve e execute.</b> Abra o terminal na pasta do arquivo. Digite o comando do seu sistema e pressione Enter.</li></ol><div class="for-commands"><div><span>WINDOWS</span><code>py aula04.py</code></div><div><span>macOS / LINUX</span><code>python3 aula04.py</code></div></div><p class="trace">No Windows, se <code>py</code> não estiver disponível, tente <code>python aula04.py</code>. Se nenhum comando for reconhecido, confira a instalação do Python 3 com o professor. Digite o comando no terminal, fora do prompt <code>&gt;&gt;&gt;</code> do Python.</p></div><div class="experiment">${sequencePanel()}<div class="playground">${simulation()}<ol class="for-line-guide"><li><code>for numero in range(1, 4):</code><span>Leia: “para cada número em 1, 2 e 3”. A variável <code>numero</code> recebe esses valores, um de cada vez.</span></li><li><code>    print(numero)</code><span>Com quatro espaços, pertence ao laço. Executa uma vez para cada valor.</span></li><li><code>print("Fim")</code><span>Sem recuo, fica fora do laço. Executa uma vez quando as voltas terminam.</span></li></ol></div></div>${computerTask('aula04.py', ['Antes de executar, anote sua previsão: quais linhas vão aparecer no terminal?', 'Execute o arquivo. Confira: <code>1</code>, <code>2</code>, <code>3</code> e <code>Fim</code>, cada um em uma linha.', 'Troque <code>range(1, 4)</code> por <code>range(1, 5)</code>, salve e execute outra vez. Explique por que apareceu mais um número.'])}`;
  }

  function sequencePanel() {
    return `<div><div class="visual-panel"><div class="panel-label"><span>UMA VOLTA POR VALOR</span><span class="live-dot">PASSO A PASSO</span></div><div class="flow for-flow"><span class="flow-start">${escapeHtml(rangeExpression(config))}</span><div class="stem"></div><div class="for-sequence">${state.values.length ? state.values.map((value, index) => `<span class="${state.index === index && state.phase !== 'done' ? 'current' : ''} ${index < state.iterations ? 'visited' : ''}">${value}<small>${index + 1}ª volta</small></span>`).join('') : '<p class="diagram-note">Nenhum número nesta sequência.</p>'}</div><div class="stem"></div><div class="flow-result ${state.phase === 'loop' || state.phase === 'print' ? 'selected' : ''}">${state.value === null ? 'A variável numero aguarda o primeiro valor.' : `numero = ${state.value} → print(numero)`}</div><p class="loop-return">↶ Receber o próximo valor e repetir o bloco.</p><div class="flow-result no ${state.phase === 'done' ? 'selected' : ''}">Sequência encerrada → print("Fim")</div><p class="diagram-note">${state.iterations} de ${state.values.length} voltas com o print executado.</p></div></div>${blockPanel()}</div>`;
  }

  function simulation() {
    const active = { ready: -1, loop: 0, print: 1, done: 2 }[state.phase];
    const status = state.phase === 'done' ? 'A sequência terminou. O print fora do laço exibiu Fim.' : state.phase === 'ready' ? 'Antes de começar: nenhum valor foi recebido ou impresso.' : state.phase === 'loop' ? `numero recebeu ${state.value}. O próximo passo executa print(numero).` : `${state.value} foi impresso. O próximo passo busca outro valor na sequência.`;
    return `${code(pythonLines(config), active)}<div class="for-actions"><button id="for-step" ${state.phase === 'done' ? 'disabled' : ''}>→ Próximo passo</button><button id="for-run" ${state.phase === 'done' ? 'disabled' : ''}>▶ Simular tudo</button><button id="for-reset" class="quiet">↺ Reiniciar</button></div><div class="console interactive-result" role="status" aria-live="polite" aria-atomic="true"><div class="result-heading"><span>SAÍDA DO PROGRAMA</span><span class="result-live">SIMULAÇÃO</span></div><samp class="for-output">${state.output.length ? escapeHtml(state.output.join('\n')) : 'Nenhuma saída ainda.'}</samp><small class="result-hint">${status}</small></div><p class="trace">Use a simulação para acompanhar as linhas. Depois execute o código no seu computador.</p>`;
  }

  function rangePage() {
    return `<div class="toggle for-variants" aria-label="Formas de range">${rangeExamples.map((example, index) => `<button data-range-mode="${index}" aria-pressed="${rangeMode === index}" class="${rangeMode === index ? 'chosen' : ''}">${rangeExpression(example)}</button>`).join('')}</div><p class="for-example-note">${rangeExamples[rangeMode].note}</p><div class="experiment">${sequencePanel()}<div class="playground"><div class="for-anatomy"><span><small>INÍCIO</small><b>${config.start}</b></span><span><small>LIMITE · NÃO ENTRA</small><b>${config.stop}</b></span><span><small>PASSO</small><b>+1</b></span></div>${simulation()}</div></div>${computerTask('intervalos.py', ['Copie um dos exemplos acima para <code>intervalos.py</code>. Antes de rodar, escreva o primeiro e o último número esperados.', 'Teste as três formas: <code>range(5)</code>, <code>range(1, 6)</code> e <code>range(1, 5)</code>. Salve e execute a cada mudança.', 'Compare as saídas: a primeira começa em 0; as outras começam em 1. Em nenhum caso o limite final aparece.'])}`;
  }

  function stepPage() {
    return `<div class="toggle for-variants" aria-label="Passos de range">${stepExamples.map((example, index) => `<button data-step-mode="${index}" aria-pressed="${stepMode === index}" class="${stepMode === index ? 'chosen' : ''}">${['De 2 em 2', 'Contagem regressiva', 'E se a direção não combinar?'][index]}</button>`).join('')}</div><p class="for-example-note">${stepExamples[stepMode].note}</p><div class="experiment">${sequencePanel()}<div class="playground"><div class="for-anatomy"><span><small>INÍCIO</small><b>${config.start}</b></span><span><small>LIMITE · NÃO ENTRA</small><b>${config.stop}</b></span><span><small>PASSO</small><b>${config.step > 0 ? '+' : ''}${config.step}</b></span></div>${simulation()}<div class="tip">Leia na ordem: <code>range(início, limite, passo)</code>. O limite fica de fora também na contagem regressiva.</div></div></div>${computerTask('passos.py', ['Execute o exemplo <code>range(2, 11, 2)</code>. Confira os valores 2, 4, 6, 8 e 10, seguidos de <code>Fim</code>.', 'Agora execute <code>range(5, 0, -1)</code>. Antes de rodar, preveja se o 0 aparecerá.', 'Troque o passo <code>-1</code> por <code>1</code>, salve e execute. Explique por que aparece apenas <code>Fim</code>.'])}`;
  }

  function sumPage() {
    const total = sumStep * (sumStep + 1) / 2;
    return `<div class="experiment"><div class="visual-panel for-sum"><div class="panel-label"><span>ACOMPANHE O ACUMULADOR</span><span>${sumStep} / 5 VOLTAS</span></div><div class="for-total"><small>total</small><strong>${total}</strong><span>${sumStep ? `${total - sumStep} + ${sumStep} = ${total}` : 'Começamos com total = 0.'}</span></div><table class="for-table"><caption>Como a soma muda em cada volta</caption><thead><tr><th scope="col">numero</th><th scope="col">total antes</th><th scope="col">total depois</th></tr></thead><tbody>${Array.from({ length: 5 }, (_, index) => { const n = index + 1; return `<tr class="${n === sumStep ? 'active' : ''} ${n > sumStep ? 'pending' : ''}"><th scope="row">${n}</th><td>${n * (n - 1) / 2}</td><td>${n * (n + 1) / 2}</td></tr>`; }).join('')}</tbody></table><div class="for-actions"><button id="sum-step" ${sumStep === 5 ? 'disabled' : ''}>→ Somar próxima volta</button><button id="sum-reset" class="quiet">↺ Reiniciar</button></div></div><div class="playground">${code(sumLines, sumStep === 0 ? 0 : 2)}<ol class="for-steps"><li><b>Antes do laço:</b> <code>total = 0</code> prepara o acumulador uma única vez.</li><li><b>A cada volta:</b> some <code>numero</code> ao valor que já estava em <code>total</code>.</li><li><b>Depois do laço:</b> <code>print("Total:", total)</code> exibe a soma final. Observe que ele voltou à margem esquerda.</li></ol><div class="console"><span>SAÍDA ESPERADA AO EXECUTAR O ARQUIVO</span><b>Total: 15</b></div><p class="trace">O botão acompanha as contas. A tabela mostra como a variável muda; o programa imprime apenas o total final.</p></div></div>${computerTask('soma.py', ['Digite o código em <code>soma.py</code>, salve e execute. Confira a saída <code>Total: 15</code>.', 'Adicione <code>print("Parcial:", total)</code> dentro do laço, após a soma, com quatro espaços. Execute e observe 1, 3, 6, 10 e 15 como resultados parciais.', 'Retire o print parcial e adapte o intervalo para somar de 1 até 10. Preveja a soma e confira a saída <code>Total: 55</code>.'])}`;
  }

  function exercises() {
    const questions = [
      { title: 'Contagem completa', file: 'questao01.py', text: 'Escreva um programa que mostre os números de 1 a 10, um por linha. Depois do laço, exiba a mensagem Fim da contagem uma única vez.', steps: 'Antes de executar, anote quantas vezes o print dentro do for vai rodar. Execute o arquivo e confira sua previsão.', check: 'Devem aparecer 10 números, de 1 a 10, e depois Fim da contagem.', hint: 'Use início 1 e escolha um limite que permita incluir o 10. A mensagem final deve ficar sem recuo.' },
      { title: 'Tabuada do 7', file: 'questao02.py', text: 'Use for para mostrar a tabuada do 7, de 1 a 10, no formato 7 x 1 = 7. Crie a variável numero = 7 antes do laço e use uma variável multiplicador para percorrer o intervalo.', steps: 'Calcule numero * multiplicador a cada volta. Depois de testar com 7, troque numero para 4, salve e execute novamente.', check: 'Com 7, a primeira linha deve ser 7 x 1 = 7 e a última 7 x 10 = 70. Com 4, a última deve ser 4 x 10 = 40.', hint: 'O print aceita vários valores separados por vírgula: print(numero, "x", multiplicador, "=", numero * multiplicador). Ele pertence ao bloco do for.' },
      { title: 'Soma dos números pares', file: 'questao03.py', text: 'Some os números pares de 2 a 20, incluindo os dois extremos. Use for, range com passo 2 e uma variável total. Ao terminar, exiba apenas o total acumulado.', steps: 'Comece com total = 0 fora do laço. Antes de executar, anote a sequência de números que serão somados. Rode o programa e confira a soma.', check: 'A saída final deve ser Total: 110. Altere o programa para somar até 10 e confira Total: 30.', hint: 'A sequência começa em 2, avança de 2 em 2 e precisa incluir o 20. Atualize total dentro do laço e exiba o resultado fora dele.' },
    ];
    return `<div class="for-exercise-intro"><span class="eyebrow">03 QUESTÕES · PRÁTICA NO COMPUTADOR</span><p>Use o terminal na pasta dos arquivos. No Windows: <code>py questao01.py</code>. No macOS/Linux: <code>python3 questao01.py</code>. Troque o nome para executar as outras questões.</p></div><ol class="for-exercises">${questions.map((question, index) => `<li><article><div class="for-exercise-heading"><span class="for-question-number">0${index + 1}</span><div><h3>${question.title}</h3><code>${question.file}</code></div></div><p>${question.text}</p><p><b>Faça e teste:</b> ${question.steps}</p><div class="for-check"><b>Confira no terminal</b><p>${question.check}</p></div><details><summary>Precisa de uma dica?</summary><p>${escapeHtml(question.hint)}</p></details></article></li>`).join('')}</ol>`;
  }

  function rerender(focus) {
    render();
    if (focus) query(focus)?.focus({ preventScroll: true });
  }

  function render() {
    workspace?.dispose();
    workspace = null;
    const item = pages[page];
    query('#for-counter').textContent = `0${page + 1} / 0${pages.length}`;
    query('#for-position').textContent = `${page + 1} / ${pages.length}`;
    query('#for-prev').disabled = page === 0;
    query('[data-for-next]').disabled = page === pages.length - 1;
    root.querySelectorAll('[data-for-page]').forEach(button => {
      const active = Number(button.dataset.forPage) === page;
      button.classList.toggle('active', active);
      button.setAttribute('aria-current', active ? 'step' : 'false');
    });
    const contents = [overview, firstFor, rangePage, stepPage, sumPage, exercises];
    query('#for-content').innerHTML = `<div class="section-heading"><div><span class="eyebrow">0${page + 1} / ${item.label.toUpperCase()}</span><h2>${item.title}</h2></div><span class="pill">${page === 0 ? 'VISÃO GERAL' : page === 5 ? 'SUA VEZ' : 'PASSO A PASSO'}</span></div><p class="explanation">${item.text}</p>${contents[page]()}<aside class="takeaway"><span aria-hidden="true">✦</span><p>${item.tip}</p></aside>`;

    query('#for-step')?.addEventListener('click', () => { advance(state); rerender(state.phase === 'done' ? '#for-reset' : '#for-step'); });
    query('#for-run')?.addEventListener('click', () => { while (state.phase !== 'done') advance(state); rerender('#for-reset'); });
    query('#for-reset')?.addEventListener('click', () => { state = createState(config); rerender('#for-reset'); });
    query('#sum-step')?.addEventListener('click', () => { sumStep++; rerender(sumStep === 5 ? '#sum-reset' : '#sum-step'); });
    query('#sum-reset')?.addEventListener('click', () => { sumStep = 0; rerender('#sum-reset'); });
    root.querySelectorAll('[data-jump]').forEach(button => button.onclick = () => go(Number(button.dataset.jump)));
    for (const [selector, examples, key] of [['[data-range-mode]', rangeExamples, 'rangeMode'], ['[data-step-mode]', stepExamples, 'stepMode']]) {
      root.querySelectorAll(selector).forEach(button => button.onclick = () => {
        const index = Number(button.dataset[key]);
        if (key === 'rangeMode') rangeMode = index; else stepMode = index;
        config = { ...examples[index] };
        state = createState(config);
        rerender(`[data-${key === 'rangeMode' ? 'range-mode' : 'step-mode'}="${index}"]`);
      });
    }
    const container = query('#for-blocks');
    if (container) {
      workspace = Blockly.inject(container, { readOnly: true, renderer: 'zelos', scrollbars: true, sounds: false, zoom: { controls: true, wheel: false, startScale: .8, minScale: .4, maxScale: 1.4 }, move: { scrollbars: true, drag: true, wheel: false } });
      Blockly.Xml.domToWorkspace(Blockly.utils.xml.textToDom(forXml(config)), workspace);
      workspace.zoomToFit();
    }
  }

  function go(target) {
    page = Math.max(0, Math.min(pages.length - 1, target));
    config = { ...(page === 2 ? rangeExamples[rangeMode] : page === 3 ? stepExamples[stepMode] : firstConfig) };
    state = createState(config);
    sumStep = 0;
    render();
    query('.for-lesson').scrollIntoView({ block: 'start' });
  }

  root.querySelectorAll('[data-for-page]').forEach(button => button.onclick = () => go(Number(button.dataset.forPage)));
  query('#for-prev').onclick = () => go(page - 1);
  query('[data-for-next]').onclick = () => go(page + 1);
  const keydown = event => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.target.closest('input, select, textarea, button, a, summary, [contenteditable="true"]')) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      go(page + (event.key === 'ArrowRight' ? 1 : -1));
    }
  };
  const resize = () => { if (workspace) { Blockly.svgResize(workspace); workspace.zoomToFit(); } };
  document.addEventListener('keydown', keydown);
  window.addEventListener('resize', resize);
  render();

  return () => {
    workspace?.dispose();
    document.removeEventListener('keydown', keydown);
    window.removeEventListener('resize', resize);
  };
}
