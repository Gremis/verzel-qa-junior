# Índice de evidências

| ID | Origem | Artefato | Limite |
| --- | --- | --- | --- |
| EVD-001 | Execução manual | [Índice de capturas e relatos](manual-fornecida.md) | 15 PNGs locais; lacunas e relatos sem arquivo identificados no índice |
| EVD-002 | Agente | [Catálogo: requisição/resposta](api/catalogo.json) | Somente GET da lista |
| EVD-003 | Agente | [Subtotal 200 sem cupom](api/limite-sem-cupom.json) | Cálculo, sem pedido/UI |
| EVD-004 | Agente | [Subtotal 200 com cupom](api/limite-com-cupom.json) | Cálculo, sem pedido/UI |
| EVD-005 | Agente | [Subtotal 209,90 sem cupom](api/acima-sem-cupom.json) | Controle exploratório do cálculo |
| EVD-009 | Agente / suíte normal completa | [Relatório consolidado](../relatorio-consolidado.md) | 20 testes, 16 aprovados, 4 reprovados; manuais e demo separados |
| EVD-008 | Agente / automação API | [Execução e respostas](playwright-api/execucao.json), [reprodução de quantidade](playwright-api/reproducao-quantidade-6.json) e [trace](playwright-api/ct-012-quantidade-6-trace.zip) | 16 testes, 21 chamadas; reprodução curl separada |
| EVD-007 | Agente / automação UI | [Resultados e artefatos Playwright](../execucoes/playwright-ui.md) | Três cenários; falha real preservada, sem checkout |
| EVD-006 | Agente | [Subtotal 209,90 com cupom](api/acima-com-cupom.json) | Cálculo CT-005 |

Resultados: [manual humano](../execucoes/manual.md) e [investigação por agente](../execucoes/agente-api.md). Defeitos: [BUG-001](../bugs/BUG-001.md) e [BUG-002](../bugs/BUG-002.md).

Verificação técnica separada: [INFRA-001](infraestrutura/infra-001.json), teste Playwright local aprovado, sem cobertura de negócio. Relatórios completos são gerados em pastas ignoradas pelo Git; comandos em [automação](../automacao.md).

Revisão posterior: [verificações e reexecução de 16/10/2026](../revisao-final.md), preservada separadamente da EVD-009.
