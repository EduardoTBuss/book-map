import { useState } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState('');
  const [hasError, setHasError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setHasError(true);
      setTimeout(() => setHasError(false), 1500);
      return;
    }
    setHasError(false);
    onSearch(query.trim());
  };

  return (
    <div className="search-bar-wrapper">
      <h1>📚 BookMap</h1>
      <p className="subtitle">Pesquise livros e descubra onde se fala o idioma da obra</p>
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            id="search-input"
            type="text"
            className={`search-input ${hasError ? 'error' : ''}`}
            placeholder="Digite o título de um livro..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (hasError) setHasError(false);
            }}
            disabled={isLoading}
            autoComplete="off"
          />
        </div>
        <button
          id="search-button"
          type="submit"
          className="search-button"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner" />
              Buscando...
            </>
          ) : (
            'Buscar'
          )}
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
