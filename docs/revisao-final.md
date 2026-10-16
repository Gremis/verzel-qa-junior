# Revisão final da entrega

Revisão em 16/10/2026 pelo Codex, usando `verzel-qa`. Fontes: PDF fornecido (cinco páginas, relidas visualmente), texto VZS-142 2.3.0 fornecido, requisitos e contratos locais. Versão implantada continua não verificada. Não foram executados testes de segurança.

## Verificações

- CA01–CA11, preços e regras de cálculo transcritos de forma consistente; matriz e cenários diferenciam cobertura planejada da demonstrada.
- PDF: cenários Gherkin, resultados manuais/exploratórios, dois relatos de bugs, evidências, três cenários UI Playwright e README presentes. Execução integral dos cenários manuais planejados e contratos não selecionados permanece pendente. Publicação/visibilidade do repositório e envio não foram verificados ou realizados.
- Links locais Markdown conferidos, sem destinos ausentes; ZIPs de evidências íntegros. Link remoto `/documentacao` respondeu HTTP 200; a navegação da suíte verificou acesso à loja. Âncoras externas não foram verificadas individualmente.
- Busca nos arquivos versionados e no conteúdo dos ZIPs por padrões de tokens GitHub, chaves AWS, chaves privadas e Bearer: nenhuma correspondência. Não equivale a garantia absoluta de ausência de segredos, OCR das capturas ou auditoria de todo o histórico Git.
- `npm ls --depth=0`: dependências instaladas coincidem com as versões declaradas. `npm run typecheck`: aprovado. `npm run test:list`: 20 testes, sem execução de negócio. Não foi necessário reinstalar pacotes ou navegador já funcionais.
- `quick_validate.py .agents/skills/verzel-qa`: Skill is valid. Validação estrutural complementada pelo uso da skill nesta revisão.
- Ajustados textos de planejamento desatualizados e adicionado BUG-002 ao índice de evidências; nenhum teste ou esperado alterado.

## Reprodução da suíte

`npm test`: saída **1**, 16 aprovados, 4 reprovados, zero ignorados/flaky; um worker, zero retries, sem erros fora dos testes.

Início `2026-10-16T09:10:50.288Z`; fim `2026-10-16T09:11:06.293Z` (UTC); em America/Sao_Paulo, 16/10/2026, 06:10:50–06:11:06. Duração 16,0 s. Ambiente darwin/arm64, Node v20.19.5, Playwright 1.64.1, Chromium 156.0.8078.4.

[Metadados, resultados e índice de anexos](evidencias/review-20261016T091050Z/resultado.json). A rodada anterior foi preservada; o relatório HTML temporário agora corresponde a esta reexecução.

