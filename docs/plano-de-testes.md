# Plano de testes

## Fontes e estado

| Fonte | Referência e finalidade |
| --- | --- |
| PDF “Teste técnico: QA Júnior na Verzel”, 5 páginas | Entregáveis, regras e envio |
| Texto “Cupom de desconto e frete grátis” | Card VZS-142, versão 2.3.0, publicado em 30/09/2026, status “Pronto para teste”; regras, API e simplificações |
| Capturas e respostas JSON da conversa | Observações preliminares de execução manual; não substituem relatório formal |

As fontes são resumidas, sem republicar os anexos. URLs no [README](../README.md). **2.3.0 é a versão documental; a versão implantada ainda não foi verificada.** Na execução formal, registrar URL, data/hora com fuso, navegador/versão e eventual identificador exposto pela aplicação. Se não existir identificador acessível, registrar “não exposto”, sem inferir versão pelo visual.

O planejamento foi elaborado antes da execução direcionada do agente. O estado atual e os registros por modalidade estão na seção de resultados; a versão implantada continua não verificada.

## Objetivo e escopo

Verificar CA01–CA11: aplicação/normalização/rejeição/remoção de cupom, frete, valores monetários e limite de quantidade. Comparar o esperado com a interface (UI, a tela do cliente), a API (operações que recebem dados e devolvem respostas) e a confirmação do pedido.

Incluir recálculo após mudanças, contratos de API e regressão de nome/e-mail/CEP e confirmação. Regressão significa conferir que funcionalidades anteriores continuam funcionando. Detalhes em [requisitos](requisitos.md) e [API e checkout](api-e-checkout.md).

## Riscos e abordagem

Prioridade orienta a ordem da execução; não determina a severidade de um possível bug. A classificação é qualitativa, baseada no impacto das regras, sem histórico de falhas.

| Prioridade | Risco | Como reduzir a incerteza |
| --- | --- | --- |
| P1 | Total incorreto por desconto ou frete | Calcular esperado independentemente; comparar UI, cálculo e pedido |
| P1 | Frete incorreto na fronteira ou após desconto | Valores abaixo, exatamente em e acima de R$ 200; cupom reduzindo valor abaixo do limite |
| P1 | Cupom indevido ou válido rejeitado | Válido/inexistente/expirado, caixa e espaços externos, aplicar/remover |
| P1 | Mais de cinco unidades por produto | 1, 5 e 6 na API; bloqueios no carrinho e vitrine; vários produtos |
| P2 | Valores/mensagens inconsistentes após alteração | Mudar itens e cupom; verificar centavos, total e faltante |
| P2 | Checkout e contratos de erro incorretos | Fluxo válido e entradas inequivocamente inválidas, uma condição por vez |

Técnicas: agrupar entradas semelhantes, testar limites e transições de estado e combinar cupom com frete. Calcular o esperado pelas regras e preços de referência, nunca copiar a resposta da aplicação como verdade. Conferir catálogo antes da execução, preparar carrinhos isolados e usar dados fictícios e baixa concorrência.

Planejado: cenários em Gherkin (contexto, ação, esperado), Playwright com TypeScript e pelo menos três cenários de UI, complementados por API. O PDF exige três cenários Playwright, sem exigir que sejam todos de UI; essa é nossa escolha de cobertura. Skill é adicional, não uma dependência para o avaliador rodar a automação.

## Exclusões e simplificações

Fora do escopo: carga, estresse, segurança, login, cadastro de clientes, pagamento online e consulta de pedidos. Não há deploy a entregar.

Não são bugs: outra aba/navegador/janela anônima começar vazia; pedidos não persistidos; número fictício; ausência de consulta de pedidos, e-mail, cobrança e estoque; catálogo e cupons fixos; API sem estado entre chamadas. Preservar carrinho ao atualizar/navegar na mesma aba é compatível com a regra, sem comprovar uma tecnologia específica de armazenamento.

## Entregáveis

| Entrega | Estado atual / conclusão esperada |
| --- | --- |
| Cenários a partir dos requisitos | CT-001–CT-020 especificados em Gherkin, com dados, esperado e rastreabilidade |
| Execução manual e exploratória | Resultados fornecidos registrados; completar os cenários/camadas pendentes |
| Relatos de todos os bugs encontrados | BUG-001 e BUG-002 reproduzidos e documentados; atualizar conforme novas descobertas |
| Documento de evidências | Índice com capturas e JSONs locais; lacunas específicas identificadas |
| Pelo menos 3 cenários Playwright | CT-001, CT-002 e CT-005 implementados/executados na UI; dois aprovados e CT-002 reprovado por BUG-001; cobertura restante pendente |
| README | Navegação, instalação, execução e consulta dos relatórios documentadas e verificadas; limitações explícitas |
| Repositório único público | Publicação/visibilidade a conferir ao final |
| Declaração de IA | Registrada no README; envio pelo formulário não realizado |
| Skill, adicional | Criada em [.agents/skills/verzel-qa](../.agents/skills/verzel-qa/SKILL.md); estrutura validada e uso na execução/consolidação da suíte normal registrado |

O PDF permite IA e exige informar onde/como foi usada. O prazo informado é de cinco dias corridos após o recebimento. Envio pelo formulário indicado no PDF; não faz parte desta etapa.

## Resultados e evidências

As observações foram registradas em [execuções manuais](execucoes/manual.md). A reprodução direcionada via API está em [investigação por agente](execucoes/agente-api.md). Consulte o [índice de evidências](evidencias/README.md), a [rastreabilidade](rastreabilidade.md) e o [BUG-001](bugs/BUG-001.md) para resultados e limitações. Esses registros são as fontes dos resultados; não os duplicar neste plano.

## Entrada e conclusão

Antes de executar formalmente: cenários e esperados definidos, ambiguidades registradas, ambiente/ferramentas acessíveis, dados conferidos e coleta de evidências preparada.

Para concluir:

- Relacionar **requisito → cenário → execução → evidência → eventual bug**, com IDs estáveis. Isso permite rastrear por que e como cada regra foi verificada.
- Registrar responsável, modalidade (manual humana, exploração por agente ou automação), ambiente, data/hora/fuso, dados, esperado, observado e resultado.
- Classificar cada caso como não executado, aprovado, reprovado ou bloqueado. Preservar reexecuções e justificar lacunas/riscos; pendência P1 impede alegar cobertura completa.
- Documentar todos os defeitos confirmados e separar dúvidas, problemas de ferramenta e falhas da aplicação.
- Implementar/executar pelo menos três cenários Playwright; não mudar expectativas para esconder bugs.
- Revisar links, evidências, comandos, instalação e declaração de IA. A entrega pode estar completa com defeitos da loja documentados; não exige relatório artificialmente verde.
