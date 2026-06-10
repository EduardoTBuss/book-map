import { useState, useCallback, useRef } from 'react';
import SearchBar from './components/SearchBar';
import BookList from './components/BookList';
import BookDetail from './components/BookDetail';
import MapView from './components/MapView';
import ErrorMessage from './components/ErrorMessage';
import { searchBooks } from './services/openLibraryApi';
import { getCountriesByLanguage } from './services/restCountriesApi';
import { getLanguageInfo, getLanguageQuery, getLanguageColor } from './utils/languageMap';
import './App.css';

function App() {
  // Book search state
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Language/country state — uma camada por idioma da obra
  const [languageLayers, setLanguageLayers] = useState([]);
  const [unknownLanguages, setUnknownLanguages] = useState([]);
  const [countriesLoading, setCountriesLoading] = useState(false);
  const [countriesError, setCountriesError] = useState(null);

  // Guarda contra respostas fora de ordem ao trocar de livro durante o fetch
  const selectionIdRef = useRef(0);

  /**
   * Busca livros por título na Open Library.
   */
  const handleSearch = useCallback(async (query) => {
    setSearchLoading(true);
    setSearchError(null);
    setBooks([]);
    setSelectedBook(null);
    setLanguageLayers([]);
    setUnknownLanguages([]);
    setCountriesError(null);
    setHasSearched(true);

    try {
      const results = await searchBooks(query);
      setBooks(results);

      if (results.length === 0) {
        setSearchError(`Nenhum livro encontrado para "${query}". Tente outro título.`);
      }
    } catch (err) {
      console.error('Erro ao buscar livros:', err);
      setSearchError('Erro ao consultar a Open Library. Verifique sua conexão e tente novamente.');
    } finally {
      setSearchLoading(false);
    }
  }, []);

  /**
   * Seleciona um livro e busca os países de TODOS os idiomas em que a obra
   * está disponível — cada idioma vira uma camada colorida no mapa.
   */
  const handleSelectBook = useCallback(async (book) => {
    const selectionId = ++selectionIdRef.current;

    setSelectedBook(book);
    setLanguageLayers([]);
    setUnknownLanguages([]);
    setCountriesError(null);

    const codes = [...new Set((book.language || []).map((c) => c.toLowerCase()))];

    if (codes.length === 0) {
      // Livro sem idioma informado — não busca países
      return;
    }

    const known = codes.filter((c) => getLanguageInfo(c));
    const unknown = codes.filter((c) => !getLanguageInfo(c));
    setUnknownLanguages(unknown);

    if (known.length === 0) {
      setCountriesError(
        `Nenhum dos idiomas desta obra (${codes.join(', ')}) é reconhecido para busca de países.`
      );
      return;
    }

    setCountriesLoading(true);

    try {
      const results = await Promise.allSettled(
        known.map((code) => getCountriesByLanguage(getLanguageQuery(code)))
      );

      // Outro livro foi selecionado enquanto esta busca rodava — descarta
      if (selectionId !== selectionIdRef.current) return;

      const layers = [];
      let failed = 0;

      results.forEach((result, i) => {
        const code = known[i];
        const info = getLanguageInfo(code);

        if (result.status === 'fulfilled') {
          layers.push({
            code,
            display: info.display,
            color: getLanguageColor(layers.length),
            countries: result.value,
          });
        } else {
          console.error(`Erro ao buscar países de "${info.display}":`, result.reason);
          failed++;
        }
      });

      setLanguageLayers(layers);

      const totalCountries = new Set(
        layers.flatMap((l) => l.countries.map((c) => c.cca3))
      ).size;

      if (layers.length === 0) {
        setCountriesError('Erro ao consultar a REST Countries API. Tente novamente.');
      } else if (totalCountries === 0) {
        setCountriesError('Nenhum país encontrado para os idiomas desta obra.');
      } else if (failed > 0) {
        setCountriesError(`Não foi possível carregar ${failed} idioma(s) — exibindo os demais.`);
      }
    } catch (err) {
      if (selectionId !== selectionIdRef.current) return;
      console.error('Erro ao buscar países:', err);
      setCountriesError('Erro ao consultar a REST Countries API. Tente novamente.');
    } finally {
      if (selectionId === selectionIdRef.current) {
        setCountriesLoading(false);
      }
    }
  }, []);

  return (
    <div className="app">
      {/* Left Panel: Search, Results, Book Details */}
      <aside className="panel-left">
        <SearchBar onSearch={handleSearch} isLoading={searchLoading} />

        <div className="panel-scroll">
          {/* Search Error */}
          {searchError && (
            <ErrorMessage
              type={books.length === 0 && hasSearched ? 'warning' : 'error'}
              message={searchError}
            />
          )}

          {/* Countries Error */}
          {countriesError && (
            <ErrorMessage type="warning" message={countriesError} />
          )}

          {/* Book Detail */}
          {selectedBook && (
            <BookDetail
              book={selectedBook}
              languageLayers={languageLayers}
              unknownLanguages={unknownLanguages}
              loadingCountries={countriesLoading}
            />
          )}

          {/* Book List */}
          {books.length > 0 && (
            <BookList
              books={books}
              selectedBook={selectedBook}
              onSelectBook={handleSelectBook}
            />
          )}

          {/* Empty state before first search */}
          {!hasSearched && (
            <div className="empty-state">
              <span className="empty-state-glyph">✦</span>
              <h3 className="empty-state-title">Descubra o mundo através dos livros</h3>
              <p className="empty-state-text">
                Pesquise um livro pelo título e veja no mapa, pintados por idioma,
                todos os países que falam as línguas em que a obra está disponível.
              </p>
              <span className="empty-state-coords">40°45′N&nbsp;·&nbsp;73°59′O</span>
            </div>
          )}
        </div>

        <footer className="panel-footer">
          <span>Open Library · REST Countries</span>
          <span className="panel-footer-mark">Atlas Literário</span>
        </footer>
      </aside>

      {/* Right Panel: Map */}
      <main className="panel-right">
        <MapView
          languageLayers={languageLayers}
          loadingCountries={countriesLoading}
        />
      </main>
    </div>
  );
}

export default App;
