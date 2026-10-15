# Relatório consolidado — Verzel QA

Execução **suite-20261015T224240Z**, conduzida pelo Codex seguindo a skill verzel-qa. Modalidade: automação.

**Início:** 15/10/2026, 19:42:40; **fim:** 15/10/2026, 19:42:57 (America/Sao_Paulo, UTC−03). Duração: 17.8 s.

Ambiente: https://verzel-store.qa-test-verzel-store.workers.dev; darwin/arm64, Node v20.19.5, Playwright 1.64.1, Chromium 156.0.8078.4. Referência documental 2.3.0; versão implantada não verificada.

Comandos: `npm run typecheck` (aprovado) e `npm test` (saída **1**, preservada). Um worker, zero retries, nenhum teste ignorado. [Resultado e artefatos desta execução](evidencias/suite-20261015T224240Z/resultado.json).

## Resultado da suíte disponível

| Camada | Testes | Aprovados | Reprovados |
| --- | --- | --- | --- |
| UI | 3 | 2 | 1 |
| API | 16 | 13 | 3 |
| infraestrutura | 1 | 1 | 0 |
| **Total** | **20** | **16** | **4** |

São 19 testes de negócio (linhas/combinações) e um teste local de infraestrutura. As linhas de negócio referenciam 11 IDs CT distintos; isso não equivale a 11 cenários completos em todas as camadas. A suíte disponível foi executada por inteiro, mas não cobre integralmente o planejamento. A API fez 21 chamadas; a UI também faz suas chamadas de aplicação, não contabilizadas nesse número. Um pedido de seis unidades foi indevidamente confirmado; dados de cliente são fictícios.

## Testes, resultados e evidências

