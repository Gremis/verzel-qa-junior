# Verzel — teste técnico QA Júnior

Validação de **cupom de desconto e frete grátis** da Verzel Store, card **VZS-142**, com cenários em Gherkin, execução manual/exploratória, relatos de defeitos, evidências e automação Playwright com TypeScript.

Referência documental: **versão 2.3.0**, publicada em 30/09/2026. A versão implantada não foi verificada. [Loja](https://verzel-store.qa-test-verzel-store.workers.dev/) · [Documentação da entrega](https://verzel-store.qa-test-verzel-store.workers.dev/documentacao). API: mesmo domínio, caminho `/api`. Deploy não se aplica.

## Resultado registrado

Na execução consolidada de **15/10/2026, 19:42:40–19:42:57 (America/Sao_Paulo)**:

| Camada | Testes | Aprovados | Reprovados |
| --- | ---: | ---: | ---: |
| Interface | 3 | 2 | 1 |
| API | 16 | 13 | 3 |
| Infraestrutura local | 1 | 1 | 0 |
| **Total** | **20** | **16** | **4** |

As quatro falhas correspondem a **dois defeitos**, não quatro bugs. A suíte retorna código de saída **1** ao reproduzi-los; as expectativas não foram alteradas para obter sucesso. São 19 testes de negócio parametrizados/camadas e um teste local, relacionados a 11 IDs CT distintos. Isso não representa execução integral de todos os cenários planejados.

- [BUG-001 — frete cobrado em subtotal de exatamente R$ 200](docs/bugs/BUG-001.md): manifestações na UI e API.
- [BUG-002 — API aceita seis unidades do mesmo produto](docs/bugs/BUG-002.md): cálculo e confirmação aceitam quantidade acima do limite.

O [relatório consolidado](docs/relatorio-consolidado.md) apresenta ambiente, horários, resultado de cada teste, cobertura CA01–CA11, limitações e anexos. São resultados de uma execução registrada, não garantia sobre o estado futuro da loja.

Reprodução e revisão posterior em 16/10/2026: **16 aprovados e quatro falhas conhecidas novamente**, sem alterar expectativas. [Revisão final, verificações e evidências](docs/revisao-final.md).

## Onde encontrar as entregas

| Entrega | Arquivos |
| --- | --- |
| Estratégia, escopo e exclusões | [Plano de testes](docs/plano-de-testes.md) |
| Regras, dados, cálculos e ambiguidades | [Requisitos CA01–CA11](docs/requisitos.md) e [contratos de API/checkout](docs/api-e-checkout.md) |
| Cenários e vínculo com requisitos | [Cenários Gherkin](docs/cenarios.md) e [rastreabilidade](docs/rastreabilidade.md) |
| Testes manuais e exploratórios | [Registro manual](docs/execucoes/manual.md) e [capturas fornecidas](docs/evidencias/manual-fornecida.md) |
| Investigação direta por agente | [Registro da exploração via API](docs/execucoes/agente-api.md) |
| Execuções automatizadas | [UI](docs/execucoes/playwright-ui.md), [API](docs/execucoes/playwright-api.md) e [consolidação](docs/relatorio-consolidado.md) |
| Documento e arquivos de evidências | [Índice de evidências](docs/evidencias/README.md) |
| Relatos dos defeitos encontrados | [BUG-001](docs/bugs/BUG-001.md) e [BUG-002](docs/bugs/BUG-002.md) |
| Código Playwright | [Interface](tests/coupon-shipping.spec.ts), [API](tests/cart-api.spec.ts) e [infraestrutura](tests/infrastructure.spec.ts) |
| Configuração e explicação dos testes | [Configuração normal](playwright.config.ts) e [guia de automação](docs/automacao.md) |
| Skill criada com apoio de IA | [verzel-qa/SKILL.md](.agents/skills/verzel-qa/SKILL.md) |
| Declaração de uso de IA | [Seção deste README](#skill-e-uso-de-ia) |

## Instalar e executar

Requer **Node.js 20+ compatível com as dependências**, npm e acesso à internet para instalar pacotes/navegador e acessar a loja. Ambiente verificado: macOS arm64, Node 20.19.5, npm 10.8.2, Playwright 1.64.1 e Chromium 156.0.8078.4. Não exige Codex, skill, login da loja ou credenciais pessoais.

Na raiz do repositório:

```bash
npm ci
npx playwright install chromium
npm run typecheck
npm test
```

`npm ci` usa as versões do lockfile; a instalação, a checagem de tipos e a execução foram verificadas. Em Linux, dependências do sistema podem exigir `npx playwright install --with-deps chromium`; esse ambiente não foi validado neste projeto.

Na [verificação dos comandos deste README](docs/evidencias/verificacao-readme/resultado.json), a suíte foi reexecutada com o mesmo resultado de 16 aprovados e quatro falhas conhecidas. O comando de listagem foi ajustado para preservar os relatórios anteriores; a preservação foi conferida por hash dos arquivos HTML/JSON. O relatório consolidado acima mantém sua própria execução e horário, sem sobrescrever o histórico.

| Seleção | Comando |
| --- | --- |
| Apenas infraestrutura, sem acessar a loja | `npm run test:infra` |
| Três cenários de interface | `npx playwright test tests/coupon-shipping.spec.ts` |
| API, 16 testes e 21 chamadas sequenciais | `npx playwright test tests/cart-api.spec.ts` |
| Um cenário de interface | `npx playwright test tests/coupon-shipping.spec.ts --grep CT-001` |
| Listar sem executar ou sobrescrever relatórios | `npm run test:list` |

A configuração usa **um worker, zero retries e contextos isolados**, sem esperas fixas nos testes. O esperado vem dos requisitos e preços de referência. A URL padrão pode ser substituída explicitamente, por exemplo `BASE_URL=https://endereco-do-ambiente npm test`; arquivos `.env` não são carregados automaticamente. Os testes de API podem confirmar pedidos fictícios com dados de teste.

## Consultar relatórios, vídeos e traces

Depois de executar:

```bash
npm run report
```

O comando abre o HTML da **última execução normal**, sem executar testes novamente. Se a porta estiver ocupada: `npm run report -- --port 9337`. Para encerrar o servidor no terminal, use `Ctrl+C`.

- `playwright-report/`: relatório HTML.
- `test-results/results.json`: resultado estruturado.
- `test-results/artifacts/`: evidências automáticas, incluindo screenshot, vídeo e trace na falha de UI; chamadas de API têm anexos JSON e podem ter trace, sem fluxo visual da loja.
- `docs/evidencias/`: seleção preservada das execuções registradas, acessível pelo índice mesmo após novo clone. Relatórios temporários não são versionados e precisam ser gerados localmente.

Os testes de UI também anexam uma captura de resumo. No modo normal, vídeos são retidos nas falhas. Para investigar o fluxo visual preservado:

```bash
npx playwright show-trace docs/evidencias/ui/ct-002-6.zip
```

No trace, selecione uma ação e use **Before/After** para examiná-la parada. Trace de API pode mostrar uma área visual vazia: examine requisições, respostas e erros. Preserve artefatos relevantes antes de executar novamente, pois as pastas temporárias são reutilizadas.

## Acompanhar a interface devagar

```bash
npm run test:demo -- --grep CT-001
npm run report:demo
```

Para os três fluxos, use `npm run test:demo` sem filtro. A [configuração de demonstração](playwright.demo.config.ts) reutiliza os mesmos testes, abre o navegador e desacelera as operações em 1,5 segundo. O cupom é preenchido de uma vez; não simula digitação letra por letra. Não interaja manualmente com a janela durante a execução.

Esse modo grava vídeo e trace também dos aprovados, em pastas separadas (`playwright-demo-report/` e `test-results/demo/`). O navegador fecha ao terminar. CT-002 continua reprovando enquanto o defeito existir. A demonstração não é teste de desempenho nem novo cenário de cobertura. A execução demonstrativa de CT-001 foi verificada.

## Cobertura e limitações

A automação prioriza desconto, fronteira de frete, subtotal anterior ao desconto, normalização no cálculo, diferença entre cupom rejeitado no cálculo (200) e no pedido (422), limite por produto e erros selecionados de itens/cliente. As explorações e confirmações manuais estão em registro próprio.

A entrega não demonstra cobertura completa: faltam, entre outros, normalização em UI/pedido, sequência completa CT-009, validações negativas de e-mail/CEP, duas formas de CEP e demais contratos negativos planejados. Só existe um cupom válido; preços fixos não permitem qualquer subtotal nem comprovar desempate de meio centavo. Algumas confirmações antigas têm apenas registro na conversa, e horários/versão do Brave não foram informados. Detalhes por requisito no relatório, sem aprovação presumida das partes pendentes.

Carrinho vazio em outra aba, ausência de e-mail/cobrança/estoque e pedidos não persistidos são simplificações documentadas. Chamadas duplicadas ao aplicar cupom são observação sem impacto comprovado, não bug confirmado. Recalcular a cada adição não demonstra, por si só, um problema de escala. Carga, estresse, segurança, login, cadastro, pagamento online e consulta de pedidos estão fora do escopo.

## Skill e uso de IA

Estruturei o trabalho com apoio do Codex e criei, de forma assistida, a skill `verzel-qa`, definindo na conversa o fluxo desejado. Realizei os testes manuais/exploratórios que confirmei, acompanhei requisições no DevTools e forneci evidências. O Codex validou a skill com apoio do skill-creator, implementou/executou os testes e auxiliou na documentação e investigação.

A skill foi utilizada para análise, especificação, execução e consolidação; é um conjunto de instruções para o Codex, não um agente independente criado do zero. Para invocá-la no projeto:

```text
Use $verzel-qa para revisar a rastreabilidade e as limitações, sem executar testes.
```

Também é possível indicar diretamente `.agents/skills/verzel-qa/SKILL.md`. A automação funciona pelos comandos acima sem a skill.
