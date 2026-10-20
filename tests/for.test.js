import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as Blockly from 'blockly';
import 'blockly/blocks';
import { pythonGenerator } from 'blockly/python';
import { advance, createState, forXml, pythonLines, rangeExpression, rangeValues } from '../src/for-model.js';

function execute(config) {
  const state = createState(config);
  for (let steps = 0; steps < 100 && state.phase !== 'done'; steps++) advance(state, config);
  assert.equal(state.phase, 'done');
  return state;
}

test('range exclui o fim, com passos positivos e negativos', () => {
  const examples = [
    [{ start: 0, stop: 5, step: 1 }, [0, 1, 2, 3, 4]],
    [{ start: 1, stop: 6, step: 1 }, [1, 2, 3, 4, 5]],
    [{ start: 2, stop: 11, step: 2 }, [2, 4, 6, 8, 10]],
    [{ start: 5, stop: 0, step: -1 }, [5, 4, 3, 2, 1]],
    [{ start: 5, stop: -2, step: -2 }, [5, 3, 1, -1]],
    [{ start: -3, stop: 2, step: 2 }, [-3, -1, 1]],
  ];
  for (const [config, expected] of examples) {
    assert.deepEqual(rangeValues(config), expected);
    const state = execute(config);
    assert.deepEqual(state.output, [...expected.map(String), 'Fim']);
    assert.equal(state.iterations, expected.length);
  }
});

test('sequências vazias não executam o corpo e imprimem Fim', () => {
  for (const config of [
    { start: 5, stop: 5, step: 1 },
    { start: 5, stop: 2, step: 1 },
    { start: 1, stop: 5, step: -1 },
  ]) {
    assert.deepEqual(rangeValues(config), []);
    const state = execute(config);
    assert.deepEqual(state.output, ['Fim']);
    assert.equal(state.iterations, 0);
    assert.equal(state.value, null);
    assert.equal(state.index, -1);
  }
});

test('cada passo separa obter o número de executar o print', () => {
  const config = { start: 1, stop: 3, step: 1 };
  const state = createState(config);
  assert.deepEqual(state, { values: [1, 2], value: null, index: -1, iterations: 0, output: [], phase: 'ready' });
  assert.equal(advance(state, config), state);
  assert.equal(state.phase, 'loop');
  assert.equal(state.value, 1);
  assert.equal(state.index, 0);
  assert.deepEqual(state.output, []);
  advance(state, config);
  assert.equal(state.phase, 'print');
  assert.equal(state.iterations, 1);
  assert.deepEqual(state.output, ['1']);
  advance(state, config);
  assert.equal(state.phase, 'loop');
  assert.equal(state.value, 2);
  assert.deepEqual(state.output, ['1']);
  advance(state, config);
  assert.deepEqual(state.output, ['1', '2']);
  advance(state, config);
  assert.equal(state.phase, 'done');
  assert.deepEqual(state.output, ['1', '2', 'Fim']);
  const snapshot = structuredClone(state);
  advance(state, config);
  assert.deepEqual(state, snapshot);
});

test('passo zero é inválido, em vez de criar um loop infinito', () => {
  const config = { start: 1, stop: 6, step: 0 };
  for (const operation of [rangeValues, rangeExpression, pythonLines, createState, forXml]) {
    assert.throws(() => operation(config), RangeError);
  }
  for (const config of [
    { start: 0, stop: 5, step: 0.5 },
    { start: 0, stop: Infinity, step: 1 },
  ]) assert.throws(() => rangeValues(config), TypeError);
});

test('Python usa as três formas de range e deixa Fim fora do for', () => {
  for (const [config, expression] of [
    [{ start: 0, stop: 5, step: 1, form: 'stop' }, 'range(5)'],
    [{ start: 1, stop: 6, step: 1, form: 'start-stop' }, 'range(1, 6)'],
    [{ start: 2, stop: 11, step: 2 }, 'range(2, 11, 2)'],
    [{ start: 5, stop: 0, step: -1, form: 'start-stop-step' }, 'range(5, 0, -1)'],
  ]) {
    assert.equal(rangeExpression(config), expression);
    assert.deepEqual(pythonLines(config), [`for numero in ${expression}:`, '    print(numero)', 'print("Fim")']);
  }
  assert.throws(() => rangeExpression({ start: 1, stop: 5, step: 1, form: 'stop' }), RangeError);
  assert.throws(() => rangeExpression({ start: 1, stop: 5, step: 2, form: 'start-stop' }), RangeError);
});

test('Blockly percorre a mesma sequência e imprime Fim após o bloco', () => {
  const normalize = code => code.trim().replaceAll("'", '"').replace(/\n\s*\n/g, '\n');
  for (const config of [
    { start: 0, stop: 5, step: 1, form: 'stop' },
    { start: 2, stop: 11, step: 2 },
    { start: 5, stop: 0, step: -1 },
    { start: 3, stop: 1, step: 1 },
  ]) {
    const workspace = new Blockly.Workspace();
    try {
      Blockly.Xml.domToWorkspace(Blockly.utils.xml.textToDom(forXml(config)), workspace);
      const loop = workspace.getTopBlocks(true)[0];
      assert.equal(loop.type, 'controls_forEach');
      assert.equal(loop.getInputTargetBlock('LIST').type, 'lists_create_with');
      assert.equal(loop.getNextBlock().type, 'text_print');
      pythonGenerator.INDENT = '    ';
      pythonGenerator.init(workspace);
      const generated = pythonGenerator.blockToCode(loop);
      const values = rangeValues(config).join(', ');
      const expected = [`for numero in [${values}]:`, '    print(numero)', 'print("Fim")'].join('\n');
      assert.equal(normalize(generated), normalize(expected));
      pythonGenerator.finish('');
    } finally {
      workspace.dispose();
    }
  }
});
