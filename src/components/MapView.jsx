import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import './MapView.css';

// GeoJSON mundial (ids ISO 3166-1 alpha-3, mesmos do campo cca3 da REST Countries)
let worldGeoPromise = null;
function loadWorldGeo() {
  if (!worldGeoPromise) {
    worldGeoPromise = fetch('/data/world-countries.geo.json').then((r) => {
      if (!r.ok) throw new Error('Falha ao carregar o GeoJSON mundial');
      return r.json();
    });
  }
  return worldGeoPromise;
}

function formatPopulation(pop) {
  if (!pop) return 'N/A';
  if (pop >= 1_000_000_000) return (pop / 1_000_000_000).toFixed(1) + ' bi';
  if (pop >= 1_000_000) return (pop / 1_000_000).toFixed(1) + ' mi';
  if (pop >= 1_000) return (pop / 1_000).toFixed(1) + ' mil';
  return pop.toString();
}

// Ajusta o enquadramento do mapa aos países pintados
function MapUpdater({ positions }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length === 0) {
      map.flyTo([22, 8], 2.2, { duration: 1.4 });
      return;
    }

    if (positions.length === 1) {
      map.flyTo(positions[0], 5, { duration: 1.4 });
      return;
    }

    map.flyToBounds(L.latLngBounds(positions), {
      padding: [60, 60],
      maxZoom: 5,
      duration: 1.4,
    });
  }, [positions, map]);

  return null;
}

function MapView({ languageLayers, loadingCountries }) {
  const [worldGeo, setWorldGeo] = useState(null);
  const [hiddenLanguages, setHiddenLanguages] = useState(new Set());

  useEffect(() => {
    let mounted = true;
    loadWorldGeo()
      .then((geo) => mounted && setWorldGeo(geo))
      .catch((err) => console.error(err));
    return () => {
      mounted = false;
    };
  }, []);

  // Ao trocar de obra, todas as camadas voltam visíveis
  const [prevLayers, setPrevLayers] = useState(languageLayers);
  if (prevLayers !== languageLayers) {
    setPrevLayers(languageLayers);
    setHiddenLanguages(new Set());
  }

  /**
   * cca3 → { color, languages[], country } considerando as camadas visíveis.
   * A cor vem do primeiro idioma da obra que pinta aquele país.
   */
  const paintedCountries = useMemo(() => {
    const map = new Map();
    for (const layer of languageLayers) {
      if (hiddenLanguages.has(layer.code)) continue;
      for (const country of layer.countries) {
        if (!country.cca3) continue;
        if (!map.has(country.cca3)) {
          map.set(country.cca3, { color: layer.color, languages: [], country });
        }
        map.get(country.cca3).languages.push(layer.display);
      }
    }
    return map;
  }, [languageLayers, hiddenLanguages]);

  const fitPositions = useMemo(
    () =>
      [...paintedCountries.values()]
        .map(({ country }) => country.latlng)
        .filter((ll) => ll && ll.length === 2 && !isNaN(ll[0]) && !isNaN(ll[1])),
    [paintedCountries]
  );

  // Força o re-render do layer GeoJSON quando a pintura muda
  const paintKey = useMemo(
    () =>
      languageLayers.map((l) => `${l.code}:${l.color}`).join('|') +
      '#' +
      [...hiddenLanguages].join(','),
    [languageLayers, hiddenLanguages]
  );

  const styleFeature = (feature) => {
    const entry = paintedCountries.get(feature.id);
    if (!entry) {
      return {
        fillColor: 'transparent',
        fillOpacity: 0,
        color: 'rgba(214, 186, 120, 0.10)',
        weight: 0.5,
      };
    }
    return {
      fillColor: entry.color,
      fillOpacity: 0.5,
      color: entry.color,
      weight: 1.2,
      opacity: 0.9,
    };
  };

  const onEachFeature = (feature, layer) => {
    const entry = paintedCountries.get(feature.id);
    if (!entry) return;

    const { country, languages } = entry;
    const name = country.name?.common || feature.properties?.name || 'País';
    const flag = country.flags?.svg
      ? `<img class="geo-tip-flag" src="${country.flags.svg}" alt="" />`
      : '';
    const capital = country.capital?.[0]
      ? `<div class="geo-tip-row"><span>Capital</span>${country.capital[0]}</div>`
      : '';
    const region = country.subregion || country.region
      ? `<div class="geo-tip-row"><span>Região</span>${country.subregion || country.region}</div>`
      : '';

    layer.bindTooltip(
      `<div class="geo-tip">
        <div class="geo-tip-header">${flag}<strong>${name}</strong></div>
        ${capital}
        ${region}
        <div class="geo-tip-row"><span>População</span>${formatPopulation(country.population)}</div>
        <div class="geo-tip-langs">${languages.join(' · ')}</div>
      </div>`,
      { sticky: true, className: 'geo-tooltip', direction: 'top', opacity: 1 }
    );

    layer.on({
      mouseover: (e) => e.target.setStyle({ fillOpacity: 0.75, weight: 2 }),
      mouseout: (e) => e.target.setStyle({ fillOpacity: 0.5, weight: 1.2 }),
    });
  };

  const toggleLanguage = (code) => {
    setHiddenLanguages((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const hasLayers = languageLayers.length > 0;
  const showOverlay = !hasLayers && !loadingCountries;

  return (
    <div className="map-container">
      <MapContainer
        center={[22, 8]}
        zoom={2.2}
        minZoom={2}
        zoomControl={false}
        style={{ width: '100%', height: '100%' }}
        worldCopyJump={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <MapUpdater positions={fitPositions} />

        {worldGeo && hasLayers && (
          <GeoJSON
            key={paintKey}
            data={worldGeo}
            style={styleFeature}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>

      {/* Legend: um chip por idioma da obra, clicável para ocultar/exibir */}
      {hasLayers && (
        <div className="map-legend">
          <div className="map-legend-title">Idiomas da obra</div>
          <div className="map-legend-list">
            {languageLayers.map((layer) => {
              const hidden = hiddenLanguages.has(layer.code);
              return (
                <button
                  key={layer.code}
                  type="button"
                  className={`map-legend-chip ${hidden ? 'hidden' : ''} ${layer.countries.length === 0 ? 'empty' : ''}`}
                  onClick={() => toggleLanguage(layer.code)}
                  title={hidden ? 'Exibir no mapa' : 'Ocultar do mapa'}
                >
                  <span className="map-legend-dot" style={{ background: layer.color }} />
                  <span className="map-legend-name">{layer.display}</span>
                  <span className="map-legend-count">{layer.countries.length}</span>
                </button>
              );
            })}
          </div>
          <div className="map-legend-total">
            {paintedCountries.size} país{paintedCountries.size !== 1 ? 'es' : ''} pintado{paintedCountries.size !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      {/* Overlay when no countries */}
      {showOverlay && (
        <div className="map-overlay">
          <div className="map-overlay-content">
            <span className="map-overlay-glyph">✦</span>
            <div className="map-overlay-text">Selecione uma obra</div>
            <div className="map-overlay-subtext">
              Os países serão pintados por idioma de disponibilidade
            </div>
          </div>
        </div>
      )}

      {/* Loading indicator on map */}
      {loadingCountries && (
        <div className="map-loading">
          <div className="map-loading-spinner" />
          <span className="map-loading-text">Cartografando idiomas…</span>
        </div>
      )}
    </div>
  );
}

export default MapView;