| Teste | Resultado | Evidências desta rodada |
| --- | --- | --- |
| CT-001 API — D01: desconto nos produtos, sem desconto no frete | Aprovado | [HTTP-1](evidencias/review-20261016T091050Z/teste-01-anexo-1.json) |
| CT-002 API — D02: frete grátis no limite com cupom | Reprovado | [HTTP-1](evidencias/review-20261016T091050Z/teste-02-anexo-1.json), [error-context](evidencias/review-20261016T091050Z/teste-02-anexo-2.md), [trace](evidencias/review-20261016T091050Z/teste-02-anexo-3.zip) |
| CT-003 API — D03: frete pago abaixo do limite | Aprovado | [HTTP-1](evidencias/review-20261016T091050Z/teste-03-anexo-1.json) |
| CT-004 API — D04: frete grátis no limite sem cupom | Reprovado | [HTTP-1](evidencias/review-20261016T091050Z/teste-04-anexo-1.json), [error-context](evidencias/review-20261016T091050Z/teste-04-anexo-2.md), [trace](evidencias/review-20261016T091050Z/teste-04-anexo-3.zip) |
| CT-005 API — D06: frete considera subtotal antes do desconto | Aprovado | [HTTP-1](evidencias/review-20261016T091050Z/teste-05-anexo-1.json) |
| CT-006 API — minúsculas | Aprovado | [HTTP-1](evidencias/review-20261016T091050Z/teste-06-anexo-1.json) |
| CT-006 API — caixa mista e espaços externos | Aprovado | [HTTP-1](evidencias/review-20261016T091050Z/teste-07-anexo-1.json) |
| CT-007 / CT-014 API — NAOEXISTE: cálculo 200, pedido 422 | Aprovado | [HTTP-1](evidencias/review-20261016T091050Z/teste-08-anexo-1.json), [HTTP-2](evidencias/review-20261016T091050Z/teste-08-anexo-2.json) |
| CT-007 / CT-014 API — VERAO2026: cálculo 200, pedido 422 | Aprovado | [HTTP-1](evidencias/review-20261016T091050Z/teste-09-anexo-1.json), [HTTP-2](evidencias/review-20261016T091050Z/teste-09-anexo-2.json) |
| CT-012 API — quantidade 1 no cálculo e pedido | Aprovado | [HTTP-1](evidencias/review-20261016T091050Z/teste-10-anexo-1.json), [HTTP-2](evidencias/review-20261016T091050Z/teste-10-anexo-2.json) |
| CT-012 API — quantidade 5 no cálculo e pedido | Aprovado | [HTTP-1](evidencias/review-20261016T091050Z/teste-11-anexo-1.json), [HTTP-2](evidencias/review-20261016T091050Z/teste-11-anexo-2.json) |
| CT-012 API — quantidade 6 no cálculo e pedido | Reprovado | [HTTP-1](evidencias/review-20261016T091050Z/teste-12-anexo-1.json), [HTTP-2](evidencias/review-20261016T091050Z/teste-12-anexo-2.json), [error-context](evidencias/review-20261016T091050Z/teste-12-anexo-3.md), [trace](evidencias/review-20261016T091050Z/teste-12-anexo-4.zip) |
| CT-019 API — lista vazia | Aprovado | [HTTP-1](evidencias/review-20261016T091050Z/teste-13-anexo-1.json) |
| CT-019 API — produto duplicado | Aprovado | [HTTP-1](evidencias/review-20261016T091050Z/teste-14-anexo-1.json) |
| CT-019 API — quantidade fracionária | Aprovado | [HTTP-1](evidencias/review-20261016T091050Z/teste-15-anexo-1.json) |
| CT-016 API — rejeitar nome sem sobrenome | Aprovado | [HTTP-1](evidencias/review-20261016T091050Z/teste-16-anexo-1.json) |
| CT-001 — aplicar 10% nos produtos sem descontar o frete | Aprovado | [CT-001-resumo](evidencias/review-20261016T091050Z/teste-17-anexo-1.png) |
| CT-005 — calcular frete pelo subtotal anterior ao desconto | Aprovado | [CT-005-resumo](evidencias/review-20261016T091050Z/teste-18-anexo-1.png) |
| CT-002 — manter frete grátis em exatamente R$ 200 com cupom | Reprovado | [CT-002-calculo-observado](evidencias/review-20261016T091050Z/teste-19-anexo-1.json), [CT-002-resumo](evidencias/review-20261016T091050Z/teste-19-anexo-2.png), [screenshot](evidencias/review-20261016T091050Z/teste-19-anexo-3.png), [video](evidencias/review-20261016T091050Z/teste-19-anexo-4.webm), [error-context](evidencias/review-20261016T091050Z/teste-19-anexo-5.md), [trace](evidencias/review-20261016T091050Z/teste-19-anexo-6.zip) |
| INFRA-001 — iniciar navegador, interagir e verificar resultado local | Aprovado | Resultado no JSON |

As quatro falhas reproduzem [BUG-001](bugs/BUG-001.md), frete cobrado no subtotal de R$ 200 (CT-002 UI/API e CT-004 API), e [BUG-002](bugs/BUG-002.md), seis unidades aceitas pela API (CT-012). Não houve nova falha de teste nem indisponibilidade demonstrada. Não foi investigada a causa interna da aplicação.

Cobertura por CA e lacunas permanecem as do [relatório consolidado](relatorio-consolidado.md#cobertura-por-requisito) e da [rastreabilidade](rastreabilidade.md). Esta reexecução não cria novos cenários nem novas execuções humanas. Registros manuais permanecem separados. A entrega demonstra o mínimo de três cenários automatizados; não significa validação integral da loja.
