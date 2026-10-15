# Infraestrutura Playwright

Esta etapa prepara a ferramenta. `INFRA-001` usa uma página HTML local em memória, sem acessar a loja, criar carrinho ou pedido. Não cobre CA01–CA11 nem conta como um dos três cenários de negócio exigidos. UI em `tests/coupon-shipping.spec.ts` e API em `tests/cart-api.spec.ts`; resultados em [UI](execucoes/playwright-ui.md) e [API](execucoes/playwright-api.md).

Verificação inicial de infraestrutura realizada pelo Codex: checagem de tipos aprovada e **INFRA-001 aprovado (1 teste, 1 worker)**; relatórios HTML e JSON gerados. [Registro de infraestrutura](evidencias/infraestrutura/infra-001.json) com horário, versões e resumo extraído do resultado real. As opções de captura na falha estão configuradas; não houve falha nesse teste para exercitá-las. Listagem de testes e regras do gitignore também conferidas. Naquela verificação inicial não foi executada suíte funcional da loja; as execuções posteriores estão no relatório consolidado.

## Instalação e comandos

Requer Node.js 20 ou superior compatível com as dependências e npm. Execute na raiz do projeto:

```bash
npm ci
npx playwright install chromium
npm run typecheck
npm run test:infra
```

Em Linux, pode ser necessário `npx playwright install --with-deps chromium` para dependências do sistema. A instalação baixa o navegador do Playwright; não depende de login ou perfil do Brave/Chrome pessoal. O projeto não exige Codex ou a skill para rodar.

| Comando | Uso |
| --- | --- |
| `npm run typecheck` | Conferir tipos sem gerar JavaScript |
| `npm run test:infra` | Somente a verificação local de infraestrutura |
| `npm test` | Todos os testes disponíveis: infraestrutura, UI e API |
| `npm run test:list` | Listar sem executar, usando apenas reporter de terminal para preservar HTML/JSON anteriores |
| `npm run test:headed` | Executar com janela do navegador visível |
| `npm run report` | Abrir o relatório HTML da última execução |

Para os testes da loja, a URL padrão está na configuração; pode ser alterada explicitamente com `BASE_URL=https://... npm test`. O teste local atual não usa essa URL. Arquivos `.env` não são carregados automaticamente; não foi adicionada uma biblioteca para isso.

## Arquivos e dependências

| Arquivo / dependência | Função |
| --- | --- |
| `@playwright/test` | Executa os testes, fornece navegador, seletores e assertions (comparações do esperado) |
| `typescript` | Confere tipos por `tsc --noEmit`; Playwright transforma TS para executar, mas não substitui essa conferência |
| `@types/node` | Tipos das APIs de Node, como `process.env` |
| `package-lock.json` | Fixa a árvore de dependências para instalação por `npm ci` |
| `playwright.config.ts` | Navegador, limites de tempo, concorrência, URL e relatórios |
| `tsconfig.json` | TypeScript estrito, resolução NodeNext e sem arquivos compilados |
| `tests/infrastructure.spec.ts` | Verificação local INFRA-001 |
| `tests/coupon-shipping.spec.ts` | CT-001, CT-002 e CT-005 pela UI real, cada um com preparação e assertions próprias |

Versões diretas fixadas em `package.json`; não há biblioteca de relatórios extra, Page Objects, fixtures próprias ou scripts auxiliares.

## Configuração e evidências

Chromium somente, um worker e sem paralelismo completo: evita vários testes simultâneos no ambiente compartilhado. `retries: 0` preserva a primeira falha sem repetição automática; `forbidOnly: true` impede deixar seleção exclusiva acidental. Limites: 30 s por teste, 20 s por navegação, 10 s por ação e 5 s para assertions que aguardam condições. Limite máximo não é espera fixa: a ação termina assim que possível. Não há `waitForTimeout`.

- Terminal: relatório em lista.
- `playwright-report/index.html`: relatório navegável, sem abrir servidor automaticamente.
- `test-results/results.json`: resultado estruturado, incluindo status, duração e erros.
- `test-results/artifacts/`: screenshots somente na falha; trace e vídeo retidos na falha. O trace permite examinar ações e rede. Com zero retries, `retain-on-failure` é apropriado; não depende de uma segunda tentativa.

