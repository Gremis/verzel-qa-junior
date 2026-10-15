# API e regressão de checkout

Resumo da documentação VZS-142, versão **documentada 2.3.0**. Versão implantada não verificada. Nenhuma nova chamada feita nesta etapa.

## Operações

Base: `https://verzel-store.qa-test-verzel-store.workers.dev/api`. A documentação orienta JSON e `Content-Type: application/json`. Valores são números em reais: `59.9` representa R$ 59,90.

| ID | Operação | Entrada | Resposta esperada |
| --- | --- | --- | --- |
| API01 | `GET /produtos` | Sem corpo | 200, lista com id, nome, descricao, categoria e preco |
| API02 | `GET /produtos/{id}` | ID do produto | 200 com produto; 404 para inexistente |
| API03 | `POST /carrinho/calcular` | `itens: [{produtoId, quantidade}]`, cupom opcional | 200 com itens calculados e resumo, sem persistência |
| API04 | `POST /pedidos` | Itens/cupom e `cliente: {nome, email, cep}` | 201, numero `VZ-` + seis dígitos, criadoEm, cliente, itens e resumo |

Resumo: `subtotal`, `desconto`, `frete`, `freteGratis`, `valorFaltanteFreteGratis`, `total`, `cupom`. Com cupom informado, o objeto exemplificado contém `codigo`, `aplicado`, `mensagem`. Itens exemplificados contêm `produtoId`, `nome`, `precoUnitario`, `quantidade`, `total`. O formato de cupom omitido não é totalmente definido; `null` apareceu nas capturas, sem se tornar requisito adicional.

Cada chamada é independente. Calcular não prepara um pedido persistido: reenviar itens/cupom na confirmação e conferir valores com esperado independente.

| Condição do cupom | Cálculo | Pedido com demais dados válidos |
| --- | --- | --- |
| Válido | 200, desconto conforme regra | 201, desconto conforme regra |
| Omitido | 200, sem desconto | 201, sem desconto |
| Inexistente | 200, desconto zero, “Cupom inválido.” em cupom.mensagem | 422, CUPOM_INVALIDO |
| Expirado | 200, desconto zero, “Cupom expirado.” em cupom.mensagem | 422, CUPOM_EXPIRADO |

**200 no cálculo não significa cupom aceito.** A operação calcula o carrinho e informa no conteúdo por que rejeitou o cupom.

## Erros documentados

Exemplo de estrutura: `{"erro":{"codigo":"QUANTIDADE_INVALIDA","mensagem":"A quantidade deve ser um número inteiro maior ou igual a 1.","campo":"itens[0].quantidade"}}`.

Não assumir que `campo` exista em todo erro. Para dados do cliente, a fonte menciona detalhes em `campos`, sem esquema completo.

| Status | Código | Condição |
| --- | --- | --- |
| 400 | JSON_INVALIDO | Corpo não é objeto JSON válido |
| 404 | ROTA_NAO_ENCONTRADA | Rota inexistente na API |
| 404 | PRODUTO_NAO_ENCONTRADO | Consulta de produto inexistente |
| 405 | METODO_NAO_PERMITIDO | Método não aceito em rota existente |
| 422 | ITENS_OBRIGATORIOS | Lista de itens ausente/vazia |
| 422 | ITEM_INVALIDO | Item não é objeto com produtoId e quantidade |
| 422 | PRODUTO_NAO_ENCONTRADO | Item referencia produto inexistente |
| 422 | ITEM_DUPLICADO | Mesmo produto repetido na lista |
| 422 | QUANTIDADE_INVALIDA | Quantidade não é inteiro ≥ 1 |
| 422 | QUANTIDADE_MAXIMA_EXCEDIDA | Quantidade de produto > 5 |
| 422 | DADOS_INVALIDOS | Cliente inválido no pedido |
| 422 | CUPOM_INVALIDO | Cupom inexistente no pedido |
| 422 | CUPOM_EXPIRADO | Cupom expirado no pedido |

Validar status, código e informações pertinentes. Nas negativas, variar uma condição por vez, sem presumir precedência de erros. Testes funcionais de contrato não incluem carga ou investigação de segurança.

## Regressão de checkout

Cobertura planejada das regras preexistentes. Uma confirmação válida não comprova as validações negativas.

| ID | Regra | Verificações planejadas |
| --- | --- | --- |
| REG01 | Nome e sobrenome | Nome completo fictício válido; nome único e ausência inválidos, na UI e pedido |
| REG02 | E-mail em formato válido | Endereço fictício válido; ausência e formato inequivocamente inválido, na UI e pedido |
| REG03 | CEP com 8 dígitos, com/sem hífen | Aceitar `01310100` e `01310-100`; rejeitar letras e comprimentos incorretos; não exigir endereço real |
| REG04 | Pagamento na entrega | Concluir sem pagamento online; não esperar e-mail ou cobrança |
| REG05 | Confirmação consistente | 201, número no formato e mesmos itens/quantidades/valores esperados na API e tela |

Não exigir armazenamento, consulta posterior ou unicidade global de números fictícios. Carrinho zerado após confirmar foi observado, mas não está definido como critério de aceite. Ocultar dados pessoais ou produzir evidências com dados fictícios antes de publicar.
