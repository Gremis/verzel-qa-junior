---
name: verzel-qa
description: Apoiar o teste QA da Verzel Store (VZS-142) neste repositório, da análise e especificação à execução Playwright, evidências, investigação e relatórios. Usar para essas etapas do teste, sem alterar a aplicação da loja.
---

# Verzel QA

## Etapa e fontes

Execute apenas a etapa solicitada, aproveitando artefatos existentes. Não transforme um pedido de planejamento em execução nem uma execução em publicação.

Localize a raiz do repositório e confira instruções locais e alterações no Git antes de editar. Os links abaixo são relativos a esta pasta; comandos de projeto devem ser executados na raiz:

- Leia o [plano de testes](../../../docs/plano-de-testes.md) para escopo, riscos, exclusões e critérios de conclusão.
- Para análise/especificação, consulte os [requisitos](../../../docs/requisitos.md), incluindo dados e ambiguidades.
- Para API, checkout ou comparação de respostas, consulte os [contratos](../../../docs/api-e-checkout.md).
- Para execução, confira o [README](../../../README.md), os cenários, package.json e configuração Playwright quando existirem. Não suponha que ferramentas ou comandos planejados já estejam implementados.

Use os documentos como referência de esperado e a execução como fonte do observado. Evidência anterior não equivale a uma nova execução. Versão documental não comprova versão implantada. Se uma fonte estiver ausente ou contraditória, registre a limitação/interpretação antes de concluir sobre a regra afetada.

## Analisar e especificar

- Relacione regras CA, contratos API e regressões REG aos cenários. Preserve IDs existentes; para novos casos use `CT-001` em diante, sem renumerar casos publicados.
- Defina prioridade, camada, modalidade planejada, preparação, dados, ações e esperado verificável. Use Gherkin em português quando estiver especificando cenários.
- Priorize riscos financeiros, limites alcançáveis e mudanças de estado. Calcule valores independentemente com preços de referência, preferindo centavos inteiros. Não use a resposta da aplicação para definir o esperado.
- Registre lacunas de dados e ambiguidades; não fabrique preços, outro cupom válido ou modo de arredondamento. Não trate mensagem de marketing ambígua como regra nova sem indicar a interpretação.

## Executar e acompanhar

Classifique a atividade de acordo com quem realmente a realizou:

| Modalidade | Condição para registrar resultado |
| --- | --- |
| Automação | Teste executado por ferramenta, com comando e saída reais; código escrito ou lista de testes não comprova execução |
| Exploração por agente | Agente interage com UI/API e registra suas ações, observações e limitações; não chamar de teste manual humano |
| Manual humano | Registrar ações e resultados confirmados pelo executor, sem preencher resultados antecipadamente |

Antes de executar, confira URL, dados, estado inicial, ferramentas e saída de artefatos. Use contexto/aba isolados, cliente fictício e baixa concorrência (um worker inicialmente). A API não mantém carrinho entre chamadas: enviar todos os dados necessários. Não executar carga, estresse, segurança ou funcionalidades fora do escopo. Não tentar descobrir defeitos lendo a implementação interna da loja.

Quando solicitado a implementar/rodar Playwright:

- Para consolidar a suíte disponível, use `npm test` após conferir configuração e `npm run typecheck`. O modo `npm run test:demo` é demonstração lenta separada, não substitui a suíte normal; não somar suas tentativas à cobertura como novos cenários.

- Mantenha testes e dependências no projeto, executáveis por comandos normais documentados, sem Codex, skill ou credenciais pessoais. Inspecione scripts e configuração existentes antes de escolher o comando; não invente comandos já disponíveis.
- Use seletores estáveis, assertions explícitas e testes independentes. Evite esperas fixas, dependência de ordem e abstrações sem necessidade. Vincule títulos/metadata aos IDs de cenário.
- Registre comando, ambiente, início/fim com fuso, versão da ferramenta/navegador, seleção e saída real. Preserve código de saída de falha ao gerar relatórios; separe testes não selecionados dos executados.
- Se não houver infraestrutura, implemente somente quando solicitado; caso contrário, informe o impedimento. Sem ferramenta de navegador, não alegue cobertura de UI por chamadas HTTP.
- Se o ambiente ficar indisponível, interrompa a execução afetada e registre bloqueio. Uma nova tentativa direcionada é suficiente para confirmar persistência; não criar ciclos de retry ou aumentar concorrência. Preserve a tentativa original e retome após recuperação ou nova orientação.

