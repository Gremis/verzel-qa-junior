# Registro de execução manual

Responsável: Gremis Tovar. Modalidade: **manual humana**, incluindo exploração com DevTools. Fonte: relatos, capturas e JSON fornecidos na conversa. Ambiente informado: Brave, versão não informada; URL base `https://verzel-store.qa-test-verzel-store.workers.dev`. Versão implantada não verificada; referência documental 2.3.0. Horários das sessões e estado inicial completo não informados. Não inferir horário de execução de teste pelo timestamp do pedido.

Evidências: [EVD-001 — índice das capturas e relatos](../evidencias/manual-fornecida.md). As imagens locais estão ligadas por item; o índice indica quais confirmações antigas permanecem apenas na conversa. Não inferir novos resultados da simples inclusão dos arquivos.

| Execução | Cenário / variação efetivamente realizada | Esperado | Observado confirmado | Resultado e limite |
| --- | --- | --- | --- | --- |
| EXE-001 | CT-001, D01 | Subtotal 100; desconto 10; frete 19,90; total 109,90 | UI e JSON correspondem; cálculo 200 informado | Aprovado nessa variação; EVD-001 item 1 |
| EXE-002 | CT-002, D02 | Frete zero; desconto 20; total 180 | UI/API: frete 19,90; desconto 20; total 199,90; faltante zero | Reprovado, BUG-001; EVD-001 item 2 |
| EXE-003 | CT-004, apenas D04 | Sem cupom: subtotal/total 200, frete zero | Após remover cupom: desconto zero, frete 19,90, total 219,90 | Reprovado, BUG-001; D05 pendente; EVD-001 item 3 |
| EXE-004 | CT-007, variação adaptada: VERAO2026 com duas mochilas | Cálculo 200, desconto zero, cupom não aplicado, mensagem “Cupom expirado.” | Todos esses campos conferem na UI/API; total 219,90 devido ao frete incorreto | Validação de cupom aprovada nessa variação; total reprovado por BUG-001. Não equivale à linha de uma mochila do cenário; EVD-001 item 4 |
| EXE-005 | CT-008, observação parcial com duas mochilas | Impedir outro cupom ativo; remover desconto e reaplicar sem acumular | Bloqueio confirmado no relato; capturas antes/depois mostram desconto 0 e depois 20, sem acúmulo, mas frete incorreto | Verificações de cupom aprovadas com dados adaptados; cenário D01 completo não executado. Frete: BUG-001; EVD-001 itens 2–3 e confirmação textual |
| EXE-006 | CT-010, D07 | Subtotal 299,50; desconto 29,95; frete zero; total 269,55, UI com centavos | Capturas da UI e API correspondem | Aprovado nessa variação, sem provar desempate de arredondamento; EVD-001 item 5 |
| EXE-007 | CT-011 | Aceitar cinco camisetas e impedir sexta no carrinho e vitrine | Impedimento confirmado no relato; capturas mostram cinco e ambos os controles desabilitados | Aprovado no caminho observado da UI, sem validar API para seis; EVD-001 item 6 |
| EXE-008 | CT-013/CT-015, exploração adaptada: P001/P002/P003 × 5 | Subtotal 1.948,50; cupom 194,85; frete zero; total 1.753,65 | Carrinho e confirmação correspondem; POST pedidos 201; número VZ-328716, criadoEm e itens no JSON | Aprovado para combinação explorada, não para os dados exatos CT-013 ou todas as linhas CT-015; EVD-001 item 7 |
| EXE-009 | CT-015, exploração adaptada: camiseta + calça COM cupom | Subtotal 199,80; desconto 19,98; frete 19,90; faltante 0,20; total 199,72 | Carrinho e confirmação VZ-830093 correspondem; conclusão confirmada com e-mail temporário/CEP gerado | Aprovado nos valores e confirmação UI mostrados; status HTTP, corpo de cliente e criadoEm dessa execução não fornecidos. Não é D03 sem cupom; EVD-001 item 8 |
| EXE-010 | Exploração de isolamento/navegação; sem cenário formal específico | Nova aba vazia; ausência de e-mail é esperada | Relatado início com nova aba vazia, carrinho mantido ao atualizar/navegar na mesma aba e ausência de e-mail | Compatível com simplificações; não comprova persistência entre navegadores; EVD-001 item 9 |

Valores em reais. Registros de execução/observação não equivalem à quantidade de cenários completos aprovados. Registros parciais ou adaptados não aprovam o cenário inteiro. CT-009 não foi completado em sua sequência especificada; CT-003 sem cupom não deve ser confundido com EXE-009 com cupom.

## EXE-016 — Confirmação com dados fictícios e cupom

