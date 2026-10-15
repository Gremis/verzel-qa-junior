# Investigação direcionada por agente

Responsável: Codex. Modalidade: **exploração por agente via API**, sem Playwright ou interação com a UI. Referência documental 2.3.0; versão implantada não verificada.

Ferramenta: curl acionado sequencialmente por um roteiro temporário Python. Versão exata, início/fim com offset `America/Sao_Paulo`, requisição, cabeçalhos, status e resposta estão nos arquivos JSON. Roteiro temporário não é parte da suíte entregue nem automação Playwright. Não foram criados pedidos.

## Tentativas de acesso

Antes dos registros abaixo, uma tentativa GET do catálogo com Python urllib retornou HTTP 403. O corpo e horário não foram capturados; registro disponível é a saída da ferramenta na sessão. Uma tentativa direcionada com curl retornou 200 e os oito produtos. A sequência abaixo foi então capturada integralmente com curl. Não atribuir esse 403 à lógica da loja nem classificá-lo como bug: a causa não foi determinada. Não houve repetição em ciclo.

## Resultados

| Execução | Cenário e seleção | Esperado | Observado | Estado / evidência |
| --- | --- | --- | --- | --- |
| EXE-011 | CT-018, somente lista de catálogo | 200, oito produtos e preços de referência | 200, oito produtos e preços correspondentes | Aprovado nessa parte; GET individual ainda não executado; EVD-002 |
| EXE-012 | CT-004, D04, cálculo | Subtotal 200, desconto 0, frete 0, total 200 | 200; subtotal 200, desconto 0, frete 19,9, total 219,9 | Reprovado; BUG-001; EVD-003 |
| EXE-013 | CT-002, D02, cálculo | Subtotal 200, desconto 20, frete 0, total 180 | 200; subtotal 200, desconto 20, frete 19,9, total 199,9 | Reprovado; BUG-001; EVD-004 |
| EXE-014 | Controle exploratório de CT-005 sem cupom | Subtotal 209,90, desconto 0, frete 0, total 209,90 | 200, valores correspondentes | Aprovado nessa combinação; EVD-005 |
| EXE-015 | CT-005, D06, cálculo | Subtotal 209,90, desconto 20,99, frete 0, total 188,91 | 200, valores correspondentes, freteGratis true | Aprovado nessa camada/combinação; UI e pedido não verificados; EVD-006 |

Cada linha é uma consulta independente. Comparação realizada com valores documentais, usando aritmética decimal independente, não comparação de resposta contra ela mesma. A confirmação do catálogo é precondição dos cálculos, não execução completa de CT-018.

## Classificação das divergências

| Item | Classificação | Fundamento |
| --- | --- | --- |
| Frete cobrado em exatamente 200 | Defeito confirmado, BUG-001 | CA06 explícito, reprodução independente com/sem cupom |
| Hipótese de frete baseado no valor após desconto | Não demonstrada | Controle D06 usa subtotal 209,90 e total descontado 188,91 mantendo frete grátis |
| Duas chamadas ao aplicar cupom | Observação humana pendente de investigação | Sem limite de chamadas documentado ou impacto demonstrado; não atribuir severidade |
| “Primeira compra” na vitrine | Ambiguidade AMB01 | Sem regra/mecanismo de histórico descrito; não inventar requisito |
| Arredondamento de meio centavo | Limitação AMB02 | Não especificado e não alcançado pelos dados fixos usados |
| 403 inicial com urllib | Problema de acesso/ferramenta sem causa determinada | Curl acessou; não comprova falha funcional |
| Ausência de e-mail e nova aba vazia | Comportamentos esperados | Simplificações explícitas |
| Metadados humanos incompletos e algumas confirmações antigas sem imagem local | Limitação documental | Capturas recebidas estão no índice; lacunas não invalidam o relato nem autorizam inventar metadados |

As variações de dados foram registradas com precisão, sem aprovar casos diferentes. Cenários restantes não foram executados nesta investigação.
