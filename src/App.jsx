import { useState, useCallback } from 'react';
import SearchBar from './components/SearchBar';
import BookList from './components/BookList';
import BookDetail from './components/BookDetail';
import MapView from './components/MapView';
import ErrorMessage from './components/ErrorMessage';
import { searchBooks } from './services/openLibraryApi';
import { getCountriesByLanguage } from './services/restCountriesApi';
import { getLanguageName, getLanguageDisplay } from './utils/languageMap';
import './App.css';

function App() {
  // Book search state
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Country state
  const [countries, setCountries] = useState([]);
  const [countriesLoading, setCountriesLoading] = useState(false);
  const [countriesError, setCountriesError] = useState(null);
  const [currentLanguageDisplay, setCurrentLanguageDisplay] = useState('');

  /**
   * Busca livros por título na Open Library.
   */
  const handleSearch = useCallback(async (query) => {
    setSearchLoading(true);
    setSearchError(null);
    setBooks([]);
    setSelectedBook(null);
    setCountries([]);
    setCountriesError(null);
    setCurrentLanguageDisplay('');
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
   * Seleciona um livro e busca os países do idioma.
   */
  const handleSelectBook = useCallback(async (book) => {
    setSelectedBook(book);
    setCountries([]);
    setCountriesError(null);
    setCurrentLanguageDisplay('');

    const langCode = book.language?.[0];

    if (!langCode) {
      // Livro sem idioma informado — não busca países
      return;
    }

    const langName = getLanguageName(langCode);
    const langDisplay = getLanguageDisplay(langCode);
    setCurrentLanguageDisplay(langDisplay);

    if (!langName) {
      // Idioma não reconhecido no nosso mapeamento
      setCountriesError(`Não foi possível identificar o idioma "${langCode}" para buscar países.`);
      return;
    }

    setCountriesLoading(true);

    try {
      const result = await getCountriesByLanguage(langName);
      setCountries(result);

      if (result.length === 0) {
        setCountriesError(`Nenhum país encontrado para o idioma "${langDisplay}".`);
      }
    } catch (err) {
      console.error('Erro ao buscar países:', err);
      setCountriesError('Erro ao consultar a REST Countries API. Tente novamente.');
    } finally {
      setCountriesLoading(false);
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
              countriesCount={countries.length}
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
              <span className="empty-state-icon">🔍</span>
              <h3 className="empty-state-title">Descubra o mundo através dos livros</h3>
              <p className="empty-state-text">
                Pesquise um livro pelo título e veja no mapa quais países falam o idioma da obra selecionada.
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* Right Panel: Map */}
      <main className="panel-right">
        <MapView
          countries={countries}
          loadingCountries={countriesLoading}
          languageDisplay={currentLanguageDisplay}
        />
      </main>
    </div>
  );
}

export default App;
