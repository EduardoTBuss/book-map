const BASE_URL = 'https://restcountries.com/v3.1';

/**
 * Busca países por nome do idioma via REST Countries API.
 * @param {string} languageName - Nome do idioma em inglês (ex: "portuguese")
 * @returns {Promise<Array>} Array de países
 */
export async function getCountriesByLanguage(languageName) {
  if (!languageName) return [];

  const fields = 'name,flags,latlng,region,subregion,population,capital';

  const response = await fetch(
    `${BASE_URL}/lang/${encodeURIComponent(languageName)}?fields=${fields}`
  );

  // REST Countries retorna 404 quando não encontra nenhum país
  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new Error(`Erro ao buscar países: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  // Ordena por população (maior primeiro) para destaque visual
  return data.sort((a, b) => (b.population || 0) - (a.population || 0));
}
