# LAB/PROG · Aulas interativas

Execute `npm install` e `npm run dev`. Gere a versão de produção com `npm run build`.

A página inicial lista as aulas cadastradas. A aula de estruturas condicionais é a **Aula 03**, acessível também por `/#/aula-03`. O seletor no cabeçalho permite voltar ao catálogo ou trocar de aula. Os endereços podem ser compartilhados e recarregados sem configurar rotas no servidor.

Copiar, recortar e colar ficam desabilitados em todo o site, inclusive pelos atalhos de teclado.

## Adicionar uma aula

Crie um arquivo JavaScript em `src/aulas/`, por exemplo `aula-04.js`. O catálogo descobre automaticamente todos os arquivos dessa pasta e os ordena pelo campo `number`. Não é necessário alterar `main.js`.

```js
export default {
  id: 'aula-04', // único; usado no endereço
  number: 4,
  title: 'Laços de repetição',
  description: 'Aprenda a repetir instruções em Python.',
  slides: [
    {
      label: 'Conceito',
      title: 'Repetir sem reescrever',
      paragraphs: ['Um laço executa um bloco de código várias vezes.'],
      code: 'for numero in range(3):\n    print(numero)',
      tip: 'O recuo identifica as instruções que pertencem ao laço.',
    },
    {
      label: 'Prática',
      title: 'Observe a saída',
      paragraphs: ['O exemplo anterior imprime 0, 1 e 2, um por linha.'],
    },
  ],
};
```

`slides` precisa ter pelo menos um item. Cada slide tem `title` e pode incluir `label`, `paragraphs` (lista de textos), `code` e `tip`. Os textos são exibidos como texto, sem interpretar HTML. A navegação, os contadores e os limites são calculados automaticamente pelo número de slides.

## Aulas com interações próprias

Para fluxogramas, Blockly e outras atividades, exporte `mount(root)` no lugar de `slides`. A função recebe o contêiner da aula e retorna uma função de limpeza. Use essa limpeza para descartar workspaces, temporizadores e eventos registrados em `window` ou `document` quando o usuário sai da aula. O cabeçalho, o catálogo e as rotas ficam por conta do sistema.

A implementação em `src/aulas/aula-03.js` é um exemplo completo. `src/slides.js` contém o apresentador padrão; `src/main.js` mantém o catálogo e as rotas; `src/style.css` reúne os estilos compartilhados.

Aulas 01 e 02 ainda não foram cadastradas. A numeração não precisa ser sequencial.

## Publicar no GitHub Pages

O build usa caminhos relativos para funcionar também em `https://usuario.github.io/repositorio/`. As rotas das aulas usam hash e não precisam de configuração de redirecionamento.

1. Envie o projeto para um repositório GitHub, incluindo `.github/workflows/pages.yml`.
2. Nas configurações do repositório, abra **Settings → Pages** e selecione **GitHub Actions** como origem de publicação.
3. Um push em `main` ou `master` executa o build e publica `dist/`. Também é possível executar o workflow manualmente pela aba **Actions**.

Para gerar os arquivos localmente, execute `npm run build`. A pasta `dist/` contém a versão de produção; ela é ignorada pelo Git porque o workflow a gera automaticamente.
