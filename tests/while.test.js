import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as Blockly from 'blockly';
import 'blockly/blocks';
import { pythonGenerator } from 'blockly/python';
import { createState, advance, whileXml, pythonLines } from '../src/while-model.js';
function execute(config) {
  const state = createState(config);
  for(let i=0;i<100 && state.phase!=='done' && !state.stopped;i++) advance(state,config);
  return state;
}
test('testa antes de entrar e permite zero repetições',()=>{
  const state=execute({start:5,limit:3,increment:1,operator:'<='});
  assert.equal(state.phase,'done');assert.deepEqual(state.output,[]);assert.equal(state.tests,1);
});
test('limite inclusivo e exclusivo produzem saídas diferentes',()=>{
  for (const [operator,output] of [['<=',[1,2,3]],['<',[1,2]]]) {
    const state=execute({start:1,limit:3,increment:1,operator});
    assert.deepEqual(state.output,output);assert.equal(state.tests,output.length+1);
  }
});
test('atualização e desafio ultrapassam ou atingem a condição de parada',()=>{
  assert.deepEqual(execute({start:1,limit:6,increment:2,operator:'<='}).output,[1,3,5]);
  assert.deepEqual(execute({start:2,limit:8,increment:2,operator:'<'}).output,[2,4,6]);
});
test('passo zero é limitado apenas na simulação',()=>{
  const state=execute({start:1,limit:3,increment:0,operator:'<='});
  assert.equal(state.stopped,true);assert.notEqual(state.phase,'done');assert.equal(state.iterations,12);assert.equal(state.value,1);
  const snapshot=JSON.stringify(state);advance(state,{start:1,limit:3,increment:0,operator:'<='});assert.equal(JSON.stringify(state),snapshot);
});
test('cada passo executa teste, print e atualização na ordem',()=>{
  const c={start:1,limit:1,increment:1,operator:'<='},s=createState(c);
  advance(s,c);assert.equal(s.phase,'test');assert.deepEqual(s.output,[]);
  advance(s,c);assert.deepEqual(s.output,[1]);assert.equal(s.value,1);
  advance(s,c);assert.equal(s.value,2);advance(s,c);assert.equal(s.phase,'done');
});
test('Blockly gera o mesmo Python para as configurações interativas',()=>{
  const normalize=s=>s.trim().replaceAll("'",'"').replace(/\n\s*\n/g,'\n');
  for(const c of [{start:1,limit:3,increment:1,operator:'<='},{start:2,limit:8,increment:2,operator:'<'},{start:1,limit:3,increment:0,operator:'<='}]){
    const ws=new Blockly.Workspace();Blockly.Xml.domToWorkspace(Blockly.utils.xml.textToDom(whileXml(c)),ws);
    pythonGenerator.INDENT = '    ';
    pythonGenerator.init(ws);
    const generated = pythonGenerator.blockToCode(ws.getTopBlocks(true)[0]);
    assert.equal(normalize(generated),normalize(pythonLines(c).join('\n')));
    pythonGenerator.finish('');ws.dispose();
  }
});
