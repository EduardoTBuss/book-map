# 🤖 Processo de Desenvolvimento com IA

Este documento descreve como a Inteligência Artificial foi utilizada em cada etapa do desenvolvimento do **Book Map**, desde a concepção até a entrega.

---

## Ferramentas utilizadas

| Ferramenta | Papel no projeto |
|---|---|
| **Antygravity IDE** | Arquitetura, geração de código e scaffolding do projeto |
| **Claude Code (terminal)** | Versionamento, GitHub e ajustes técnicos |

---

## Etapa 1 — Arquitetura e código com Antygravity IDE

### O que foi solicitado

1. **Entender o projeto**: descrevi a ideia para a IA — uma aplicação que conecta livros a um mapa geográfico pelo idioma da obra — e pedi que ela compreendesse o escopo e os requisitos.

2. **Pensar e propor arquiteturas**: pedi que a IA pensasse em diferentes arquiteturas possíveis para o projeto e retornasse as opções com suas vantagens e desvantagens.

3. **Escolha humana**: analisei as propostas e escolhi a arquitetura que fazia mais sentido para o projeto.

4. **Geração do código**: com a arquitetura definida, solicitei à IA que gerasse o código completo seguindo o que foi decidido.

### Resultado

A Antygravity IDE criou toda a estrutura do projeto de forma autônoma — pastas, arquivos, componentes, serviços e estilos — diretamente no computador, sem intervenção manual no código.

---

## Etapa 2 — Versionamento e ajustes com Claude Code

### O que foi solicitado

Após o projeto estar criado localmente, utilizei o **Claude Code via terminal** para:

- Inicializar o repositório Git e subir o projeto no GitHub
- Criar e refinar os arquivos README (este incluso)
- Corrigir detalhes técnicos de configuração

### Papel humano

As decisões de o que publicar, como descrever o projeto e quais ajustes fazer foram tomadas pelo desenvolvedor. A IA executou as tarefas técnicas conforme orientado.

---

## Etapa 3 — Refatoração: todos os idiomas e países pintados (Claude Code)

### O problema identificado

A primeira versão usava apenas o **idioma principal** da obra (`book.language[0]`) e exibia os países como **markers** soltos no mapa — um livro em inglês virava 91 pinos, sem mostrar as demais línguas em que a obra existe.

### O que foi solicitado

> *"Quando eu pesquisar um livro, quero todas as línguas em que ele está disponível, e pintar os países que falam essas línguas — não apenas marcados."*

### O que a IA fez

- **Lógica**: todos os códigos de idioma da obra agora viram camadas, buscadas em paralelo na REST Countries; os países são **pintados** com polígonos GeoJSON, uma cor por idioma, com legenda interativa (clique para ocultar/exibir um idioma).
- **Descobertas técnicas**: a relevância da busca da Open Library melhora com `q=` em vez de `title=` (a obra canônica, com as traduções, aparece primeiro); o endpoint `/lang/` da REST Countries aceita códigos ISO 639-3 (`fas`), mais confiável que nomes em inglês (`persian` retorna 404).
- **Verificação**: a própria IA dirigiu a aplicação em Chrome headless (Playwright) e confirmou, por exemplo, *Le Petit Prince* com 38 idiomas e 186 países pintados.
- **Redesign**: nova identidade visual "atlas de cartógrafo" — tinta escura, acentos dourados, tipografia Fraunces/Instrument Sans/IBM Plex Mono.

### Papel humano

O desenvolvedor identificou o comportamento errado, definiu o resultado esperado e validou a entrega. A IA investigou as causas, propôs as soluções e as verificou de ponta a ponta.

---

## Conclusão

O desenvolvimento seguiu um modelo de **colaboração humano-IA**: a IA acelerou a produção e eliminou tarefas repetitivas, enquanto as decisões de produto, arquitetura e direção ficaram com o desenvolvedor. Esse fluxo é o que chamamos de *vibe coding* — usar IA generativa como par de desenvolvimento.
