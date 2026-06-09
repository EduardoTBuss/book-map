/**
 * Mapeamento de códigos ISO 639-2/B (usados pela Open Library)
 * para nomes de idioma em inglês (usados pela REST Countries API)
 * e nomes de exibição em português.
 */
const languageMap = {
  eng: { name: 'english', display: 'Inglês' },
  spa: { name: 'spanish', display: 'Espanhol' },
  por: { name: 'portuguese', display: 'Português' },
  fre: { name: 'french', display: 'Francês' },
  ger: { name: 'german', display: 'Alemão' },
  ita: { name: 'italian', display: 'Italiano' },
  rus: { name: 'russian', display: 'Russo' },
  jpn: { name: 'japanese', display: 'Japonês' },
  chi: { name: 'chinese', display: 'Chinês' },
  ara: { name: 'arabic', display: 'Árabe' },
  hin: { name: 'hindi', display: 'Hindi' },
  kor: { name: 'korean', display: 'Coreano' },
  dut: { name: 'dutch', display: 'Holandês' },
  pol: { name: 'polish', display: 'Polonês' },
  tur: { name: 'turkish', display: 'Turco' },
  swe: { name: 'swedish', display: 'Sueco' },
  nor: { name: 'norwegian', display: 'Norueguês' },
  dan: { name: 'danish', display: 'Dinamarquês' },
  fin: { name: 'finnish', display: 'Finlandês' },
  heb: { name: 'hebrew', display: 'Hebraico' },
  tha: { name: 'thai', display: 'Tailandês' },
  vie: { name: 'vietnamese', display: 'Vietnamita' },
  ukr: { name: 'ukrainian', display: 'Ucraniano' },
  rum: { name: 'romanian', display: 'Romeno' },
  cze: { name: 'czech', display: 'Tcheco' },
  gre: { name: 'greek', display: 'Grego' },
  hun: { name: 'hungarian', display: 'Húngaro' },
  cat: { name: 'catalan', display: 'Catalão' },
  ind: { name: 'indonesian', display: 'Indonésio' },
  per: { name: 'persian', display: 'Persa' },
  ben: { name: 'bengali', display: 'Bengali' },
  tam: { name: 'tamil', display: 'Tâmil' },
  urd: { name: 'urdu', display: 'Urdu' },
  may: { name: 'malay', display: 'Malaio' },
  bul: { name: 'bulgarian', display: 'Búlgaro' },
  hrv: { name: 'croatian', display: 'Croata' },
  srp: { name: 'serbian', display: 'Sérvio' },
  slv: { name: 'slovene', display: 'Esloveno' },
  slo: { name: 'slovak', display: 'Eslovaco' },
  lit: { name: 'lithuanian', display: 'Lituano' },
  lav: { name: 'latvian', display: 'Letão' },
  est: { name: 'estonian', display: 'Estoniano' },
  wel: { name: 'welsh', display: 'Galês' },
  gle: { name: 'irish', display: 'Irlandês' },
  afr: { name: 'afrikaans', display: 'Africâner' },
  swa: { name: 'swahili', display: 'Suaíli' },
  geo: { name: 'georgian', display: 'Georgiano' },
  arm: { name: 'armenian', display: 'Armênio' },
  alb: { name: 'albanian', display: 'Albanês' },
  mac: { name: 'macedonian', display: 'Macedônio' },
  ice: { name: 'icelandic', display: 'Islandês' },
  mlt: { name: 'maltese', display: 'Maltês' },
  lat: { name: 'latin', display: 'Latim' },
};

/**
 * Retorna as informações do idioma a partir do código ISO 639-2/B.
 * @param {string} code - Código de 3 letras (ex: "eng")
 * @returns {{ name: string, display: string } | null}
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
 * Retorna o nome em inglês do idioma (para uso na REST Countries API).
 * @param {string} code
 * @returns {string | null}
 */
export function getLanguageName(code) {
  const info = getLanguageInfo(code);
  return info ? info.name : null;
}

export default languageMap;
