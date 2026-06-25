<h1 align="center">📚 Book Map</h1>
<p align="center">
  <em>Cada obra, todas as suas línguas — pintadas no mapa do mundo.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Leaflet-1.9-199900?style=flat-square&logo=leaflet&logoColor=white" />
  <img src="https://img.shields.io/badge/vibe%20coded-%F0%9F%A4%96-blueviolet?style=flat-square" />
</p>

---

> 🇬🇧 English version: [README.md](README.md)

---

**Book Map** conecta literatura e geografia: pesquise um livro, selecione uma obra e veja no mapa **todos os países pintados, idioma por idioma**, onde as línguas em que a obra está disponível são faladas.

<!-- TODO: screenshot/GIF do mapa colorindo países -->
![demo](docs/demo.png)

---

## ✨ Como funciona

1. **Pesquise** um livro pelo título
2. **Selecione** uma obra da lista de resultados
3. **Explore** o mapa: cada idioma em que a obra foi publicada recebe uma cor, e todos os países que falam aquela língua são pintados com ela
4. **Filtre** pela legenda: clique em um idioma para ocultá-lo ou exibi-lo no mapa

> Exemplo: *Le Petit Prince* aparece com dezenas de idiomas — do francês ao coreano — e mais de uma centena de países pintados, cada um com a cor do seu idioma. Passe o mouse sobre um país para ver bandeira, capital, região, população e as línguas da obra faladas ali.

---

## 🚀 Rodando localmente

```bash
git clone https://github.com/EduardoTBuss/book-map.git
cd book-map
npm install
npm run dev
```

Acesse `http://localhost:5173`. Nenhuma chave de API é necessária.

Outros comandos:

```bash
npm run build     # build de produção em dist/
npm run preview   # serve o build de produção localmente
npm run lint      # ESLint
```

---

## 🛠️ Stack

| | |
|---|---|
| UI | React 19 + Vite 8 |
| Mapa | React-Leaflet 5 + Leaflet 1.9 + CARTO Dark Matter tiles |
| Fronteiras | GeoJSON mundial (ISO 3166-1 alpha-3) servido localmente |
| Livros | [Open Library API](https://openlibrary.org/developers/api) |
| Países | [REST Countries API](https://restcountries.com) |
| Estilos | CSS vanilla com design tokens — tema "atlas de cartógrafo" |

---

## 🗂️ Estrutura

```
src/
├── components/       # SearchBar, BookList, BookDetail, MapView, ErrorMessage
├── services/         # openLibraryApi.js · restCountriesApi.js (com cache por idioma)
├── utils/            # languageMap.js (ISO 639-2/B → ISO 639-3 + nome PT + cores)
├── App.jsx           # Componente raiz e orquestrador de estado
└── index.css         # Design tokens globais
public/
└── data/             # world-countries.geo.json (polígonos dos países)
```

---

## 🔄 Fluxo

```
busca por título
      ↓
  Open Library API   →  obras com TODOS os idiomas das edições (ISO 639-2/B)
      ↓
  languageMap.js     →  converte cada código para ISO 639-3 ("fre" → "fra")
      ↓                 e atribui uma cor por idioma
REST Countries API   →  países de cada idioma, em paralelo (Promise.allSettled)
      ↓
  GeoJSON + Leaflet  →  países PINTADOS por idioma, legenda interativa,
                        tooltip com bandeira, capital, região e população
```

---

## 🤖 Sobre o projeto

Desenvolvido para a disciplina de **Inteligência Artificial Aplicada**, onde exploramos o uso de IA generativa como ferramenta de desenvolvimento — uma prática chamada de *vibe coding*. O objetivo é aprender a colaborar com IA para construir produtos funcionais de forma rápida e iterativa, desde o design até a entrega.

O processo de desenvolvimento com IA está documentado em [AI_PROCESS.md](AI_PROCESS.md) e [PROCESS.md](PROCESS.md).

---

## 📄 Licença

MIT — veja [LICENSE](LICENSE).
