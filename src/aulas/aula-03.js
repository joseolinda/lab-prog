import * as Blockly from 'blockly';
import 'blockly/blocks';
import * as Pt from 'blockly/msg/pt-br';
Blockly.setLocale(Pt);
export default {
  id: 'aula-03',
  number: 3,
  title: 'Estruturas condicionais',
  description: 'Aprenda a decidir com if, elif e else, operadores e indentação.',
  mount,
};

function mount(app) {
const lessons = [
 ['O mapa das decisões','Conceito','Todo caminho começa com uma pergunta.','Uma condição é uma expressão que resulta em True (verdadeiro) ou False (falso). O Python usa essa resposta para escolher o que executar.'],
 ['Um teste. Uma possibilidade.','if','Execute apenas se for verdadeiro.','Se a condição for falsa, o bloco é ignorado e o programa continua.'],
 ['Dois caminhos. Uma escolha.','if / else','Se não for por aqui, será por ali.','O if executa quando a condição é verdadeira. O else cuida do caso contrário. Apenas um dos dois blocos é executado.'],
 ['Várias condições. Uma decisão.','if / elif / else','Teste em ordem, de cima para baixo.','O Python para na primeira condição verdadeira. O else é executado quando nenhuma das anteriores é verdadeira.'],
 ['Compare. Descubra. Decida.','Operadores','Pequenos símbolos, grandes decisões.','Operadores de comparação relacionam dois valores e produzem True ou False. Experimente mudar os valores e o operador.'],
 ['O recuo também é código.','Indentação','O espaço mostra o que pertence ao bloco.','Em Python, linhas com o mesmo recuo pertencem ao mesmo bloco. Use quatro espaços por nível e mantenha a consistência.'],
];
let current = 0, value = 18, operator = '>=', left = 18, right = 18, step = 0, workspace;
app.innerHTML = `<main><div class="eyebrow">AULA 03 · ESTRUTURAS CONDICIONAIS <span id="counter"></span></div><section class="intro"><div><h1>Aprenda a <em>decidir.</em></h1><p>Explore as estruturas condicionais em Python.</p></div><div class="lesson-stamp"><span>SE → ENTÃO</span><small>PENSE · TESTE · APRENDA</small></div></section><nav aria-label="Conteúdo da aula">${lessons.map((l,i)=>`<button data-page="${i}"><small>0${i+1}</small>${l[1]}</button>`).join('')}</nav><section id="lesson"></section><footer><span>LLPR <b>/</b> LÓGICA DE PROGRAMAÇÃO</span><div><button id="previous" class="quiet">← Anterior</button><span id="position"></span><button id="next">Próximo →</button></div><span class="keyboard">NAVEGUE COM ← →</span></footer></main>`;
const code = (lines, active = -1) => `<pre aria-label="Código Python"><code>${lines.map((l,i)=>`<span class="code-line ${i===active?'highlight':''}"><i>${i+1}</i>${l.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')}</span>`).join('')}</code></pre>`;
function diamond(text, active=true){return `<div class="diamond ${active?'active':''}"><span>${text}</span></div>`;}
function result(text, active, type='yes'){return `<div class="flow-result ${type} ${active?'selected':''}">${text}</div>`;}
function render(){
 workspace?.dispose(); workspace = null;
 const l = lessons[current];
 document.querySelector('#counter').textContent=`0${current+1} / ${String(lessons.length).padStart(2,'0')}`;
 document.querySelector('#position').textContent=`${current+1} / ${lessons.length}`;
 document.querySelectorAll('[data-page]').forEach(b=>{b.classList.toggle('active',+b.dataset.page===current);b.setAttribute('aria-current',+b.dataset.page===current?'step':'false');});
 document.querySelector('#previous').disabled=current===0;
 document.querySelector('#next').disabled=current===lessons.length-1;
 document.querySelector('#lesson').innerHTML=`<div class="section-heading"><div><span class="eyebrow">0${current+1} / ${l[1].toUpperCase()}</span><h2>${l[0]}</h2></div><span class="pill">${current===0?'VISÃO GERAL':'EXPERIMENTE'}</span></div><p class="explanation">${l[3]}</p>${content()}<aside class="takeaway"><span>✦</span><p>${l[2]} <strong>${['Uma pergunta → uma resposta → um caminho.','O if não precisa de else.','else não recebe uma condição.','A ordem dos testes muda o resultado.','== compara valores; = atribui um valor.','Os dois-pontos abrem o bloco; o recuo organiza as linhas.'][current]}</strong></p></aside>`;
 document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{current=+b.dataset.mode;value=current===3?7:18;step=0;render();});
 document.querySelector('#value')?.addEventListener('input',e=>{value=+e.target.value;step=0;render();document.querySelector('#value')?.focus();});
 document.querySelectorAll('[data-op]').forEach(b=>b.onclick=()=>{operator=b.dataset.op;render();});
 for(const id of ['left','right']) document.querySelector(`#${id}`)?.addEventListener('input',e=>{if(id==='left')left=+e.target.value;else right=+e.target.value;updateComparison();});
 document.querySelector('#step')?.addEventListener('click',()=>{step=(step+1)%3;render();});
 document.querySelectorAll('[data-indent]').forEach(b=>b.onclick=()=>{step=+b.dataset.indent;render();});
 if(current===0) mountBlocks();
 if(current===4) updateComparison();
}
function content(){
 if(current===0)return `<div class="overview"><div class="concept-map"><span class="flow-start">UMA CONDIÇÃO</span><div class="stem"></div>${diamond('Verdadeiro<br>ou falso?')}<div class="fork"><span>True · verdadeiro</span><span>False · falso</span></div><div class="outcomes">${result('Executar um bloco',true)}${result('Seguir outro caminho',true,'no')}</div><p class="diagram-note">O programa escolhe com base no resultado do teste.</p></div><div class="overview-right"><span class="eyebrow">TRÊS FORMAS DE ESCOLHER</span>${[1,2,3].map((i)=>`<button class="mode-card" data-mode="${i}"><span class="mode-symbol">${['','↳','⑂','⋮'][i]}</span><span><b>${lessons[i][1]}</b><small>${['','Uma condição, um bloco','Uma condição, dois caminhos','Vários testes em sequência'][i]}</small></span><span>↗</span></button>`).join('')}<div class="blockly-caption">DO FLUXO AOS BLOCOS <span>Blockly · português</span></div><div id="blocks" aria-label="Exemplo de condição em blocos"></div></div></div>`;
 if(current===4)return `<div class="operator-layout"><div class="operators">${[['==','Igual a'],['!=','Diferente de'],['>','Maior que'],['<','Menor que'],['>=','Maior ou igual a'],['<=','Menor ou igual a']].map(([o,t])=>`<button data-op="${o}" class="${operator===o?'chosen':''}"><b>${o.replaceAll('<','&lt;')}</b><span>${t}</span></button>`).join('')}</div><div class="comparison"><span class="eyebrow">BANCADA DE COMPARAÇÃO</span><div class="compare-inputs"><input id="left" type="number" value="${left}" aria-label="Primeiro valor"><b id="op-label">${operator.replaceAll('<','&lt;')}</b><input id="right" type="number" value="${right}" aria-label="Segundo valor"></div><div id="comparison-result" aria-live="polite"></div><p>Mude os números e observe o resultado.</p></div></div>`;
 if(current===5)return `<div class="indent-layout"><div><div class="toggle"><button data-indent="0" class="${step===0?'chosen':''}">✓ Recuo correto</button><button data-indent="1" class="${step===1?'chosen':''}">! Sem recuo</button></div>${code(['idade = 18','if idade >= 18:',`${step===0?'    ':''}print("Maior de idade")`,'print("Programa continua")'],2)}<p class="indent-message ${step?'error':''}">${step?'IndentationError: o Python espera um bloco indentado após o if.':'↳ Os quatro espaços colocam o primeiro print dentro do if.'}</p></div><div class="indent-guide"><span class="big-number">4<span>espaços</span></span><h3>Um bloco, um nível de recuo.</h3><p>O último <code>print</code> volta à margem e executa independentemente do resultado da condição.</p><div class="tip">Lembre-se dos <b>:</b> depois de <code>if</code>, <code>elif</code> e <code>else</code>.</div></div></div>`;
 const multi=current===3, yes=value>=(multi?7:18), mid=multi&&value>=5&&!yes;
 const lines=multi?['if media >= 7:','    print("Aprovado")','elif media >= 5:','    print("Em recuperação")','else:','    print("Reprovado")']:['if idade >= 18:','    print("Maior de idade")',...(current===2?['else:','    print("Menor de idade")']:[])];
 const active=step===0?-1:step===1?0:yes?1:multi?mid?3:5:current===2?3:-1;
 return `<div class="experiment"><div class="visual-panel"><div class="panel-label"><span>FLUXOGRAMA VIVO</span><span class="live-dot">AO VIVO</span></div><div class="flow"><span class="flow-start">${multi?'Média':'Idade'} = ${value.toLocaleString('pt-BR')}</span><div class="stem"></div>${diamond(multi?'media ≥ 7?':'idade ≥ 18?')}<div class="fork"><span class="${yes?'lit':''}">↓ Sim · True</span><span class="${!yes?'lit':''}">↓ Não · False</span></div><div class="outcomes">${result(multi?'Aprovado':'Maior de idade',yes)}${multi?`<div class="nested">${diamond('media ≥ 5?',!yes)}<div class="mini-branches">${result('Em recuperação',mid)}${result('Reprovado',!yes&&!mid,'no')}</div></div>`:result(current===1?'Pular o bloco':'Menor de idade',!yes,'no')}</div><div class="flow-end">↓<br>Continuar o programa</div></div></div><div class="playground"><div class="panel-label">MUDE A ENTRADA <span>${multi?'0 a 10':'0 a 30'}</span></div><label class="range-label" for="value">${multi?'Média do aluno':'Idade da pessoa'} <output>${value.toLocaleString('pt-BR')}<small>${multi?' pontos':' anos'}</small></output></label><input id="value" type="range" min="0" max="${multi?10:30}" step="${multi?0.5:1}" value="${value}"><div class="code-title"><span>PYTHON</span><button id="step" class="quiet">${['▶ Acompanhar execução','→ Ver resultado','↺ Reiniciar destaque'][step]}</button></div>${code(lines,active)}<div class="console" role="status"><span>SAÍDA DO PROGRAMA</span><b>${multi?yes?'Aprovado':mid?'Em recuperação':'Reprovado':yes?'Maior de idade':current===2?'Menor de idade':'Nenhuma mensagem: o bloco foi ignorado.'}</b></div><p class="trace">${step===1?`Teste: ${value} >= ${multi?7:18} → ${yes?'True':'False'}`:step===2?'A linha destacada mostra a mensagem executada.':'Arraste o controle e veja o caminho mudar.'}</p></div></div>`;
}
function updateComparison(){const operations={'==':(a,b)=>a===b,'!=':(a,b)=>a!==b,'>':(a,b)=>a>b,'<':(a,b)=>a<b,'>=':(a,b)=>a>=b,'<=':(a,b)=>a<=b};const r=operations[operator](left,right);const el=document.querySelector('#comparison-result');if(el){el.className=r?'true':'false';el.innerHTML=`<b>${r?'True':'False'}</b><span>${r?'Verdadeiro':'Falso'}</span>`;}}
function mountBlocks(){workspace=Blockly.inject('blocks',{readOnly:true,renderer:'zelos',scrollbars:false,sounds:false});const xml=Blockly.utils.xml.textToDom('<xml><block type="controls_if" x="12" y="10"><value name="IF0"><block type="logic_compare"><field name="OP">GTE</field><value name="A"><block type="math_number"><field name="NUM">18</field></block></value><value name="B"><block type="math_number"><field name="NUM">18</field></block></value></block></value><statement name="DO0"><block type="text_print"><value name="TEXT"><block type="text"><field name="TEXT">Maior de idade</field></block></value></block></statement></block></xml>');Blockly.Xml.domToWorkspace(xml,workspace);workspace.zoomToFit();}
function navigate(n){current=Math.max(0,Math.min(lessons.length-1,current+n));value=current===3?7:18;step=0;render();updateComparison();}
document.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>navigate(+b.dataset.page-current));
document.querySelector('#previous').onclick=()=>navigate(-1);document.querySelector('#next').onclick=()=>navigate(1);
const onKeydown = e=>{if(['INPUT','SELECT','TEXTAREA','BUTTON'].includes(document.activeElement.tagName)||e.altKey||e.ctrlKey||e.metaKey)return;if(e.key==='ArrowRight')navigate(1);if(e.key==='ArrowLeft')navigate(-1);};
document.addEventListener('keydown', onKeydown);
const onResize = () => workspace && Blockly.svgResize(workspace);
window.addEventListener('resize', onResize);
render();

return () => {
  workspace?.dispose();
  document.removeEventListener('keydown', onKeydown);
  window.removeEventListener('resize', onResize);
};
}
