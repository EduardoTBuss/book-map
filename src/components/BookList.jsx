import { getCoverUrl } from '../services/openLibraryApi';
import { getLanguageDisplay } from '../utils/languageMap';
import './BookList.css';

function BookList({ books, selectedBook, onSelectBook }) {
  if (!books || books.length === 0) return null;

  return (
    <div className="book-list">
      <div className="book-list-header">
        <h2>Resultados</h2>
        <span className="result-count">{books.length} livro{books.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="book-grid">
        {books.map((book) => {
          const isSelected = selectedBook?.key === book.key;
          const coverUrl = getCoverUrl(book.cover_i, 'S');
          const language = book.language?.[0];

          return (
            <div
              key={book.key}
              id={`book-card-${book.key.replace('/works/', '')}`}
              className={`book-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectBook(book)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectBook(book);
                }
              }}
            >
              <div className="book-cover">
                {coverUrl ? (
                  <img
                    src={coverUrl}
                    alt={`Capa de ${book.title}`}
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<span class="book-cover-placeholder">📖</span>';
                    }}
                  />
                ) : (
                  <span className="book-cover-placeholder">📖</span>
                )}
              </div>
              <div className="book-info">
                <span className="book-title" title={book.title}>
                  {book.title}
                </span>
                <span className="book-author">
                  {book.author_name?.join(', ') || 'Autor desconhecido'}
                </span>
                <div className="book-meta">
                  {book.first_publish_year && (
                    <span className="book-badge">{book.first_publish_year}</span>
                  )}
                  {language && (
                    <span className="book-badge language">
                      {getLanguageDisplay(language)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BookList;
