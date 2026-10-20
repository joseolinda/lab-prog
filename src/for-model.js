function validateConfig({ start, stop, step }) {
  if (![start, stop, step].every(Number.isSafeInteger)) {
    throw new TypeError('Os valores de range devem ser números inteiros seguros.');
  }
  if (step === 0) throw new RangeError('O passo de range não pode ser zero.');
}

export function rangeValues(config) {
  validateConfig(config);
  const { start, stop, step } = config;
  const values = [];
  for (let value = start; step > 0 ? value < stop : value > stop; value += step) {
    values.push(value);
  }
  return values;
}

export function rangeExpression(config) {
  validateConfig(config);
  const { start, stop, step, form = 'start-stop-step' } = config;
  if (form === 'stop') {
    if (start !== 0 || step !== 1) {
      throw new RangeError('range(fim) começa em zero e usa passo um.');
    }
    return `range(${stop})`;
  }
  if (form === 'start-stop') {
    if (step !== 1) throw new RangeError('range(início, fim) usa passo um.');
    return `range(${start}, ${stop})`;
  }
  if (form !== 'start-stop-step') throw new TypeError('Forma de range desconhecida.');
  return `range(${start}, ${stop}, ${step})`;
}

export function pythonLines(config) {
  return [
    `for numero in ${rangeExpression(config)}:`,
    '    print(numero)',
    'print("Fim")',
  ];
}

export function createState(config) {
  return {
    values: rangeValues(config),
    value: null,
    index: -1,
    iterations: 0,
    output: [],
    phase: 'ready',
  };
}

// O for obtém um novo valor da sequência; não executa um teste escrito pelo aluno.
export function advance(state) {
  if (state.phase === 'done') return state;
  if (state.phase === 'loop') {
    state.output.push(String(state.value));
    state.iterations++;
    state.phase = 'print';
  } else if (state.phase === 'ready' || state.phase === 'print') {
    if (state.index + 1 < state.values.length) {
      state.index++;
      state.value = state.values[state.index];
      state.phase = 'loop';
    } else {
      state.output.push('Fim');
      state.phase = 'done';
    }
  }
  return state;
}

const numberBlock = value => `<block type="math_number"><field name="NUM">${value}</field></block>`;
const variableBlock = '<block type="variables_get"><field name="VAR">numero</field></block>';

export function forXml(config) {
  const values = rangeValues(config);
  const items = values.map((value, index) => `<value name="ADD${index}">${numberBlock(value)}</value>`).join('');
  const list = `<block type="lists_create_with"><mutation items="${values.length}"></mutation>${items}</block>`;
  return `<xml xmlns="https://developers.google.com/blockly/xml"><block type="controls_forEach"><field name="VAR">numero</field><value name="LIST">${list}</value><statement name="DO"><block type="text_print"><value name="TEXT">${variableBlock}</value></block></statement><next><block type="text_print"><value name="TEXT"><block type="text"><field name="TEXT">Fim</field></block></value></block></next></block></xml>`;
}
