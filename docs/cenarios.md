# Cenários e resultados esperados

Referências: PDF do teste e [requisitos VZS-142, versão documentada 2.3.0](requisitos.md), [API e checkout](api-e-checkout.md) e [plano](plano-de-testes.md). Versão implantada não verificada.

**Estado:** cenários especificados; resultados parciais/adaptados vinculados na [rastreabilidade](rastreabilidade.md). Consulte os registros por modalidade para saber quais linhas/camadas foram executadas; não presumir aprovação integral. Gherkin abaixo é especificação, não código de automação implementado.

## Preparação e modalidades

UI: aba/contexto isolado, carrinho inicialmente vazio, catálogo de referência conferido. API: JSON e Content-Type application/json; enviar todos os dados a cada chamada. Cálculo significa POST `/api/carrinho/calcular`; pedido significa POST `/api/pedidos`. Para pedido, usar Maria Silva, `maria@example.com`, CEP `01310-100`, salvo variação explícita.

Na tabela de [rastreabilidade](rastreabilidade.md), UI está planejada para execução manual humana e seleção posterior para Playwright; API, para automação Playwright. Cada combinação de camada e linha de exemplos deve receber seu próprio resultado de execução, sem confundir tentativas com cenários distintos.

## Contas de referência

Valores em reais, calculados antes da execução. `Total = subtotal − desconto + frete`. Faltante usa o subtotal anterior ao desconto.

| Dado | Itens | Cupom | Subtotal | Desconto | Frete | Faltante | Total |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D01 | P005 × 1 | BEMVINDO10 | 100,00 | 10,00 | 19,90 | 100,00 | 109,90 |
| D02 | P005 × 2 | BEMVINDO10 | 200,00 | 20,00 | 0,00 | 0,00 | 180,00 |
| D03 | P002 × 1 + P001 × 1 | Omitido | 199,80 | 0,00 | 19,90 | 0,20 | 219,70 |
| D04 | P005 × 2 | Omitido | 200,00 | 0,00 | 0,00 | 0,00 | 200,00 |
| D05 | P007 × 1 | Omitido | 229,90 | 0,00 | 0,00 | 0,00 | 229,90 |
| D06 | P005 × 1 + P008 × 1 + P001 × 1 | BEMVINDO10 | 209,90 | 20,99 | 0,00 | 0,00 | 188,91 |
| D07 | P001 × 5 | BEMVINDO10 | 299,50 | 29,95 | 0,00 | 0,00 | 269,55 |

Contas centrais:

- Uma mochila: `100,00 − (100,00 × 10%) + 19,90 = 109,90`.
- Duas mochilas: `200,00 − (200,00 × 10%) + 0,00 = 180,00`. O subtotal de 200 mantém o frete grátis.
- Calça e camiseta: `139,90 + 59,90 = 199,80`; `199,80 + 19,90 = 219,70`.
- D06 isola a interação do cupom com frete acima da fronteira: subtotal 209,90, valor descontado 188,91, frete ainda zero. Evita depender exclusivamente do caso já observado de exatamente 200.

## Cupom, frete e valores

