# Requisitos e ambiguidades

Referência: VZS-142, **versão documentada 2.3.0**; versão implantada não verificada. Esta matriz é planejamento, não uma lista de requisitos aprovados. Observações manuais preliminares estão no [plano](plano-de-testes.md); IDs de cenários/execuções/evidências serão associados posteriormente.

## Matriz CA01–CA11

| ID | Regra | Verificação planejada | Camada | Prioridade |
| --- | --- | --- | --- | --- |
| CA01 | BEMVINDO10 desconta 10% do subtotal | Desconto e total calculados independentemente | UI, cálculo, pedido | P1 |
| CA02 | Ignorar caixa e espaços externos | Mesmo benefício com minúsculas, caixa mista e espaços nas extremidades | UI, cálculo, pedido | P1 |
| CA03 | Inexistente: “Cupom inválido.” e desconto zero | Mensagem; 200 no cálculo e 422 no pedido conforme contrato | UI, cálculo, pedido | P1 |
| CA04 | Expirado: “Cupom expirado.” e desconto zero | Rejeitar benefício de `VERAO2026`; distinguir validade de existência | UI, cálculo, pedido | P1 |
| CA05 | Um cupom; remover antes de trocar | Sem acúmulo/troca direta; remover e reaplicar, recalculando | UI; API recebe um campo cupom | P1 |
| CA06 | Frete grátis para subtotal ≥ R$ 200 | Abaixo, exatamente no limite e acima; conferir frete e indicador | UI, cálculo, pedido | P1 |
| CA07 | Abaixo do limite, frete R$ 19,90 e informar faltante | Comparar frete e `max(200 − subtotal, 0)`; informação no carrinho | UI, cálculo, pedido | P1 |
| CA08 | Frete usa subtotal antes do desconto | Carrinho elegível permanece com frete grátis se cupom reduzir valor abaixo de R$ 200 | UI, cálculo, pedido | P1 |
| CA09 | Desconto não incide sobre frete | Subtotal R$ 100: desconto R$ 10, frete R$ 19,90, total R$ 109,90 | UI, cálculo, pedido | P1 |
| CA10 | Até cinco unidades de cada produto, UI e API | Aceitar 1/5, impedir ou rejeitar 6; soma de vários produtos pode ultrapassar cinco | UI, cálculo, pedido | P1 |
| CA11 | Valores arredondados a duas casas | Coerência em centavos e exibição; números JSON não exigem zeros finais | UI, cálculo, pedido | P2 |

## Cálculos e dados

- `subtotal = soma(preço unitário × quantidade)`.
- `desconto = subtotal × percentual do cupom válido`, arredondado a duas casas; zero sem válido.
- `frete = 0` para subtotal ≥ 200; abaixo, 19,90 em carrinho não vazio.
- `faltante = max(200 − subtotal, 0)`.
- `total = subtotal − desconto + frete`.

Usar centavos inteiros no esperado independente para evitar artefatos numéricos. Não inferir o comportamento da tela vazia pela fórmula: a API documenta rejeição de lista vazia.

| ID | Produto | Preço |
| --- | --- | --- |
| P001 | Camiseta Essencial | R$ 59,90 |
| P002 | Calça Jeans Slim | R$ 139,90 |
| P003 | Tênis Casual Urbano | R$ 189,90 |
| P004 | Boné Aba Curva | R$ 49,90 |
| P005 | Mochila Urbana 20L | R$ 100,00 |
| P006 | Kit 3 Pares de Meias | R$ 29,90 |
| P007 | Jaqueta Corta-Vento | R$ 229,90 |
| P008 | Garrafa Térmica 750ml | R$ 50,00 |

Cupons de referência: `BEMVINDO10`, válido, 10%; `VERAO2026`, 15%, expirado em 31/03/2026, portanto sem benefício esperado. Para testes futuros, usar cliente fictício: Maria Silva, `maria@example.com`, CEP `01310-100`.

Exemplos de esperado em reais, não resultados de nova execução:

| Itens | Cupom | Subtotal | Desconto | Frete | Total |
| --- | --- | --- | --- | --- | --- |
| P005 × 1 | BEMVINDO10 | 100,00 | 10,00 | 19,90 | 109,90 |
| P002 × 1 + P001 × 1 | Ausente | 199,80 | 0,00 | 19,90 | 219,70 |
| P005 × 2 | Ausente | 200,00 | 0,00 | 0,00 | 200,00 |
| P005 × 2 | BEMVINDO10 | 200,00 | 20,00 | 0,00 | 180,00 |
| P002 × 1 + P004 × 2 | BEMVINDO10 | 239,70 | 23,97 | 0,00 | 215,73 |

## Ambiguidades e limitações

Decisões de trabalho abaixo não são requisitos adicionais. Revisar e registrar mudanças se houver esclarecimento.

| ID | Questão | Interpretação / limite |
| --- | --- | --- |
| AMB01 | Vitrine menciona primeira compra, mas não há identificação de histórico descrita | Aplicar CA01 sem inventar restrição por cliente anterior; pedidos não persistem e login está fora do escopo |
| AMB02 | Desempate de meio centavo não especificado | Não impor um método. Preços múltiplos de R$ 0,10 e cupom válido de 10% produzem centavos exatos para quantidades inteiras, limitando essa cobertura |
| AMB03 | R$ 199,99/R$ 200,01 inalcançáveis com preços fixos | Usar combinações alcançáveis abaixo/em/acima do limite; não enviar preços arbitrários |
| AMB04 | Somente um cupom válido | Cobrir remoção/reaplicação e rejeições; não alegar troca testada entre dois válidos |
| AMB05 | Cupom vazio, null, outros tipos ou espaços internos sem regra explícita | Omitir cupom é suportado; demais entradas ficam como exploração, sem código de erro inventado |
| AMB06 | Esquema detalhado e precedência dos erros incompletos | Não exigir `campo` em todo erro nem estrutura não definida de `campos`; uma condição inválida por caso |
| AMB07 | Formatos de nome/e-mail não detalhados | Usar casos inequívocos; não impor restrições culturais ou exigir entrega de e-mail |
| AMB08 | Tela vazia e mensagens após alterações sem especificação completa | Verificar coerência sem inventar obrigação de frete em tela vazia; API deve rejeitar itens vazios |
| AMB09 | Exemplo retorna CEP sem hífen | Entrada com/sem hífen é obrigatória; não confundir detalhe de exemplo com regra explícita de saída |