## Coletar evidências

Use IDs estáveis, por exemplo `EXE-001`, `EVD-001` e `BUG-001`, preservando os já existentes. Relacione requisito → cenário → execução → evidência → eventual bug. Para cada execução, registre:

- Responsável (humano/agente), modalidade, data/hora/fuso, URL e versões observáveis.
- Preparação/dados, esperado, observado e estado: não executado, aprovado, reprovado ou bloqueado.
- Evidências disponíveis: captura/trace para UI, requisição/resposta/status para API, saída/relatório para automação. Identifique a origem e a modalidade de coleta dos artefatos.

Reutilize a organização existente. Se ainda não houver estrutura, mantenha registros em `docs/execucoes/`, relatos em `docs/bugs/` e índice/artefatos selecionados em `docs/evidencias/`, criando apenas os diretórios necessários. Links devem funcionar no repositório, sem depender da conversa ou de caminhos temporários da máquina.

Nunca invente execução, horários, screenshots, status, valores observados ou validação humana. Dado não informado fica “não informado”; atividade não executada fica “não executada”. Evidência ausente limita a comprovação. Oculte dados pessoais em cópias de publicação, identifique a ocultação e não altere valores relevantes; prefira novas execuções com dados fictícios. Preserve resultados de tentativas anteriores e relacione reexecuções, sem sobrescrever falhas.

## Investigar falhas

Compare a divergência com a regra e as simplificações antes de classificá-la. Isole uma condição por vez e faça reprodução direcionada quando viável. Separe defeito da aplicação, falha do teste/ferramenta, ambiente indisponível e dúvida de requisito. Não infira causa interna a partir de sintomas.

Cuidados que mudam a análise neste projeto:

- Cupom inválido/expirado no cálculo retorna 200, sem desconto, com mensagem; no pedido retorna 422. Não confundir status HTTP com aceitação do cupom.
- Bloqueio da sexta unidade na UI não comprova rejeição pela API; um caso aprovado não comprova todo o CA.
- Frete incorreto em R$ 200 com e sem cupom sustenta CA06, mas não isola CA08. Investigue a interação separadamente, sem presumir uma única causa.
- Chamadas duplicadas não comprovam impacto nem severidade; registre observação até demonstrar problema.
- Nova aba vazia, ausência de e-mail/persistência/cobrança e números fictícios são simplificações esperadas.

Relato de bug: título específico, requisito, ambiente, precondições, dados, passos mínimos, esperado, observado, impacto, severidade justificada, reprodução e evidências. Agrupe manifestações relacionadas quando houver fundamento, sem duplicar relatos apenas por aparecerem na UI e API. Se não reproduzir, preserve como indício com suas limitações. Não altere assertions, ignore casos ou aumente retries apenas para deixar a suíte verde; não tente corrigir o código da loja.

## Relatar e revisar

Preserve o JSON e os anexos da rodada em uma pasta própria antes de sobrescrever as saídas temporárias. Obtenha ambiente de configuração ou respostas reais: campos de configuração do JSON podem ser omitidos. Gere um relatório Markdown navegável ligado aos requisitos e aos artefatos, mantendo o HTML local como complemento.

Consolide apenas dados registrados: escopo executado, contagem por estado/modalidade, cobertura por requisito, defeitos, bloqueios e riscos restantes. Conte cenários distintos separadamente de tentativas, linhas de parâmetros e camadas; separe o teste local INFRA-001 dos testes de negócio. Não preencha lacunas com estimativas. Testes não executados/ignorados não são aprovados.

Atualize README e índice com caminhos reais, comandos verificados e limitações. Diferencie testes implementados dos executados e cobertura planejada da demonstrada. Uma skill validada estruturalmente não equivale a um fluxo completo já exercitado.

Registre o uso real de IA e a participação humana confirmada. Termine explicando o que mudou, o que foi efetivamente executado e o que permanece pendente. Faça commits apenas quando solicitados, com mensagens em inglês. Não faça push nem envie candidatura sem instrução explícita para essa ação.