```gherkin
# language: pt
Funcionalidade: Calcular cupom e frete conforme os critérios de aceite

  Cenário: CT-001 Aplicar desconto sem descontar o frete
    Dado o carrinho D01 antes de aplicar o cupom
    Quando aplicar BEMVINDO10 e consultar o resumo
    Então os valores devem corresponder a D01
    E o cupom deve estar aplicado

  Cenário: CT-002 Manter frete grátis no limite com cupom
    Dado o carrinho D02
    Quando consultar seu resumo com BEMVINDO10
    Então os valores devem corresponder a D02
    E freteGratis deve ser verdadeiro na API

  Cenário: CT-003 Cobrar frete abaixo do limite
    Dado o carrinho D03 sem cupom
    Quando consultar seu resumo
    Então os valores devem corresponder a D03
    E a interface deve informar que faltam R$ 0,20 para frete grátis

  Esquema do Cenário: CT-004 Conceder frete no limite e acima sem cupom
    Dado o carrinho <dado>
    Quando consultar seu resumo sem cupom
    Então os valores devem corresponder a <dado>
    E freteGratis deve ser verdadeiro na API
    Exemplos:
      | dado |
      | D04  |
      | D05  |

  Cenário: CT-005 Considerar o subtotal anterior ao desconto
    Dado o carrinho D06
    Quando aplicar BEMVINDO10 e consultar o resumo
    Então os valores devem corresponder a D06
    E o frete deve permanecer grátis apesar do valor descontado de R$ 188,91

  Esquema do Cenário: CT-006 Normalizar o código do cupom
    Dado uma mochila P005 de R$ 100,00 sem cupom
    Quando aplicar o código <codigo> preservando os espaços entre aspas
    Então o cupom deve ser aplicado
    E os valores devem corresponder a D01
    Exemplos:
      | codigo           |
      | "bemvindo10"     |
      | "BeMvInDo10"     |
      | "  BEMVINDO10  " |
      | "  bemvindo10  " |

  Esquema do Cenário: CT-007 Rejeitar cupom no cálculo sem desconto
    Dado uma mochila P005 de R$ 100,00 sem cupom
    Quando tentar aplicar <codigo>
    Então a mensagem deve ser <mensagem>
    E o desconto deve ser zero e o total R$ 119,90
    E a resposta do cálculo deve ser 200 com cupom.aplicado falso
    Exemplos:
      | codigo    | mensagem           |
      | NAOEXISTE | "Cupom inválido."  |
      | VERAO2026 | "Cupom expirado."  |

  Cenário: CT-008 Remover e reaplicar sem acumular cupons
    Dado D01 com BEMVINDO10 aplicado
    Quando observar as opções de cupom
    Então não deve ser possível aplicar outro cupom sem remover o atual
    Quando remover o cupom
    Então o desconto deve ser zero e o total R$ 119,90
    Quando aplicar BEMVINDO10 novamente
    Então os valores devem corresponder a D01, sem desconto acumulado

  Cenário: CT-009 Recalcular ao alterar e remover itens
    Dado D01 com cupom aplicado
    Quando aumentar a mochila para duas unidades
    Então os valores devem corresponder a D02
    Quando reduzir para uma unidade
    Então os valores devem corresponder a D01
    Quando remover o último produto
    Então a interface deve apresentar carrinho vazio sem total de compra anterior ativo

  Cenário: CT-010 Preservar precisão monetária
    Dado o carrinho D07
    Quando aplicar BEMVINDO10 e consultar o resumo
    Então os valores devem corresponder a D07
    E a UI deve apresentar os valores monetários com duas casas decimais
    E a API deve retornar valores numericamente equivalentes, sem exigir zeros finais
```

CT-009 verifica coerência do estado vazio, sem exigir texto exato ou uma requisição de cálculo com itens vazios. CT-010 verifica precisão alcançável, não desempate de meio centavo.

## Quantidade e pedidos

```gherkin
# language: pt
Funcionalidade: Respeitar quantidade e validar a confirmação

  Cenário: CT-011 Impedir sexta unidade na interface
    Dado uma camiseta P001 no carrinho
    Quando aumentar a quantidade até cinco
    Então cinco unidades devem ser aceitas com subtotal R$ 299,50
    E o carrinho não deve permitir adicionar a sexta unidade
    Quando voltar à vitrine
    Então ela também não deve permitir adicionar a sexta camiseta

  Esquema do Cenário: CT-012 Validar limite por produto na API
    Dado os demais dados válidos e uma entrada P001 com quantidade <quantidade>
    Quando enviar ao cálculo e, em requisição independente, ao pedido
    Então os status devem ser <calculo> e <pedido>
    E o resultado deve ser <resultado>
    Exemplos:
      | quantidade | calculo | pedido | resultado                                           |
      | 1          | 200     | 201    | subtotal 59,90, frete 19,90, total 79,80 sem cupom     |
      | 5          | 200     | 201    | subtotal 299,50, frete zero, total 299,50 sem cupom   |
      | 6          | 422     | 422    | erro QUANTIDADE_MAXIMA_EXCEDIDA                     |

  Cenário: CT-013 Aceitar mais de cinco unidades somando produtos distintos
    Dado P001 com cinco unidades e P004 com cinco unidades sem cupom
    Quando calcular e confirmar o pedido com cliente válido
    Então os status devem ser 200 e 201
    E subtotal e total devem ser R$ 549,00 com frete zero

  Esquema do Cenário: CT-014 Rejeitar cupom inválido na confirmação
    Dado cliente válido e uma mochila P005
    Quando enviar o pedido diretamente com <cupom>
    Então a resposta deve ser 422 com erro <codigo>
    Exemplos:
      | cupom     | codigo          |
      | NAOEXISTE | CUPOM_INVALIDO  |
      | VERAO2026 | CUPOM_EXPIRADO  |

  Esquema do Cenário: CT-015 Confirmar compra válida com valores consistentes
    Dado cliente fictício válido e carrinho <dado>
    Quando calcular e depois confirmar o pedido com os mesmos dados
    Então os status devem ser 200 e 201
    E API e tela de confirmação devem corresponder aos valores de <dado>
    E os itens e quantidades devem corresponder ao enviado
    E o número deve ter prefixo VZ- seguido de seis dígitos
    E a resposta deve conter criadoEm e dados do cliente
    E o fluxo não deve exigir pagamento online
    Exemplos:
      | dado |
      | D01  |
      | D02  |
      | D03  |

  Esquema do Cenário: CT-016 Rejeitar dados de cliente inválidos
    Dado uma mochila sem cupom e cliente válido exceto por <campo> igual a <valor>
    Quando tentar confirmar pela UI e enviar separadamente esse dado à API
    Então a UI deve impedir a conclusão e indicar o problema
    E a API deve retornar 422 com DADOS_INVALIDOS e detalhes em campos
    Exemplos:
      | campo | valor            |
      | nome  | "Maria"          |
      | nome  | ""               |
      | email | "sem-arroba"     |
      | email | ""               |
      | cep   | "0131010"        |
      | cep   | "013101000"      |
      | cep   | "abcdefgh"       |

  Esquema do Cenário: CT-017 Aceitar CEP nas duas formas documentadas
    Dado cliente fictício válido com CEP <cep> e uma mochila sem cupom
    Quando confirmar a compra pela UI e em pedido independente pela API
    Então a confirmação deve ser permitida e a API deve retornar 201
    E o total deve ser R$ 119,90
    Exemplos:
      | cep       |
      | 01310100  |
      | 01310-100 |
```

