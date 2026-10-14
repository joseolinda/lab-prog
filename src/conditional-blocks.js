// Estruturas equivalentes aos exemplos Python da Aula 03.
const text = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const number = value => `<block type="math_number"><field name="NUM">${value}</field></block>`;
const variable = name => `<block type="variables_get"><field name="VAR">${text(name)}</field></block>`;
const print = message => `<block type="text_print"><value name="TEXT"><block type="text"><field name="TEXT">${text(message)}</field></block></value></block>`;
const condition = (name, limit) => `<block type="logic_compare"><field name="OP">GTE</field><value name="A">${variable(name)}</value><value name="B">${number(limit)}</value></block>`;

export function conditionalXml(page) {
  const multi = page === 3;
  const indent = page === 5;
  let branch = `<block type="controls_if"><mutation elseif="${multi ? 1 : 0}" else="${page === 2 || multi ? 1 : 0}"></mutation><value name="IF0">${condition(multi ? 'media' : 'idade', multi ? 7 : 18)}</value><statement name="DO0">${print(multi ? 'Aprovado' : 'Maior de idade')}</statement>`;
  if (multi) branch += `<value name="IF1">${condition('media', 5)}</value><statement name="DO1">${print('Em recuperação')}</statement>`;
  if (page === 2 || multi) branch += `<statement name="ELSE">${print(multi ? 'Reprovado' : 'Menor de idade')}</statement>`;
  if (indent) branch += `<next>${print('Programa continua')}</next>`;
  branch += '</block>';
  if (indent) branch = `<block type="variables_set"><field name="VAR">idade</field><value name="VALUE">${number(18)}</value><next>${branch}</next></block>`;
  return `<xml xmlns="https://developers.google.com/blockly/xml">${branch}</xml>`;
}