- Responsável: Gremis Tovar; modalidade manual humana. Fonte: nova captura e confirmação textual de uso de dados fictícios. Brave, versão não informada; mesma URL base, caminho `/pedido-confirmado`. Horário da execução não informado; `criadoEm` é dado da resposta, não cronômetro da execução.
- Vínculo: CT-015, variação exploratória adicional, não substitui as linhas D01/D02/D03. Uma unidade de cada produto P001, P002, P003 e P004 com BEMVINDO10.
- Esperado: subtotal `59,90 + 139,90 + 189,90 + 49,90 = 439,60`; desconto `43,96`; frete `0`; faltante `0`; total `395,64`; número no formato VZ- seguido de seis dígitos e confirmação sem pagamento online.
- Observado: tela e Preview da resposta mostram subtotal 439,60, desconto 43,96, frete zero/grátis, freteGratis true, faltante zero e total 395,64. Itens e quantidades na tela correspondem. Pedido `VZ-020370`; `criadoEm` visível como `2026-10-15T22:04:21.760Z`; cupom aplicado true.
- Resultado: aprovado para os valores e confirmação apresentados nessa variação. Status HTTP e requisição completa não aparecem na captura e não foram informados; não registrar 201 por suposição. Cliente aparece parcialmente; validação integral de campos e normalização de CEP não comprovadas.
- Evidência: [EVD-001 item 10](../evidencias/manual-fornecida.md), imagem fornecida e agora organizada localmente; status HTTP não visível. Não transcrever endereço temporário nem dados desnecessários.

## EXE-017 — Confirmação sem cupom

- Responsável: Gremis Tovar; modalidade manual humana. Fonte: JSON colado e captura da confirmação fornecidos na conversa. Brave, versão não informada; URL base do ambiente, caminho `/pedido-confirmado`. Horário da execução não informado; `criadoEm` é timestamp da resposta, não início/fim da sessão. Versão implantada não verificada.
- Vínculo: CT-015, variação exploratória adicional sem cupom: P002, P003 e P004, uma unidade de cada. Não substitui D03, cujo subtotal fica abaixo do limite de frete.
- Esperado: subtotal `139,90 + 189,90 + 49,90 = 379,70`; desconto zero; frete zero; freteGratis true; faltante zero; total 379,70; confirmação com número no formato documentado e itens correspondentes.
- Observado: JSON e tela correspondem aos valores e itens esperados. Resposta contém `cupom: null`, número `VZ-137193`, `criadoEm: 2026-10-15T22:05:45.191Z` e dados de cliente. A tela informa pagamento na entrega.
- Resultado: aprovado para os valores, itens e confirmação apresentados nessa variação. Status HTTP e corpo da requisição não fornecidos; não registrar 201 por inferência. O CEP retornado tem oito dígitos, mas isso não demonstra aceitação das duas formas de entrada ou rejeição de CEP inválido.
- Evidência: [EVD-001 item 11](../evidencias/manual-fornecida.md). Captura disponível localmente pelo índice; JSON completo fornecido na conversa. O registro omite dados de cliente desnecessários.

## Observações de rede e isolamento

- **Duas chamadas ao aplicar cupom:** foram relatadas duas requisições de cálculo com corpos/respostas iguais após um clique. A [captura da lista de chamadas](../evidencias/manual/observacao-chamadas-calculo-cupom.png) complementa o relato, mas não determina sozinha o disparador de cada chamada. Registrar como possível oportunidade de otimização, sem defeito funcional ou impacto de desempenho demonstrado. Verificar iniciadores e sequência seria um próximo diagnóstico, não realizado aqui.
- **Uma chamada a cada adição de produto:** comportamento relatado, compatível com a API ser responsável pelos cálculos. A quantidade de chamadas depende das ações de alteração do carrinho, não apenas do número de produtos disponíveis no catálogo. Mais chamadas podem consumir recursos, mas não medimos lentidão, custo ou concorrência; não afirmar problema de escala ou severidade. Avaliar otimização somente com dados e preservando a atualização correta dos valores. Carga e estresse estão fora do escopo.
- **Nova aba com carrinho vazio:** comportamento explicitamente esperado e já registrado em EXE-010. Não é melhoria necessária nem bug. Manter carrinho na mesma aba ao atualizar/navegar é compatível com essa regra.

## Pendências de cobertura

- CT-006: normalização ainda não confirmada; CT-007: NAOEXISTE não confirmado.
- CT-012/CT-014: verificações diretas de API estão nos registros automatizados.
- CT-016/CT-017: validações negativas de cliente e duas formas de CEP não confirmadas.
- CT-018–CT-020: cobertura direta de API detalhada na rastreabilidade.
- CT-005: resultados disponíveis nos registros de investigação e automação.
- Demais linhas/camadas não documentadas permanecem não executadas, sem aprovação presumida.

Diferenças entre os dados da exploração e os cenários especificados posteriormente estão identificadas como variações.