## Catálogo e negativas da API

```gherkin
# language: pt
Funcionalidade: Cumprir contratos funcionais da API

  Cenário: CT-018 Consultar catálogo e produto
    Quando consultar GET /api/produtos e GET /api/produtos/P001
    Então ambos devem responder 200
    E a lista deve corresponder aos oito produtos de referência
    E P001 deve ter os campos documentados e preço numérico equivalente a 59,90

  Esquema do Cenário: CT-019 Rejeitar itens inválidos
    Dado uma requisição com <variacao> e demais dados válidos
    Quando enviar ao cálculo e ao pedido em chamadas independentes
    Então cada resposta deve ser 422 com erro <codigo>
    Exemplos:
      | variacao                                  | codigo                       |
      | campo itens omitido                       | ITENS_OBRIGATORIOS           |
      | itens igual a []                           | ITENS_OBRIGATORIOS           |
      | itens igual a [null]                       | ITEM_INVALIDO                |
      | item objeto sem produtoId                 | ITEM_INVALIDO                |
      | item objeto sem quantidade                | ITEM_INVALIDO                |
      | produtoId INEXISTENTE com quantidade 1     | PRODUTO_NAO_ENCONTRADO        |
      | duas entradas P001, cada uma quantidade 1  | ITEM_DUPLICADO               |
      | P001 com quantidade 0                     | QUANTIDADE_INVALIDA          |
      | P001 com quantidade -1                    | QUANTIDADE_INVALIDA          |
      | P001 com quantidade 1.5                   | QUANTIDADE_INVALIDA          |

  Esquema do Cenário: CT-020 Responder erros de formato, rota e método
    Quando realizar <requisicao>
    Então a resposta deve ser <status> com erro <codigo>
    Exemplos:
      | requisicao                                              | status | codigo                   |
      | POST /api/carrinho/calcular com corpo JSON malformado {   | 400    | JSON_INVALIDO            |
      | POST /api/carrinho/calcular com corpo JSON []             | 400    | JSON_INVALIDO            |
      | GET /api/rota-inexistente                                | 404    | ROTA_NAO_ENCONTRADA       |
      | GET /api/produtos/INEXISTENTE                             | 404    | PRODUTO_NAO_ENCONTRADO    |
      | DELETE /api/produtos                                     | 405    | METODO_NAO_PERMITIDO      |
```

Nas negativas, conferir objeto `erro`, código e mensagem pertinente. Não presumir texto exato não documentado, presença universal de `campo` ou precedência entre erros. As chamadas de cálculo e pedido são resultados separados.

## Limitações e evidências futuras

Preços fixos não permitem qualquer subtotal: não fabricar R$ 199,99/R$ 200,01. Só há um cupom válido; CT-008 não prova troca entre dois cupons válidos. Os exemplos de normalização preservam espaços externos, sem assumir remoção de espaços internos. CA11 fica limitado à precisão alcançável com dados fixos; regras de meio centavo não estão especificadas.

Evidência UI: preparação, estado final e mensagens/valores relevantes. API: método, endpoint, corpo, status e resposta. Execução futura deve registrar modalidade, responsável, ambiente, data/hora/fuso, ID do cenário e linha de dados, esperado/observado e links. Usar dados fictícios; não publicar dados pessoais das capturas anteriores.