Em uma execução aprovada no modo normal, não se espera vídeo/trace automático retido; os testes de UI podem anexar sua própria captura de resumo. A configuração desses artefatos não comprova que uma falha real já tenha sido capturada. Não provocar falha na loja para testar a infraestrutura.

Relatórios e artefatos temporários estão no `.gitignore`, junto com node_modules, caches e arquivos de ambiente. Capturas selecionadas em `docs/evidencias/` e o lockfile continuam versionáveis. Antes de uma nova execução, preservar evidências relevantes em local identificado: o Playwright reutiliza suas pastas de saída. Falhas retornam código de saída diferente de zero; não usar `|| true` para escondê-las.

## Ler o teste em linguagem simples

O Playwright entrega uma `page` em contexto novo por teste. Isso separa cookies e armazenamento, evitando herdar o carrinho da sessão anterior. Não compartilhar uma página entre testes nem depender de outro teste ter preparado dados.

Em INFRA-001:

1. `page.setContent(...)` prepara uma página local com botão; não é a loja real.
2. `getByRole('button', { name: 'Verificar infraestrutura', exact: true })` encontra o botão pelo papel e nome acessível, sem depender de classes CSS.
3. `.click()` executa uma ação e aguarda condições como visibilidade e possibilidade de clique.
4. `expect(...).toBeVisible()` verifica o texto resultante por meio do seletor; se a condição não ocorrer no prazo, o teste falha.

Nos testes da loja, os botões são limitados ao article com nome do produto; o campo de cupom é localizado pelo rótulo; a região “Resumo do pedido” e atributos data-valor observados distinguem os valores. Consulte a explicação individual e os resultados em [Playwright UI](execucoes/playwright-ui.md).

## Demonstração visual lenta

`npm run test:demo` usa `playwright.demo.config.ts` para executar os mesmos três testes de UI com janela aberta e `slowMo: 1500`. Não insere esperas fixas nos testes nem modifica assertions. O timeout total aumenta para 90 s para acomodar a demonstração. Referência: [slowMo](https://playwright.dev/docs/api/class-browsertype#browser-type-launch-option-slow-mo).

Comece com `npm run test:demo -- --grep CT-001`. Para todos, omita o filtro. O preenchimento por `fill()` ocorre de uma vez; a desaceleração não significa digitação caractere a caractere nem pausa manual. Evite interagir com a janela durante a execução.

Vídeo e trace são gravados também para aprovados. `npm run report:demo` abre o relatório em `playwright-demo-report/`; artefatos e JSON ficam em `test-results/demo/`. Essas pastas são ignoradas pelo Git e separadas da execução normal. O navegador fecha ao terminar; consulte a gravação para rever. Não comparar durações de demonstração com desempenho real da aplicação. A falha conhecida CT-002 permanece uma falha.

## Referências oficiais

[Configuração](https://playwright.dev/docs/test-configuration), [gravações e opções](https://playwright.dev/docs/test-use-options), [TypeScript](https://playwright.dev/docs/test-typescript), [isolamento](https://playwright.dev/docs/browser-contexts) e [seletores](https://playwright.dev/docs/locators).

Executar somente UI: `npx playwright test tests/coupon-shipping.spec.ts`. Selecionar um caso: `npx playwright test tests/coupon-shipping.spec.ts --grep CT-001`. A execução focada de UI registrada teve dois aprovados e uma falha real em CT-002 (BUG-001); não é erro de instalação. O HTML local mostra sempre a última execução normal, atualmente a suíte consolidada. As capturas de falha foram exercitadas nessa etapa, diferentemente da verificação inicial INFRA-001.

API: `npx playwright test tests/cart-api.spec.ts`. Suíte proporcional ao risco com 16 testes e 21 chamadas por execução; usa request sem iniciar página de navegador, anexando corpos/status/respostas. Resultado registrado: 13 aprovados, três reprovados por BUG-001/BUG-002. A execução posterior completa de todas as camadas está no [relatório consolidado](relatorio-consolidado.md).
