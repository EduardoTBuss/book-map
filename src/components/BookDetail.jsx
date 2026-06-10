import { getCoverUrl } from '../services/openLibraryApi';
import './BookDetail.css';

function BookDetail({ book, languageLayers, unknownLanguages, loadingCountries }) {
  if (!book) return null;

  const coverUrl = getCoverUrl(book.cover_i, 'L');
  const hasLanguages = (book.language || []).length > 0;

  const totalCountries = new Set(
    languageLayers.flatMap((l) => l.countries.map((c) => c.cca3))
  ).size;

  return (
    <div className="book-detail">
      <div className="book-detail-card">
        <div className="detail-cover">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={`Capa de ${book.title}`}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<span class="detail-cover-placeholder">✦</span>';
              }}
            />
          ) : (
            <span className="detail-cover-placeholder">✦</span>
          )}
        </div>

        <div className="detail-info">
          <h3 className="detail-title">{book.title}</h3>

          <p className="detail-author">
            por <span>{book.author_name?.join(', ') || 'Autor desconhecido'}</span>
          </p>

          <div className="detail-meta">
            {book.first_publish_year && (
              <span className="detail-meta-item">{book.first_publish_year}</span>
            )}
            {book.edition_count > 0 && (
              <span className="detail-meta-item">
                {book.edition_count} edi{book.edition_count !== 1 ? 'ções' : 'ção'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Idiomas em que a obra está disponível */}
      <div className="detail-languages">
        <div className="detail-languages-header">
          <span className="detail-languages-title">Disponível em</span>
          {loadingCountries ? (
            <span className="detail-languages-status loading">cartografando…</span>
          ) : totalCountries > 0 ? (
            <span className="detail-languages-status">
              {totalCountries} país{totalCountries !== 1 ? 'es' : ''}
            </span>
          ) : null}
        </div>

        {hasLanguages ? (
          <div className="detail-language-chips">
            {languageLayers.map((layer) => (
              <span
                key={layer.code}
                className="detail-language-chip"
                style={{ '--chip-color': layer.color }}
              >
                {layer.display}
                <em>{layer.countries.length}</em>
              </span>
            ))}
            {unknownLanguages.map((code) => (
              <span key={code} className="detail-language-chip unknown" title="Idioma não mapeado para países">
                {code}
              </span>
            ))}
            {loadingCountries && languageLayers.length === 0 && (
              <span className="detail-language-chip placeholder">…</span>
            )}
          </div>
        ) : (
          <div className="detail-no-language">
            Idioma não informado para esta obra
          </div>
        )}
      </div>
    </div>
  );
}

export default BookDetail;
