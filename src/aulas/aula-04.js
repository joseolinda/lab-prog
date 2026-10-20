import * as Blockly from 'blockly';
import 'blockly/blocks';
import * as Pt from 'blockly/msg/pt-br';
import { createState, advance, pythonLines, whileXml } from '../while-model.js';
Blockly.setLocale(Pt);
export default {
  id: 'aula-04', number: 4, title: 'Repetição com while',
  description: 'Repita enquanto uma condição for verdadeira. Explore contadores, testes e condições de parada.', mount,
};
const pages = [
  { label: 'Conceito', title: 'Uma pergunta. Várias voltas.', text: 'while significa “enquanto”. Antes de cada volta, o Python testa a condição. Se for True, executa o bloco e volta ao teste. Se for False, sai do laço.', tip: 'O if escolhe um caminho; o while volta a testar e pode repetir o bloco.', config: { start: 1, limit: 3, increment: 1, operator: '<=' } },
  { label: 'Contador', title: 'Conte uma volta de cada vez.', text: 'O contador guarda o valor atual. Defina onde ele começa e até onde deve ir. A mensagem é exibida antes de somar 1 ao contador.', tip: 'Inicializar → testar → executar → atualizar → testar novamente.', config: { start: 1, limit: 5, increment: 1, operator: '<=' } },
  { label: 'Condição', title: 'E se o teste já começar falso?', text: 'O teste acontece antes do bloco. Por isso, um while pode executar zero vezes. Compare < com <= e experimente um início maior que o limite.', tip: 'Com início 5 e limite 3, o bloco não executa. Apenas “Fim” é exibido.', config: { start: 5, limit: 3, increment: 1, operator: '<=' } },
  { label: 'Atualização', title: 'O tamanho do passo muda o caminho.', text: 'O incremento altera o contador a cada volta. Um passo maior pode ultrapassar o limite sem passar exatamente por ele. O teste decide se haverá outra volta.', tip: 'Com início 1, limite 6 e passo 2, a saída é 1, 3 e 5. O próximo teste usa 7.', config: { start: 1, limit: 6, increment: 2, operator: '<=' } },
  { label: 'Laço infinito', title: 'Sem mudança, não há saída.', text: 'Se a condição continua verdadeira e nada faz o contador avançar, o while não termina. Experimente o passo 0 e depois corrija para 1.', tip: 'A demonstração para após 12 voltas. Esse limite não existe no Python exibido.', config: { start: 1, limit: 3, increment: 0, operator: '<=' } },
  { label: 'Desafio', title: 'Pense antes de executar.', text: 'Leia o código: contador começa em 2, repete enquanto for menor que 8 e avança de 2 em 2. Quantas vezes o print dentro do while será executado?', tip: 'Não conte o print("Fim"): ele fica fora do laço, sem recuo.', config: { start: 2, limit: 8, increment: 2, operator: '<' } },
];
const escape = v => String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
function mount(root) {
  let page = 0, config = { ...pages[0].config }, state = createState(config), workspace, answer = null;
  root.innerHTML = `<main class="while-lesson"><div class="eyebrow">AULA 04 · REPETIÇÃO COM WHILE <span id="while-counter"></span></div><section class="intro"><div><h1>Aprenda a <em>repetir.</em></h1><p>Uma condição controla cada volta. Você controla a experiência.</p></div><div class="lesson-stamp"><span>TESTAR ↻ REPETIR</span><small>PENSE · TESTE · APRENDA</small></div></section><nav aria-label="Conteúdo da aula">${pages.map((p,i)=>`<button data-while-page="${i}"><small>0${i+1}</small>${p.label}</button>`).join('')}</nav><section id="while-content"></section><footer><a href="#/">← Todas as aulas</a><div><button id="while-prev" class="quiet">← Anterior</button><span id="while-position"></span><button id="next" data-while-next>Próximo →</button></div><span class="keyboard">NAVEGUE COM ← →</span></footer></main>`;
  const query = s => root.querySelector(s);
  function render() {
    workspace?.dispose(); workspace = null;
    const p = pages[page], done = state.phase === 'done';
    query('#while-counter').textContent = `0${page+1} / 06`;
    query('#while-position').textContent = `${page+1} / ${pages.length}`;
    query('#while-prev').disabled = page === 0;
    query('[data-while-next]').disabled = page === pages.length-1;
    root.querySelectorAll('[data-while-page]').forEach(b=>{ const active=+b.dataset.whilePage===page; b.classList.toggle('active',active); b.setAttribute('aria-current',active?'step':'false'); });
    const line = { init:0, test:1, print:2, update:3, done:4 }[state.phase];
    const status = state.stopped ? 'Demonstração pausada: 12 voltas sem encerrar.' : done ? 'Condição falsa: o programa saiu do laço e imprimiu “Fim”.' : {init:'Contador inicializado. O próximo passo testa a condição.',test:'Condição verdadeira. O próximo passo executa print(contador).',print:'Valor impresso. O próximo passo atualiza o contador.',update:'Contador atualizado. O próximo passo testa a condição novamente.'}[state.phase];
    query('#while-content').innerHTML = `<div class="section-heading"><div><span class="eyebrow">0${page+1} / ${p.label.toUpperCase()}</span><h2>${p.title}</h2></div><span class="pill">EXPERIMENTE</span></div><p class="explanation">${escape(p.text)}</p>${page===5?quiz():''}<div class="experiment"><div><div class="visual-panel"><div class="panel-label"><span>FLUXOGRAMA VIVO</span><span class="live-dot">PASSO A PASSO</span></div><div class="flow while-flow"><span class="flow-start">Início: contador = ${config.start}</span><div class="stem"></div><div class="diamond ${state.phase==='test'||done?'active':''}"><span>contador ${escape(config.operator)} ${config.limit}?</span></div><div class="fork"><span class="${!done&&state.tests?'lit':''}">↓ True · repetir</span><span class="${done?'lit':''}">↓ False · sair</span></div><div class="outcomes"><div class="while-body"><div class="flow-result yes ${state.phase==='print'?'selected':''}">Exibir contador</div><div class="stem"></div><div class="flow-result yes ${state.phase==='update'?'selected':''}">Somar ${config.increment} ao contador</div><p class="loop-return">↶ Voltar ao teste</p></div><div class="flow-result no ${done?'selected':''}">Exibir “Fim”<br>Continuar o programa</div></div></div></div><div class="while-stats"><span>CONTADOR <b>${state.value}</b></span><span>VOLTAS <b>${state.iterations}</b></span><span>TESTES <b>${state.tests}</b></span></div><div class="while-history"><span class="eyebrow">HISTÓRICO DOS TESTES</span>${state.rows.length?`<table><thead><tr><th>Contador</th><th>Condição</th><th>Resultado</th></tr></thead><tbody>${state.rows.slice(-8).map(r=>`<tr><td>${r.value}</td><td>${r.value} ${escape(config.operator)} ${config.limit}</td><td class="${r.passes?'true':'false'}">${r.passes?'True · entrar':'False · sair'}</td></tr>`).join('')}</tbody></table>`:'<p>Avance um passo para avaliar a primeira condição.</p>'}</div></div><div class="playground">${controls()}<div class="code-title"><span>PYTHON · LINHA ATUAL DESTACADA</span></div><pre><code>${pythonLines(config).map((l,i)=>`<span class="code-line ${line===i?'highlight':''}"><i>${i+1}</i>${escape(l)}</span>`).join('')}</code></pre><div class="while-actions"><button id="while-step" ${done||state.stopped?'disabled':''}>→ Próximo passo</button><button id="while-run" ${done||state.stopped?'disabled':''}>▶ Executar até o fim</button><button id="while-reset" class="quiet">↺ Reiniciar</button></div><div class="console interactive-result" role="status" aria-live="polite" aria-atomic="true"><div class="result-heading"><span>SAÍDA DO PROGRAMA</span><span class="result-live">● INTERATIVO</span></div><b class="while-output">${state.output.length?state.output.join(' · '):'Nenhum valor impresso ainda.'}${done?'<br>Fim':''}</b><small class="result-hint">${status}</small></div><div class="example-blocks"><div class="blockly-caption">O MESMO EXEMPLO EM BLOCOS <span>Blockly · português</span></div><div id="while-blocks" class="blockly-example blockly-example-tall" role="img" aria-label="Contador e repetição enquanto a condição for verdadeira"></div></div></div></div><aside class="takeaway"><span>✦</span><p>${escape(p.tip)}</p></aside>`;
    query('#while-step').onclick=()=>{advance(state,config);render();};
    query('#while-run').onclick=()=>{for(let i=0;i<40&&state.phase!=='done'&&!state.stopped;i++)advance(state,config);render();};
    query('#while-reset').onclick=()=>{state=createState(config);render();};
    root.querySelectorAll('[data-config]').forEach(input=>input.onchange=()=>{
      config[input.dataset.config]=input.dataset.config==='operator'?input.value:Number(input.value);
      state=createState(config);render();
    });
    root.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{answer=+b.dataset.answer;render();});
    workspace=Blockly.inject(query('#while-blocks'),{readOnly:true,renderer:'zelos',scrollbars:true,sounds:false,zoom:{controls:true,wheel:false,startScale:.75,minScale:.4,maxScale:1.4}});
    Blockly.Xml.domToWorkspace(Blockly.utils.xml.textToDom(whileXml(config)),workspace);workspace.zoomToFit();
  }
  function controls() {
    if(page===5)return '<p class="trace">Use os botões para conferir sua previsão, passo a passo.</p>';
    const select=(key,label,options)=>`<label>${label}<select data-config="${key}">${options.map(v=>`<option value="${escape(v)}" ${config[key]===v?'selected':''}>${escape(v)}</option>`).join('')}</select></label>`;
    return `<div class="panel-label">MUDE A ENTRADA <span>REINICIA A EXECUÇÃO</span></div><div class="while-inputs">${select('start','Início',[0,1,2,3,4,5,6,7,8])}${select('limit','Limite',[0,1,2,3,4,5,6,7,8])}${select('operator','Comparação',['<','<='])}${select('increment','Passo',page===4?[0,1,2]:[1,2,3])}</div>`;
  }
  function quiz(){return `<div class="while-quiz"><b>Sua previsão: quantas voltas?</b><div>${[2,3,4].map(n=>`<button data-answer="${n}" aria-pressed="${answer===n}" class="${answer===n?'chosen':''}">${n} voltas</button>`).join('')}</div>${answer!==null?`<p role="status">${answer===3?'✓ Isso!':'Vamos conferir:'} são 3 voltas: imprime 2, 4 e 6. Ao chegar a 8, o teste 8 &lt; 8 é falso.</p>`:'<p>Escolha uma resposta e depois confira executando o código.</p>'}</div>`;}
  function go(n){page=Math.max(0,Math.min(pages.length-1,page+n));config={...pages[page].config};state=createState(config);answer=null;render();}
  root.querySelectorAll('[data-while-page]').forEach(b=>b.onclick=()=>go(+b.dataset.whilePage-page));
  query('#while-prev').onclick=()=>go(-1);query('[data-while-next]').onclick=()=>go(1);
  const keydown=e=>{if(['INPUT','SELECT','BUTTON','TEXTAREA'].includes(document.activeElement.tagName)||e.altKey||e.ctrlKey||e.metaKey)return;if(e.key==='ArrowRight')go(1);if(e.key==='ArrowLeft')go(-1);};
  const resize=()=>{if(workspace){Blockly.svgResize(workspace);workspace.zoomToFit();}};
  document.addEventListener('keydown',keydown);window.addEventListener('resize',resize);render();
  return ()=>{workspace?.dispose();document.removeEventListener('keydown',keydown);window.removeEventListener('resize',resize);};
}
