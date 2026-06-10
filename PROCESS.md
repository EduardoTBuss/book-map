# 📋 PROCESS.md — Processo de Desenvolvimento com IA

Este documento descreve todo o processo de obtenção do projeto **BookMap**, destacando a interação com a ferramenta de IA **Antigravity** desde o tratamento da especificação até a entrega final.

---

## 1. Recebimento e Análise da Especificação

A especificação foi recebida com os seguintes requisitos principais:

- Aplicação web em **React + Vite**
- Pesquisa de livros por título via **Open Library API**
- Consulta de países por idioma via **REST Countries API**
- Visualização geográfica com **Leaflet / React Leaflet**
- Tratamento de erros para cenários de dados faltantes
- Execução com `npm install` + `npm run dev`

### Primeiro prompt à IA:
> *"Quero que você entenda o projeto e me mande ideias e arquitetura de como fazer"*

A IA analisou a especificação completa e realizou pesquisa nas documentações oficiais de ambas as APIs para entender endpoints, formatos de resposta e possíveis incompatibilidades.

---

## 2. Pesquisa e Descobertas Técnicas

### 2.1 Open Library API
- **Endpoint**: `https://openlibrary.org/search.json?title={query}&limit=10&fields=...`
- **Campos relevantes**: `key`, `title`, `author_name`, `first_publish_year`, `language`, `cover_i`
- **Descoberta crítica**: O campo `language` retorna códigos **ISO 639-2/B** (3 letras), como `eng`, `por`, `spa`, `fre`

### 2.2 REST Countries API
- **Endpoint**: `https://restcountries.com/v3.1/lang/{language}`
- **Descoberta crítica**: Aceita **nome do idioma por extenso** (`english`, `portuguese`) e **NÃO** o código de 3 letras

### 2.3 Incompatibilidade Identificada
A Open Library retorna `eng` mas a REST Countries espera `english`. Foi necessário criar um mapeamento intermediário (`languageMap.js`) com ~50 idiomas para fazer a conversão corretamente.

---

## 3. Plano de Arquitetura

A IA propôs uma arquitetura completa com:

- **Diagramas de fluxo** (Mermaid) mostrando o pipeline de dados
- **Estrutura de pastas** organizada por responsabilidade (components, services, utils, hooks)
- **Design dos componentes**: SearchBar, BookList, BookDetail, MapView, ErrorMessage
- **Paleta de cores**: Dark mode com gradientes violeta e glassmorphism
- **Tratamento de todos os cenários de erro** documentados em tabela
- **Layout responsivo**: split-view 40/60 em desktop, stack vertical em mobile

### Componentes planejados:
| Componente | Responsabilidade |
|---|---|
| `SearchBar` | Input + botão de busca com validação |
| `BookList` | Grid scrollável de cards de livros |
| `BookDetail` | Detalhes do livro selecionado com idioma e contagem de países |
| `MapView` | Mapa Leaflet com markers customizados e popups |
| `ErrorMessage` | Mensagem reutilizável de erro/aviso/info |

---

## 4. Implementação

### 4.1 Scaffolding
```bash
npx create-vite@latest book-map --template react
cd book-map
npm install leaflet react-leaflet
```

### 4.2 Ordem de Implementação
1. **`index.css`** — Design tokens e variáveis CSS globais
2. **`languageMap.js`** — Mapeamento ISO 639-2/B → nome do idioma
3. **`openLibraryApi.js`** e **`restCountriesApi.js`** — Serviços de API
4. **`SearchBar`** — Componente de busca com validação
5. **`BookList`** + cards — Lista de resultados com animações stagger
6. **`BookDetail`** — Painel de detalhes com badges de idioma/países
7. **`MapView`** — Mapa com React Leaflet, markers custom e auto-fit bounds
8. **`ErrorMessage`** — Componente reutilizável de mensagens
9. **`App.jsx`** — Orquestrador de estado global
10. **`main.jsx`** — Entry point com fix de ícones Leaflet

### 4.3 Decisões Técnicas
- **`fetch` nativo** ao invés de Axios — conforme requisito da especificação
- **Markers customizados** via `L.divIcon` — círculos com gradiente ao invés de pins padrão
- **CartoDB Dark Matter tiles** — mapa escuro harmonizado com interface
- **`flyToBounds` automático** — mapa ajusta zoom para enquadrar todos os países
- **Debounce não implementado** — simplificação para clareza, busca ocorre no submit

---

## 5. Testes Realizados

| Teste | Resultado |
|---|---|
| Buscar "Dom Casmurro" | ✅ Retorna resultados com idioma `por`, países lusófonos no mapa |
| Buscar "The Great Gatsby" | ✅ Retorna com idioma `eng`, dezenas de países anglófonos |
| Buscar "Cien años de soledad" | ✅ Idioma `spa`, países hispânicos no mapa |
| Buscar texto inexistente | ✅ Mensagem "Nenhum livro encontrado" |
| Selecionar livro sem idioma | ✅ Aviso "Idioma não informado" |
| Campo de busca vazio | ✅ Input com borda vermelha, não envia |
| Responsividade mobile | ✅ Layout empilhado corretamente |
| Build de produção | ✅ `npm run build` sem erros |

---

## 6. Ferramentas Utilizadas

- **Antigravity (IA)** — Planejamento, arquitetura, implementação completa e testes
- **Vite** — Build tool e servidor de desenvolvimento
- **React** — Biblioteca de interface
- **Leaflet + React Leaflet** — Mapas interativos
- **Open Library API** — Dados de livros
- **REST Countries API** — Dados de países por idioma

---

## 7. Iteração 2 — Todos os idiomas, países pintados e novo design

Após a primeira entrega, foi identificado que a aplicação considerava apenas o **primeiro idioma** da obra e exibia os países com markers. A iteração 2 (feita com **Claude Code**) corrigiu e expandiu o comportamento:

### Mudanças principais

| Antes | Depois |
|---|---|
| Apenas `book.language[0]` | Todos os idiomas da obra, buscados em paralelo |
| Markers (pinos) por país | Países **pintados** com polígonos GeoJSON, uma cor por idioma |
| Busca `title=` (relevância fraca) | Busca `q=` — a obra canônica com as traduções aparece primeiro |
| Consulta por nome (`/lang/english`) | Consulta por código ISO 639-3 (`/lang/eng`) — `persian` retornava 404, `fas` funciona |
| Tema violeta com glassmorphism | Tema "atlas de cartógrafo": tinta escura + dourado, Fraunces/Instrument Sans/IBM Plex Mono |

### Novos elementos

- **`public/data/world-countries.geo.json`** — fronteiras mundiais (ids ISO 3166-1 alpha-3, casados com o campo `cca3` da REST Countries)
- **Legenda interativa** — um chip por idioma com contagem de países; clique oculta/exibe a camada
- **Tooltip nos países** — bandeira, capital, região, população e os idiomas da obra falados ali
- **Cache por idioma** no serviço REST Countries e guarda contra respostas fora de ordem ao trocar de livro

### Verificação

A aplicação foi dirigida em Chrome headless (Playwright) pela própria IA: *Le Petit Prince* retornou 38 idiomas e 186 países pintados em 12 cores; o toggle da legenda e o reset ao buscar novamente foram confirmados com screenshots.

---

## 8. Conclusão

O projeto foi desenvolvido inteiramente com auxílio da IA Antigravity, desde a análise da especificação até a entrega do código testado e funcional. A principal dificuldade técnica foi a incompatibilidade entre os formatos de código de idioma das duas APIs, resolvida com um mapeamento local. O design priorizou uma experiência visual premium com dark mode, animações suaves e responsividade completa.
