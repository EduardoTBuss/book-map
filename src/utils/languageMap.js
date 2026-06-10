/**
 * Mapeamento de códigos ISO 639-2/B (usados pela Open Library) para:
 * - `query`: código ISO 639-3 aceito pelo endpoint /lang/ da REST Countries
 *   (mais robusto que o nome em inglês — ex: "persian" retorna 404, "fas" não);
 * - `display`: nome de exibição em português.
 *
 * Na maioria dos idiomas os dois códigos coincidem; os divergentes
 * (fre→fra, ger→deu, chi→zho…) estão convertidos abaixo.
 */
const languageMap = {
  eng: { query: 'eng', display: 'Inglês' },
  spa: { query: 'spa', display: 'Espanhol' },
  por: { query: 'por', display: 'Português' },
  fre: { query: 'fra', display: 'Francês' },
  ger: { query: 'deu', display: 'Alemão' },
  ita: { query: 'ita', display: 'Italiano' },
  rus: { query: 'rus', display: 'Russo' },
  jpn: { query: 'jpn', display: 'Japonês' },
  chi: { query: 'zho', display: 'Chinês' },
  ara: { query: 'ara', display: 'Árabe' },
  hin: { query: 'hin', display: 'Hindi' },
  kor: { query: 'kor', display: 'Coreano' },
  dut: { query: 'nld', display: 'Holandês' },
  pol: { query: 'pol', display: 'Polonês' },
  tur: { query: 'tur', display: 'Turco' },
  swe: { query: 'swe', display: 'Sueco' },
  nor: { query: 'nor', display: 'Norueguês' },
  dan: { query: 'dan', display: 'Dinamarquês' },
  fin: { query: 'fin', display: 'Finlandês' },
  heb: { query: 'heb', display: 'Hebraico' },
  tha: { query: 'tha', display: 'Tailandês' },
  vie: { query: 'vie', display: 'Vietnamita' },
  ukr: { query: 'ukr', display: 'Ucraniano' },
  rum: { query: 'ron', display: 'Romeno' },
  cze: { query: 'ces', display: 'Tcheco' },
  gre: { query: 'ell', display: 'Grego' },
  hun: { query: 'hun', display: 'Húngaro' },
  cat: { query: 'cat', display: 'Catalão' },
  ind: { query: 'ind', display: 'Indonésio' },
  per: { query: 'fas', display: 'Persa' },
  ben: { query: 'ben', display: 'Bengali' },
  tam: { query: 'tam', display: 'Tâmil' },
  urd: { query: 'urd', display: 'Urdu' },
  may: { query: 'msa', display: 'Malaio' },
  bul: { query: 'bul', display: 'Búlgaro' },
  hrv: { query: 'hrv', display: 'Croata' },
  srp: { query: 'srp', display: 'Sérvio' },
  slv: { query: 'slv', display: 'Esloveno' },
  slo: { query: 'slk', display: 'Eslovaco' },
  lit: { query: 'lit', display: 'Lituano' },
  lav: { query: 'lav', display: 'Letão' },
  est: { query: 'est', display: 'Estoniano' },
  wel: { query: 'cym', display: 'Galês' },
  gle: { query: 'gle', display: 'Irlandês' },
  afr: { query: 'afr', display: 'Africâner' },
  swa: { query: 'swa', display: 'Suaíli' },
  geo: { query: 'kat', display: 'Georgiano' },
  arm: { query: 'hye', display: 'Armênio' },
  alb: { query: 'sqi', display: 'Albanês' },
  mac: { query: 'mkd', display: 'Macedônio' },
  ice: { query: 'isl', display: 'Islandês' },
  mlt: { query: 'mlt', display: 'Maltês' },
  lat: { query: 'lat', display: 'Latim' },
};

/**
 * Paleta de cores distintas (legíveis sobre o mapa escuro) atribuídas
 * aos idiomas de uma obra, na ordem em que aparecem.
 */
export const LANGUAGE_COLORS = [
  '#e3b65b', // dourado
  '#e07856', // coral
  '#62b6cb', // azul-petróleo
  '#a78bda', // violeta
  '#8fbc6f', // verde-oliva
  '#e0699a', // rosa
  '#5d9de0', // azul
  '#e09a3e', // âmbar
  '#5fc9b3', // turquesa
  '#c47fc0', // orquídea
  '#b5c061', // lima
  '#d9655b', // telha
];

/**
 * Retorna uma cor estável para o idioma na posição `index`.
 * @param {number} index
 * @returns {string} Cor em hexadecimal
 */
export function getLanguageColor(index) {
  return LANGUAGE_COLORS[index % LANGUAGE_COLORS.length];
}

/**
 * Retorna as informações do idioma a partir do código ISO 639-2/B.
 * @param {string} code - Código de 3 letras (ex: "eng")
 * @returns {{ query: string, display: string } | null}
 */
export function getLanguageInfo(code) {
  if (!code) return null;
  return languageMap[code.toLowerCase()] || null;
}

/**
 * Retorna o nome de exibição em português para um código de idioma.
 * @param {string} code
 * @returns {string}
 */
export function getLanguageDisplay(code) {
  const info = getLanguageInfo(code);
  return info ? info.display : code?.toUpperCase() || 'Desconhecido';
}

/**
 * Retorna o termo de consulta para a REST Countries API (código ISO 639-3).
 * @param {string} code
 * @returns {string | null}
 */
export function getLanguageQuery(code) {
  const info = getLanguageInfo(code);
  return info ? info.query : null;
}

export default languageMap;
