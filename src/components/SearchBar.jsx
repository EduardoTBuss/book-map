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
      <span className="search-kicker">✦ Atlas Literário ✦</span>
      <h1>Book Map</h1>
      <p className="subtitle">
        Cada obra, todas as suas línguas — pintadas no mapa do mundo
      </p>
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="search-input-wrapper">
          <input
            id="search-input"
            type="text"
            className={`search-input ${hasError ? 'error' : ''}`}
            placeholder="Título de um livro…"
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
          {isLoading ? <span className="spinner" /> : 'Buscar'}
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
