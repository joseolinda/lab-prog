export function createState(config) {
  return { value: config.start, phase: 'init', output: [], rows: [], tests: 0, iterations: 0, stopped: false };
}
export function advance(state, config) {
  if (state.phase === 'done' || state.stopped) return;
  if (state.phase === 'init' || state.phase === 'update') {
    state.tests++;
    const passes = config.operator === '<' ? state.value < config.limit : state.value <= config.limit;
    state.rows.push({ value: state.value, passes });
    state.phase = passes ? 'test' : 'done';
  } else if (state.phase === 'test') {
    state.output.push(state.value);
    state.iterations++;
    state.phase = 'print';
  } else if (state.phase === 'print') {
    state.value += config.increment;
    state.phase = 'update';
    // Limita apenas a demonstração, sem alterar a condição do programa apresentado.
    if (state.iterations >= 12) state.stopped = true;
  }
}
export function pythonLines(c) {
  return [`contador = ${c.start}`, `while contador ${c.operator} ${c.limit}:`, '    print(contador)', `    contador = contador + ${c.increment}`, 'print("Fim")'];
}
const num = n => `<block type="math_number"><field name="NUM">${n}</field></block>`;
const variable = () => '<block type="variables_get"><field name="VAR">contador</field></block>';
export function whileXml(c) {
  const update = `<block type="variables_set"><field name="VAR">contador</field><value name="VALUE"><block type="math_arithmetic"><field name="OP">ADD</field><value name="A">${variable()}</value><value name="B">${num(c.increment)}</value></block></value></block>`;
  return `<xml xmlns="https://developers.google.com/blockly/xml"><block type="variables_set"><field name="VAR">contador</field><value name="VALUE">${num(c.start)}</value><next><block type="controls_whileUntil"><field name="MODE">WHILE</field><value name="BOOL"><block type="logic_compare"><field name="OP">${c.operator === '<' ? 'LT' : 'LTE'}</field><value name="A">${variable()}</value><value name="B">${num(c.limit)}</value></block></value><statement name="DO"><block type="text_print"><value name="TEXT">${variable()}</value><next>${update}</next></block></statement><next><block type="text_print"><value name="TEXT"><block type="text"><field name="TEXT">Fim</field></block></value></block></next></block></next></block></xml>`;
}
