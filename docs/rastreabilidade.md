# Rastreabilidade planejada

Relaciona regras a [cenários especificados](cenarios.md). Os vínculos de execução abaixo distinguem resultados parciais/adaptados de cenários completos; não presumir aprovação de todas as linhas ou camadas.

## Execução consolidada atual

[Suíte normal completa e cobertura CA01–CA11](relatorio-consolidado.md), EVD-009: 20 testes (19 de negócio e INFRA-001), 16 aprovados e quatro reprovados pelos BUG-001/002. É uma nova tentativa dos testes implementados, sem ampliar as variações de cobertura. Registros anteriores abaixo preservados.

## Execuções e evidências disponíveis

| Cenário | Execução / alcance | Evidência | Defeito |
| --- | --- | --- | --- |
| CT-001 | [EXE-001 manual](execucoes/manual.md), D01 | EVD-001 item 1 | — |
| CT-002 | EXE-002 manual e [EXE-013 agente](execucoes/agente-api.md), cálculo | EVD-001 item 2; EVD-004 | BUG-001 |
| CT-004 | EXE-003 manual / EXE-012 agente, somente D04 | EVD-001 item 3; EVD-003 | BUG-001 |
| CT-005 | EXE-015 agente, D06 somente cálculo; EXE-014 controle sem cupom | EVD-005/006 | Não observado nessa combinação |
| CT-007 | EXE-004 manual, expirado com dados adaptados | EVD-001 item 4 | BUG-001 no frete, não na rejeição |
| CT-008 | EXE-005 manual, parcial/adaptado | EVD-001 itens 2–3 e relato | BUG-001 no frete |
| CT-010 | EXE-006 manual, D07 | EVD-001 item 5 | — |
| CT-011 | EXE-007 manual, UI | EVD-001 item 6 | — |
| CT-013/CT-015 | EXE-008/009 manual, combinações exploratórias distintas dos exemplos especificados | EVD-001 itens 7–8 | — |
| CT-015 | EXE-016 manual, P001/P002/P003/P004 × 1 com cupom, dados fictícios; status HTTP não informado | EVD-001 item 10 | — |
| CT-015 | EXE-017 manual, P002/P003/P004 × 1 sem cupom; status HTTP não informado | EVD-001 item 11 | — |
| CT-018 | EXE-011 agente, somente lista | EVD-002 | — |

Artefatos em [índice de evidências](evidencias/README.md). EXE-010 é exploração das simplificações. [EXE-018/019/020 UI](execucoes/playwright-ui.md): CT-001/D01 aprovado, CT-002/D02 reprovado (BUG-001), CT-005/D06 aprovado, EVD-007; reexecução conjunta separada.

### API automatizada — EVD-008

[Registro Playwright API](execucoes/playwright-api.md) detalha as 16 linhas de teste e seus resultados. CT-001/D01, CT-003/D03 e CT-005/D06 aprovados; CT-002/D02 e CT-004/D04 reprovados pelo BUG-001. CT-006: duas variações aprovadas somente no cálculo. CT-007/CT-014: inexistente e expirado aprovados nos contratos 200/422 com uma mochila. CT-012: 1/5 aprovados no cálculo e pedido; 6 reprovado nos dois (BUG-002). CT-019: vazio/duplicado/fracionário aprovados somente no cálculo. CT-016: apenas nome único aprovado como rejeição de pedido. A cobertura de cada esquema permanece limitada às variações executadas.

Ainda pendentes: CT-009 completo, demais variações/camadas de CT-006, CT-016, CT-017, CT-019, CT-020 e outros casos sem vínculo. CT-018 continua parcial pela investigação de catálogo anterior. Não há aprovação presumida de e-mail/CEP ou normalização em pedido.

## Requisitos e cobertura planejada

| Requisito | Cenários |
| --- | --- |
| CA01 | CT-001, CT-002, CT-005, CT-010, CT-015 |
| CA02 | CT-006 |
| CA03 | CT-007, CT-014 |
| CA04 | CT-007, CT-014 |
| CA05 | CT-008 |
| CA06 | CT-002, CT-004, CT-005, CT-015 |
| CA07 | CT-001, CT-003, CT-009 |
| CA08 | CT-002, CT-005 |
| CA09 | CT-001, CT-015 |
| CA10 | CT-011, CT-012, CT-013 |
| CA11 | CT-010, conferências monetárias CT-001–CT-005 e CT-015 |
| API01, API02 | CT-018, CT-020 |
| API03 | CT-001–CT-007, CT-010, CT-012, CT-013, CT-019, CT-020 |
| API04 | CT-012–CT-017, CT-019 |
| REG01, REG02 | CT-015, CT-016 |
| REG03 | CT-016, CT-017 |
| REG04, REG05 | CT-015 |

## Camada, modalidade e ordem planejadas

UI: manual humana, com seleção posterior para Playwright. API: automação Playwright planejada. Exploração por agente, se solicitada, terá registro separado; não conta como manual humano.

| Cenário | Prioridade | Camada |
| --- | --- | --- |
| CT-001–CT-007 | P1 | UI e API de cálculo; CT-006 também API de pedido |
| CT-008, CT-009 | P1 | UI |
| CT-010 | P2 | UI e API de cálculo |
| CT-011 | P1 | UI |
| CT-012, CT-013 | P1 | API de cálculo e pedido; CT-013 também UI |
| CT-014 | P1 | API de pedido |
| CT-015 | P1 | UI, API de cálculo e pedido |
| CT-016, CT-017 | P2 | UI e API de pedido |
| CT-018–CT-020 | P2 | API |

CT-006 no pedido: enviar cliente válido e a mesma variação do cupom em requisição independente; esperar 201 e valores D01. CT-013 na UI: preparar os dois produtos com cinco unidades e confirmar valores no resumo.

## Erros de contrato

| Código | Cenário |
| --- | --- |
| JSON_INVALIDO, ROTA_NAO_ENCONTRADA, METODO_NAO_PERMITIDO | CT-020 |
| PRODUTO_NAO_ENCONTRADO | CT-019 (422), CT-020 (404) |
| ITENS_OBRIGATORIOS, ITEM_INVALIDO, ITEM_DUPLICADO, QUANTIDADE_INVALIDA | CT-019 |
| QUANTIDADE_MAXIMA_EXCEDIDA | CT-012 |
| DADOS_INVALIDOS | CT-016 |
| CUPOM_INVALIDO, CUPOM_EXPIRADO | CT-014 |

As limitações de preços, cupons e arredondamento estão em [cenários](cenarios.md) e [ambiguidades](requisitos.md). Cobertura planejada não implica automação implementada nem cobertura completa demonstrada.
