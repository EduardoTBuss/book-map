const BASE_URL = 'https://restcountries.com/v3.1';

// Cache em memória por idioma — uma obra costuma repetir idiomas entre
// seleções e cada idioma dispara uma requisição própria.
const cache = new Map();

/**
 * Busca países por idioma via REST Countries API.
 * @param {string} languageQuery - Código ISO 639-3 do idioma (ex: "por", "fra")
 * @returns {Promise<Array>} Array de países (com cca3 para casar com o GeoJSON)
 */
export async function getCountriesByLanguage(languageQuery) {
  if (!languageQuery) return [];
  if (cache.has(languageQuery)) return cache.get(languageQuery);

  const fields = 'name,cca3,flags,latlng,region,subregion,population,capital';

  const response = await fetch(
    `${BASE_URL}/lang/${encodeURIComponent(languageQuery)}?fields=${fields}`
  );

  // REST Countries retorna 404 quando não encontra nenhum país
  if (response.status === 404) {
    cache.set(languageQuery, []);
    return [];
  }

  if (!response.ok) {
    throw new Error(`Erro ao buscar países: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  // Ordena por população (maior primeiro) para destaque visual
  const sorted = data.sort((a, b) => (b.population || 0) - (a.population || 0));
  cache.set(languageQuery, sorted);
  return sorted;
}
