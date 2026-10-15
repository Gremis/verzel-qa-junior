# Testes Playwright de API

Responsável: Codex; modalidade automação Playwright. Implementação: [cart-api.spec.ts](../../tests/cart-api.spec.ts). Referência VZS-142 documental 2.3.0; versão implantada não verificada.

**Resultado: 16 testes parametrizados, 13 aprovados e 3 reprovados; 21 chamadas sequenciais, um worker, zero retries.** Não são 16 cenários distintos: são linhas e combinações de contratos de cenários existentes. Uma reprodução posterior de quantidade 6 no cálculo adicionou uma chamada curl, separada da suíte. Dois pedidos válidos fictícios planejados foram confirmados; o pedido com seis unidades, que deveria ser rejeitado, também foi confirmado indevidamente. Sem cobrança real.

Comando executado: `npx playwright test tests/cart-api.spec.ts`, saída 1. Checagem `npm run typecheck` aprovada. Não reexecutados UI/INFRA nesta etapa. [EVD-008](../evidencias/playwright-api/execucao.json) contém versão da ferramenta/Node, horários UTC, duração, seleção, status e cada requisição/resposta; IDs abaixo são estáveis dentro dessa execução. Testes usam fixture request isolada e enviam todos os dados, sem depender de carrinho ou número de pedido anteriores. Cabeçalho JSON explícito; esperado vem de valores de referência, não da resposta.

| Execução | Cenário / dado | Resultado e fundamento |
| --- | --- | --- |
| API-EXE-001 | CT-001/D01 | Aprovado: 100 − 10 + 19,90 = 109,90 |
| API-EXE-002 | CT-002/D02 | Reprovado, BUG-001: esperado 180 com frete zero; retornou 199,90 e frete 19,90 |
| API-EXE-003 | CT-003/D03 | Aprovado: total 219,70, faltante 0,20 |
| API-EXE-004 | CT-004/D04 | Reprovado, BUG-001: esperado 200 com frete zero; retornou 219,90 |
| API-EXE-005 | CT-005/D06 | Aprovado: subtotal 209,90, desconto 20,99, frete zero, total 188,91 |
| API-EXE-006/007 | CT-006, minúsculas / caixa mista com espaços | Aprovados no cálculo, benefício D01; variação combinada adicional, não cobertura de todas as linhas ou pedido |
| API-EXE-008/009 | CT-007 e CT-014, inexistente / expirado | Aprovados: cálculo 200, mensagem pertinente e desconto zero; pedido 422 com CUPOM_INVALIDO / CUPOM_EXPIRADO |
| API-EXE-010/011 | CT-012, quantidades 1/5 | Aprovados no cálculo (200) e pedido (201), com valores documentais e número no formato esperado |
| API-EXE-012 | CT-012, quantidade 6 | Reprovado nos dois endpoints: aceitou em cálculo 200 e pedido 201; BUG-002 |
| API-EXE-013/014/015 | CT-019, lista vazia / duplicado / fracionário | Aprovados no cálculo: 422 e códigos ITENS_OBRIGATORIOS / ITEM_DUPLICADO / QUANTIDADE_INVALIDA |
| API-EXE-016 | CT-016, nome único | Aprovado na API de pedido: 422, DADOS_INVALIDOS com detalhes em campos |

## Investigação

As duas falhas de frete são manifestações do mesmo BUG-001, não dois bugs novos. A terceira falha revelou [BUG-002](../bugs/BUG-002.md). Ausência de `erro` na resposta de seis unidades também aparece como assertion reprovada porque a API confirmou em vez de rejeitar; não é motivo para enfraquecer o teste.

O cálculo com seis unidades foi reproduzido uma vez via curl: [artefato separado](../evidencias/playwright-api/reproducao-quantidade-6.json). Não houve indisponibilidade nesta execução. Trace da falha de quantidade preservado; screenshots/vídeos não são necessários para chamadas sem página de navegador.

## Cobertura restante

Não cobertos nesta etapa: catálogo/rotas/métodos/JSON malformado, todas as negativas de itens em ambos os endpoints, normalização no pedido, nome vazio, e-mail/CEP inválidos, duas formas de CEP e outros dados de fronteira. As três negativas CT-019 foram selecionadas no cálculo apenas. UI e API têm registros independentes; não concluir que aprovação de API equivale a UI validada.

Relatório HTML local: `npm run report`; execução focada: `npx playwright test tests/cart-api.spec.ts`. O relatório da UI anterior foi preservado temporariamente antes desta execução; suas evidências permanentes permanecem no índice. As falhas mantêm saída não zero e não foram ignoradas ou convertidas em sucesso.