| Registro | Teste | Estado | Evidência |
| --- | --- | --- | --- |
| SUITE-01 | CT-001 API — D01: desconto nos produtos, sem desconto no frete | Aprovado | [HTTP-1](evidencias/suite-20261015T224240Z/teste-01-anexo-1.json) |
| SUITE-02 | CT-002 API — D02: frete grátis no limite com cupom | Reprovado | [HTTP-1](evidencias/suite-20261015T224240Z/teste-02-anexo-1.json), [error-context](evidencias/suite-20261015T224240Z/teste-02-anexo-2.md), [trace](evidencias/suite-20261015T224240Z/teste-02-anexo-3.zip) |
| SUITE-03 | CT-003 API — D03: frete pago abaixo do limite | Aprovado | [HTTP-1](evidencias/suite-20261015T224240Z/teste-03-anexo-1.json) |
| SUITE-04 | CT-004 API — D04: frete grátis no limite sem cupom | Reprovado | [HTTP-1](evidencias/suite-20261015T224240Z/teste-04-anexo-1.json), [error-context](evidencias/suite-20261015T224240Z/teste-04-anexo-2.md), [trace](evidencias/suite-20261015T224240Z/teste-04-anexo-3.zip) |
| SUITE-05 | CT-005 API — D06: frete considera subtotal antes do desconto | Aprovado | [HTTP-1](evidencias/suite-20261015T224240Z/teste-05-anexo-1.json) |
| SUITE-06 | CT-006 API — minúsculas | Aprovado | [HTTP-1](evidencias/suite-20261015T224240Z/teste-06-anexo-1.json) |
| SUITE-07 | CT-006 API — caixa mista e espaços externos | Aprovado | [HTTP-1](evidencias/suite-20261015T224240Z/teste-07-anexo-1.json) |
| SUITE-08 | CT-007 / CT-014 API — NAOEXISTE: cálculo 200, pedido 422 | Aprovado | [HTTP-1](evidencias/suite-20261015T224240Z/teste-08-anexo-1.json), [HTTP-2](evidencias/suite-20261015T224240Z/teste-08-anexo-2.json) |
| SUITE-09 | CT-007 / CT-014 API — VERAO2026: cálculo 200, pedido 422 | Aprovado | [HTTP-1](evidencias/suite-20261015T224240Z/teste-09-anexo-1.json), [HTTP-2](evidencias/suite-20261015T224240Z/teste-09-anexo-2.json) |
| SUITE-10 | CT-012 API — quantidade 1 no cálculo e pedido | Aprovado | [HTTP-1](evidencias/suite-20261015T224240Z/teste-10-anexo-1.json), [HTTP-2](evidencias/suite-20261015T224240Z/teste-10-anexo-2.json) |
| SUITE-11 | CT-012 API — quantidade 5 no cálculo e pedido | Aprovado | [HTTP-1](evidencias/suite-20261015T224240Z/teste-11-anexo-1.json), [HTTP-2](evidencias/suite-20261015T224240Z/teste-11-anexo-2.json) |
| SUITE-12 | CT-012 API — quantidade 6 no cálculo e pedido | Reprovado | [HTTP-1](evidencias/suite-20261015T224240Z/teste-12-anexo-1.json), [HTTP-2](evidencias/suite-20261015T224240Z/teste-12-anexo-2.json), [error-context](evidencias/suite-20261015T224240Z/teste-12-anexo-3.md), [trace](evidencias/suite-20261015T224240Z/teste-12-anexo-4.zip) |
| SUITE-13 | CT-019 API — lista vazia | Aprovado | [HTTP-1](evidencias/suite-20261015T224240Z/teste-13-anexo-1.json) |
| SUITE-14 | CT-019 API — produto duplicado | Aprovado | [HTTP-1](evidencias/suite-20261015T224240Z/teste-14-anexo-1.json) |
| SUITE-15 | CT-019 API — quantidade fracionária | Aprovado | [HTTP-1](evidencias/suite-20261015T224240Z/teste-15-anexo-1.json) |
| SUITE-16 | CT-016 API — rejeitar nome sem sobrenome | Aprovado | [HTTP-1](evidencias/suite-20261015T224240Z/teste-16-anexo-1.json) |
| SUITE-17 | CT-001 — aplicar 10% nos produtos sem descontar o frete | Aprovado | [CT-001-resumo](evidencias/suite-20261015T224240Z/teste-17-anexo-1.png) |
| SUITE-18 | CT-005 — calcular frete pelo subtotal anterior ao desconto | Aprovado | [CT-005-resumo](evidencias/suite-20261015T224240Z/teste-18-anexo-1.png) |
| SUITE-19 | CT-002 — manter frete grátis em exatamente R$ 200 com cupom | Reprovado | [CT-002-calculo-observado](evidencias/suite-20261015T224240Z/teste-19-anexo-1.json), [CT-002-resumo](evidencias/suite-20261015T224240Z/teste-19-anexo-2.png), [screenshot](evidencias/suite-20261015T224240Z/teste-19-anexo-3.png), [video](evidencias/suite-20261015T224240Z/teste-19-anexo-4.webm), [error-context](evidencias/suite-20261015T224240Z/teste-19-anexo-5.md), [trace](evidencias/suite-20261015T224240Z/teste-19-anexo-6.zip) |
| SUITE-20 | INFRA-001 — iniciar navegador, interagir e verificar resultado local | Aprovado | Sem anexo; resultado no JSON |

## Classificação das falhas

- **BUG-001, CA06:** SUITE-02 (CT-002 API), SUITE-04 (CT-004 API) e SUITE-19 (CT-002 UI). Em subtotal 200, a aplicação retorna/exibe frete 19,90; deveria ser zero. Relato e impacto em [BUG-001](bugs/BUG-001.md). São três manifestações, não três defeitos.
- **BUG-002, CA10:** SUITE-12 (CT-012 API, quantidade 6). Cálculo 200 e pedido 201 aceitando seis unidades, em vez de 422/QUANTIDADE_MAXIMA_EXCEDIDA. Relato em [BUG-002](bugs/BUG-002.md).
- **Testes/ferramentas:** nenhum erro de preparação/seletor identificado nesta rodada; nenhum erro fora de teste no JSON. O extrator temporário do relatório inicialmente tentou ler baseURL de um campo ausente do JSON; foi corrigido para obter a origem da resposta real anexada, sem alterar testes ou repetir chamadas. Esse problema de consolidação não é defeito da loja. O extrator foi usado temporariamente, sem adicionar dependência ou script ao projeto.
- **Ambiente:** nenhum bloqueio ou indisponibilidade demonstrado nesta rodada. O 403 histórico de urllib está no registro da investigação anterior e não foi misturado aos resultados atuais.

