<h1 align="center">📚 Book Map</h1>
<p align="center">
  <em>Every book, all of its languages — painted across the world map.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/React--Leaflet-5-199900?style=flat-square&logo=leaflet&logoColor=white" />
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" />
</p>

---

> 🇧🇷 Versão em português: [README.pt.md](README.pt.md)

---

<!-- TODO: screenshot/GIF do mapa colorindo países -->
![demo](docs/demo.png)

---

Search for a book and see, painted on a world map by language, every country that
speaks the languages the work is available in.

---

## How it works

1. **Search** for a book by its title.
2. **Pick** a work from the results list.
3. **Explore** the map: every language the work was published in gets its own color,
   and all countries that speak that language are painted with it.
4. **Filter** through the legend: click a language to hide or show it on the map.

Hovering a painted country reveals its flag, capital, region, population, and which of
the work's languages are spoken there.

---

## Running locally

No API keys required — both data sources are public.

```bash
git clone https://github.com/EduardoTBuss/book-map.git
cd book-map
npm install
npm run dev
```

Then open `http://localhost:5173` (Vite's default dev port).

Other scripts (from `package.json`):

```bash
npm run build     # production build into dist/
npm run preview   # serve the production build locally
npm run lint      # run ESLint
```

---

## Stack

| Layer | Choice |
|---|---|
| UI | React 19 + Vite 8 |
| Map | React-Leaflet 5 + Leaflet 1.9, with CARTO Dark Matter tiles |
| Country borders | World GeoJSON (ISO 3166-1 alpha-3 feature ids), served locally from `public/data/` |
| Book data | [Open Library Search API](https://openlibrary.org/developers/api) |
| Country/language data | [REST Countries API](https://restcountries.com) |
| Styling | Vanilla CSS with design tokens (no UI framework) |

---

## Project structure

```
src/
├── components/       # SearchBar, BookList, BookDetail, MapView, ErrorMessage
├── services/         # openLibraryApi.js · restCountriesApi.js (per-language cache)
├── utils/            # languageMap.js (ISO 639-2/B → ISO 639-3 + display name + colors)
├── App.jsx           # Root component and state orchestrator
└── index.css         # Global design tokens
public/
└── data/             # world-countries.geo.json (country polygons)
```

### Data flow

```
title query
      ↓
  Open Library API   →  works carrying ALL edition languages (ISO 639-2/B)
      ↓
  languageMap.js     →  maps each code to ISO 639-3 ("fre" → "fra")
      ↓                 and assigns one color per language
REST Countries API   →  countries per language, fetched in parallel (Promise.allSettled)
      ↓
  GeoJSON + Leaflet  →  countries PAINTED per language, interactive legend,
                        tooltips with flag, capital, region and population
```

---

## Technical decisions

- **React + Leaflet via `react-leaflet`.** The map state (which countries are painted,
  current color per language) is derived from React state, so `react-leaflet` keeps the
  imperative Leaflet layers in sync with the component tree. The `GeoJSON` layer is
  remounted via a computed `key` whenever the painting changes, because Leaflet's
  `GeoJSON` does not re-run its `style`/`onEachFeature` callbacks on prop changes alone.

- **Two complementary data sources.** Open Library answers *"in which languages does this
  work exist?"* (it aggregates the languages of all editions of a work). REST Countries
  answers *"which countries speak a given language?"*. Joining them is what makes a book's
  reach visible geographically.

- **Language code normalization (`languageMap.js`).** Open Library returns ISO 639-2/B
  codes, while REST Countries' `/lang/` endpoint expects ISO 639-3. Most codes coincide,
  but several diverge (`fre → fra`, `ger → deu`, `chi → zho`, `per → fas`…). Querying by
  the ISO 639-3 code is more reliable than querying by English name (e.g. `persian`
  returns 404, `fas` does not). The map also pins a display name and a stable legend color
  per language.

- **GeoJSON join by `cca3`.** Countries are matched to map polygons through their ISO
  3166-1 alpha-3 code: REST Countries' `cca3` field equals the GeoJSON feature `id`, so
  painting is a direct lookup instead of fuzzy name matching.

- **State management: plain React hooks.** State lives in `App.jsx` (`useState`/`useCallback`)
  and flows down as props — no Redux/Zustand, since the app has a single screen and a
  shallow state tree. Two robustness details worth calling out:
  - a `useRef` selection counter discards out-of-order responses when a different book is
    selected while a fetch is still in flight;
  - `restCountriesApi.js` keeps an in-memory `Map` cache keyed by language, since the same
    language recurs across books and each language is one request.

- **Local GeoJSON instead of a tile-based country layer.** Borders are bundled in
  `public/data/`, so painting works offline-of-the-tiles and there's no extra geometry API
  to depend on at runtime.

---

## Status & known limitations

- **Coverage is bounded by `languageMap.js`.** Only the languages listed there are mapped
  to countries; works tagged with an unlisted language code show those codes as
  "unmapped" chips and contribute no painted countries. Extending coverage means adding
  entries to the map.
- **"Available in" reflects Open Library metadata, not ground truth.** The language set
  comes from the languages of editions Open Library knows about — it can be incomplete or
  noisy, and it is not a publication-rights map.
- **Language ≠ publication.** A country is painted because the language is *spoken* there
  (per REST Countries), not because the book was necessarily published in that country.
- **External API dependency.** The app calls Open Library and REST Countries directly from
  the browser at runtime; outages or rate limits surface as in-app error messages.
- **No automated tests yet.**
- The demo image (`docs/demo.png`) referenced above is a placeholder and still needs to be
  generated.

---

## About the project

Built for the **Applied Artificial Intelligence** course, exploring generative AI as a
development tool ("vibe coding"). The AI-assisted process is documented in
[AI_PROCESS.md](AI_PROCESS.md) and [PROCESS.md](PROCESS.md).

---

## License

MIT — see [LICENSE](LICENSE). © 2026 Eduardo Timm Buss.
