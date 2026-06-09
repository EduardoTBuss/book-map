import { getCoverUrl } from '../services/openLibraryApi';
import { getLanguageDisplay, getLanguageName } from '../utils/languageMap';
import './BookDetail.css';

function BookDetail({ book, countriesCount, loadingCountries }) {
  if (!book) return null;

  const coverUrl = getCoverUrl(book.cover_i, 'L');
  const langCode = book.language?.[0];
  const langDisplay = langCode ? getLanguageDisplay(langCode) : null;
  const langName = langCode ? getLanguageName(langCode) : null;

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
                e.target.parentElement.innerHTML = '<span class="detail-cover-placeholder">📖</span>';
              }}
            />
          ) : (
            <span className="detail-cover-placeholder">📖</span>
          )}
        </div>

        <div className="detail-info">
          <h3 className="detail-title">{book.title}</h3>

          <p className="detail-author">
            por <span>{book.author_name?.join(', ') || 'Autor desconhecido'}</span>
          </p>

          {book.first_publish_year && (
            <div className="detail-row">
              <span className="icon">📅</span>
              Publicado em {book.first_publish_year}
            </div>
          )}

          {book.edition_count && (
            <div className="detail-row">
              <span className="icon">📚</span>
              {book.edition_count} edição{book.edition_count !== 1 ? 'ões' : ''}
            </div>
          )}

          {langDisplay ? (
            <>
              <span className="detail-language-badge">
                🌐 {langDisplay}
              </span>

              {loadingCountries ? (
                <span className="detail-countries-count" style={{ opacity: 0.6 }}>
                  🌍 Buscando países...
                </span>
              ) : langName && countriesCount > 0 ? (
                <span className="detail-countries-count">
                  🌍 {countriesCount} país{countriesCount !== 1 ? 'es' : ''} fala{countriesCount === 1 ? '' : 'm'} este idioma
                </span>
              ) : langName && countriesCount === 0 ? (
                <div className="detail-no-language">
                  ⚠️ Nenhum país encontrado para "{langDisplay}"
                </div>
              ) : !langName ? (
                <div className="detail-no-language">
                  ⚠️ Idioma "{langCode}" não reconhecido para busca de países
                </div>
              ) : null}
            </>
          ) : (
            <div className="detail-no-language">
              ⚠️ Idioma não informado para esta obra
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookDetail;