As assertions continuam representando a documentação. Não houve retries, testes ignorados, alteração de esperado ou classificação de falha conhecida como sucesso. Confirmação de defeito não significa diagnóstico da causa interna.

## Cobertura por requisito

Esta tabela combina a execução automática atual com registros humanos anteriores, identificando a origem. “Verificado” significa somente os dados/caminhos citados, não prova de todas as entradas possíveis.

| Requisito | Evidência atual ou anterior | Situação e limite |
| --- | --- | --- |
| CA01 | CT-001/002/005 UI/API e confirmações manuais | Desconto correto nas combinações exercitadas; falhas de frete separadas |
| CA02 | CT-006 API, duas variações | Normalização aprovada no cálculo; UI/pedido e demais linhas pendentes |
| CA03 | CT-007/014 API, NAOEXISTE | Mensagem/ausência de desconto/contratos 200 e 422 aprovados; UI não confirmada |
| CA04 | CT-007/014 API e EXE-004 manual adaptada | Expirado rejeitado como documentado; frete do caso manual tem BUG-001 |
| CA05 | EXE-005 manual parcial/adaptada | Bloqueio, remoção e reaplicação relatados; sequência D01 exata e troca entre dois válidos não demonstradas |
| CA06 | CT-002/004 API e CT-002 UI | Reprovado no limite inclusivo; valor acima do limite aprovado em CT-005 |
| CA07 | CT-001 UI/API e CT-003 API | Frete fixo e faltante corretos nos dados testados; CT-003 UI sem cupom pendente |
| CA08 | CT-005 UI/API, subtotal 209,90 | Aprovado nessa combinação com total descontado 188,91; não extrapolar a todas as compras |
| CA09 | CT-001 UI/API | Desconto apenas nos produtos verificado em subtotal 100 e frete pago |
| CA10 | EXE-007 manual UI e CT-012 API | UI bloqueou sexta unidade; API reprovada para seis; 1/5 aceitos |
| CA11 | CT-010 manual e valores dos cálculos automáticos | Precisão dos valores exercitados; meio centavo limitado pelos dados fixos e especificação |

Contratos e checkout: status 200/422 de cupons, quantidade e três erros de itens selecionados foram verificados. Nome único rejeitado na API. Pedidos válidos de quantidade 1/5 confirmados; e-mail inválido, CEP inválido e duas formas de CEP ainda não foram cobertos. Catálogo teve verificação anterior parcial. Não executar/alegar testes de carga, estresse ou segurança.

## Execuções humanas e limites da entrega

As execuções manuais permanecem em [registro próprio](execucoes/manual.md), com [índice de capturas](evidencias/manual-fornecida.md). Tentativas anteriores e demonstrações não entram na contagem de novos cenários. Algumas confirmações antigas continuam somente na conversa; horários e versão do Brave não foram informados. Não preencher essas lacunas com dados da automação.

Rastreabilidade detalhada e planejamento: [matriz](rastreabilidade.md). Pendentes: CT-009 completo; demais variações de CT-006; negativos de checkout e CT-017; demais erros CT-019 e CT-020; partes de cenários sem vínculo de execução. Existem riscos P1 não completamente cobertos, portanto não afirmar validação integral ou entrega sem pendências.

## Skill e acesso ao relatório

A skill foi efetivamente lida e usada nesta rodada para seleção da suíte normal, execução, preservação de falhas, separação das modalidades e consolidação. Não fornece uma garantia automática de qualidade. Foi acrescentada orientação para distinguir teste parametrizado/camada de cenário e separar demonstração de execução normal. A validação estrutural foi repetida; nenhum script adicional de projeto foi necessário.

- Ler este Markdown diretamente no repositório; anexos estão preservados em pasta exclusiva desta rodada.
- Abrir o relatório HTML completo local: `npm run report`. Ele agora contém UI, API e infraestrutura dessa execução. A visualização não executa novos testes.
- Para trace, usar `npx playwright show-trace` seguido do caminho do ZIP desejado na tabela acima. API não tem página visual; UI tem ações, captura e vídeo quando falha.
- `npm run report:demo` abre separadamente a demonstração lenta, sem substituir os números desta suíte.
