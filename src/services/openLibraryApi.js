const BASE_URL = 'https://openlibrary.org';
const COVERS_URL = 'https://covers.openlibrary.org';

/**
 * Busca livros por título na Open Library API.
 * @param {string} title - Título do livro a ser pesquisado
 * @returns {Promise<Array>} Array de documentos de livros
 */
export async function searchBooks(title) {
  if (!title || !title.trim()) {
    return [];
  }

  // Busca geral (q=) em vez de title=: a relevância da Open Library prioriza
  // as obras canônicas, que concentram as edições traduzidas — essencial para
  // listar todos os idiomas em que o livro está disponível.
  const params = new URLSearchParams({
    q: title.trim(),
    limit: '12',
    fields: 'key,title,author_name,first_publish_year,language,cover_i,edition_count',
  });

  const response = await fetch(`${BASE_URL}/search.json?${params}`);

  if (!response.ok) {
    throw new Error(`Erro ao buscar livros: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.docs || [];
}

/**
 * Gera a URL da capa do livro.
 * @param {number|null} coverId - ID da capa na Open Library
 * @param {'S'|'M'|'L'} size - Tamanho da imagem (S=small, M=medium, L=large)
 * @returns {string|null} URL da capa ou null se não existir
 */
export function getCoverUrl(coverId, size = 'M') {
  if (!coverId) return null;
  return `${COVERS_URL}/b/id/${coverId}-${size}.jpg`;
}
