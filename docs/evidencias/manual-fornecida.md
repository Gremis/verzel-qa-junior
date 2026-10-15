# EVD-001 — Evidências manuais

Capturas de execução manual, comparadas visualmente com os relatos e organizadas sem alterar pixels. Resultados e interpretação ficam no [registro manual](../execucoes/manual.md); esta página identifica somente os artefatos. Os nomes usam execução e conteúdo, não uma conclusão de aprovação.

| Item | Execução | Artefatos disponíveis |
| --- | --- | --- |
| 1 | EXE-001 | [Mochila com cupom válido](manual/exe-001-mochila-cupom-valido.png); JSON e status 200 também informados na conversa |
| 2 | EXE-002 / EXE-005 | [Duas mochilas com cupom, UI e resposta](manual/exe-002-frete-limite-com-cupom.png) |
| 3 | EXE-003 / EXE-005 | [Duas mochilas sem cupom, UI e resposta](manual/exe-003-frete-limite-sem-cupom.png) |
| 4 | EXE-004 | Cupom expirado: [interface](manual/exe-004-cupom-expirado-interface.png), [requisição](manual/exe-004-cupom-expirado-requisicao.png) e [resposta](manual/exe-004-cupom-expirado-resposta.png) |
| 5 | EXE-006 | [Cinco camisetas com cupom, UI e resposta](manual/exe-006-cinco-camisetas-com-cupom.png) |
| 6 | EXE-007 | Limite de quantidade: [carrinho](manual/exe-007-limite-carrinho.png) e [vitrine](manual/exe-007-limite-vitrine.png); estado com cupom também visível no item 5 |
| 7 | EXE-008 | Três produtos com cinco unidades: [sem cupom](manual/exe-008-varios-produtos-sem-cupom.png) e [com cupom](manual/exe-008-varios-produtos-com-cupom.png). Confirmação VZ-328716 e status 201 foram fornecidos na conversa, mas a imagem dessa confirmação não está entre os arquivos adicionados |
| 8 | EXE-009 | [Camiseta e calça com cupom ativo](manual/exe-009-cupom-ativo-camisa-calca.png). Confirmação VZ-830093 fornecida na conversa; imagem dessa confirmação não adicionada |
| 9 | EXE-010 | Relato textual de navegação/atualização/nova aba e ausência de e-mail; sem captura específica |
| 10 | EXE-016 | [Confirmação com cupom VZ-020370 e Preview](manual/exe-016-pedido-confirmado-com-cupom.png), cliente declarado fictício |
| 11 | EXE-017 | [Confirmação sem cupom VZ-137193 e Preview](manual/exe-017-pedido-confirmado-sem-cupom.png), JSON também fornecido na conversa |
| 12 | Observação de rede | [Lista de chamadas de cálculo ao aplicar cupom](manual/observacao-chamadas-calculo-cupom.png); captura isolada não prova qual ação disparou cada chamada ou igualdade dos corpos |

## Comparação e duplicidade

Recebidos 16 PNGs na raiz; mantidos 15 arquivos únicos em `manual/`. `botao_desabilitado.png` e `cupom_com_cinco.png` eram idênticos byte a byte: ambos foram consolidados em `exe-006-cinco-camisetas-com-cupom.png`, reutilizado onde pertinente. Estados semelhantes, como antes/depois de cupom e detalhes de requisição/resposta, foram preservados por apresentarem informações diferentes.

Não há novas execuções nesta organização. Horários de captura e versão exata do Brave não foram informados. Imagens anteriores com dados pessoais não integram este conjunto de publicação. As confirmações locais utilizam dados de teste declarados fictícios/temporários. As limitações específicas de cada resultado estão no registro manual.
