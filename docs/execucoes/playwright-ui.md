# Automação de interface — CT-001, CT-002 e CT-005

Responsável: Codex. Modalidade: automação Playwright de UI. Ambiente: URL padrão da Verzel Store, Chromium 156.0.8078.4, Playwright 1.64.1, Node 20.19.5, macOS arm64. Versão documentada 2.3.0; implantada não verificada. Horários UTC nos JSONs; interface configurada com fuso America/Sao_Paulo.

Implementação: [coupon-shipping.spec.ts](../../tests/coupon-shipping.spec.ts). Seleção por risco financeiro: regra básica de desconto/frete (CT-001), fronteira inclusiva (CT-002) e base do frete anterior ao desconto (CT-005). Cada teste usa novo contexto, prepara tudo pela UI e não cria pedido. Preços conferidos nos cards; esperado fixado pelos dados documentais D01/D02/D06, sem usar resposta da API como oráculo.

| Execução individual | Cenário | Preparação e ações | Assertions e resultado |
| --- | --- | --- | --- |
| EXE-018 | CT-001, D01 | Uma mochila, abrir carrinho, aplicar BEMVINDO10 | Subtotal 100, desconto 10, frete 19,90, total 109,90, faltante 100. **Aprovado** |
| EXE-019 | CT-002, D02 | Uma mochila, aumentar para duas, aplicar BEMVINDO10 | Subtotal 200 e desconto 20 corretos. Frete esperado grátis, observado 19,90; total esperado 180, observado 199,90. **Reprovado**, BUG-001 |
| EXE-020 | CT-005, D06 | Mochila + garrafa + camiseta, uma unidade de cada, aplicar cupom | Subtotal 209,90, desconto 20,99, frete grátis, total 188,91. **Aprovado** |

## Evidências — EVD-007

- [Execuções individuais](../evidencias/ui/execucoes-individuais.json): comandos, início UTC, duração, status, erros e caminhos dos artefatos. As execuções ocorreram uma a uma durante a implementação; diferenças de linha no stack trace refletem a inserção posterior de outro teste, não alteração do esperado.
- CT-001: [captura](../evidencias/ui/ct-001-1.png).
- CT-002: [requisição/resposta observada](../evidencias/ui/ct-002-1.json), [resumo](../evidencias/ui/ct-002-2.png), [screenshot automático de falha](../evidencias/ui/ct-002-3.png), [vídeo](../evidencias/ui/ct-002-4.webm), [contexto do erro](../evidencias/ui/ct-002-5.txt) e [trace](../evidencias/ui/ct-002-6.zip).
- CT-005: [captura](../evidencias/ui/ct-005-1.png).
- [Execução conjunta posterior](../evidencias/ui/execucao-conjunta.json): três testes com um worker, dois aprovados e um reprovado; saída 1, nenhum retry ou caso ignorado. É nova tentativa dos mesmos três cenários, não três cenários adicionais.

Abrir o trace preservado: `npx playwright show-trace docs/evidencias/ui/ct-002-6.zip`. O relatório HTML da execução conjunta está disponível localmente por `npm run report`; relatórios temporários são ignorados pelo Git. Os artefatos acima foram copiados para preservação antes de novas execuções.

## Investigação e limites

CT-002 chegou ao estado correto de produtos/cupom. A resposta anexada já apresenta frete 19,9 e total 199,9; a UI mostra os mesmos valores. Reproduz o BUG-001, sem indício de falha de seletor ou preparação. `expect.soft` permite registrar as duas divergências e mantém o teste reprovado. O controle CT-005 passou abaixo de R$ 200 após desconto, reforçando a delimitação já registrada, sem determinar causa interna.

Foram inspecionados somente DOM renderizado e árvore acessível. `getByRole('article', { name: ... })` limita o botão ao produto; rótulo do textbox identifica o cupom; região “Resumo do pedido” e atributos observados `data-valor` distinguem subtotal/desconto/frete/total. Ações e assertions aguardam condições, sem espera fixa. A resposta de rede capturada no CT-002 é evidência complementar, não substitui as assertions da tela.

Checagem de tipos aprovada. O teste local INFRA-001 não foi reexecutado nesta etapa e não entra na contagem de três cenários de negócio. Não foram automatizados checkout, negativas, normalização, todos os limites ou todas as combinações; não alegar cobertura integral dos critérios.
