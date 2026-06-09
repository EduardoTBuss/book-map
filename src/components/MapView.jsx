import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import './MapView.css';

// Custom colored marker icon
function createCustomIcon() {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 14px;
      height: 14px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 50%;
      border: 2.5px solid rgba(255,255,255,0.9);
      box-shadow: 0 0 12px rgba(102, 126, 234, 0.6), 0 2px 6px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -10],
  });
}

// Component to auto-fit map bounds when countries change
function MapUpdater({ countries }) {
  const map = useMap();
  const prevCountriesRef = useRef([]);

  useEffect(() => {
    if (countries.length === 0) {
      // Reset to world view
      if (prevCountriesRef.current.length > 0) {
        map.flyTo([20, 0], 2, { duration: 1.5 });
      }
      prevCountriesRef.current = countries;
      return;
    }

    const validCountries = countries.filter(
      (c) => c.latlng && c.latlng.length === 2 && !isNaN(c.latlng[0]) && !isNaN(c.latlng[1])
    );

    if (validCountries.length === 0) return;

    if (validCountries.length === 1) {
      map.flyTo(validCountries[0].latlng, 5, { duration: 1.5 });
    } else {
      const bounds = L.latLngBounds(validCountries.map((c) => c.latlng));
      map.flyToBounds(bounds, {
        padding: [50, 50],
        maxZoom: 6,
        duration: 1.5,
      });
    }

    prevCountriesRef.current = countries;
  }, [countries, map]);

  return null;
}

function formatPopulation(pop) {
  if (!pop) return 'N/A';
  if (pop >= 1_000_000_000) return (pop / 1_000_000_000).toFixed(1) + 'B';
  if (pop >= 1_000_000) return (pop / 1_000_000).toFixed(1) + 'M';
  if (pop >= 1_000) return (pop / 1_000).toFixed(1) + 'K';
  return pop.toString();
}

function MapView({ countries, loadingCountries, languageDisplay }) {
  const customIcon = createCustomIcon();
  const showOverlay = countries.length === 0 && !loadingCountries;

  return (
    <div className="map-container">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        zoomControl={false}
        style={{ width: '100%', height: '100%' }}
        worldCopyJump={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <MapUpdater countries={countries} />

        {countries.map((country, index) => {
          if (!country.latlng || country.latlng.length !== 2) return null;

          return (
            <Marker
              key={`${country.name?.common || index}`}
              position={country.latlng}
              icon={customIcon}
            >
              <Popup>
                <div className="country-popup">
                  {country.flags?.svg && (
                    <img
                      className="country-popup-flag"
                      src={country.flags.svg}
                      alt={`Bandeira de ${country.name?.common}`}
                    />
                  )}
                  <div className="country-popup-name">
                    {country.name?.common || 'País desconhecido'}
                  </div>
                  <div className="country-popup-detail">
                    {country.capital?.[0] && <>Capital: {country.capital[0]}<br /></>}
                    {country.region && <>Região: {country.region}<br /></>}
                    {country.subregion && <>Sub-região: {country.subregion}<br /></>}
                    Pop: {formatPopulation(country.population)}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Overlay when no countries */}
      {showOverlay && (
        <div className="map-overlay">
          <div className="map-overlay-content">
            <span className="map-overlay-icon">🌍</span>
            <div className="map-overlay-text">Selecione um livro</div>
            <div className="map-overlay-subtext">
              Os países do idioma da obra serão exibidos no mapa
            </div>
          </div>
        </div>
      )}

      {/* Loading indicator on map */}
      {loadingCountries && (
        <div className="map-loading">
          <div className="map-loading-spinner" />
          <span className="map-loading-text">Buscando países...</span>
        </div>
      )}

      {/* Info bar showing current language/count */}
      {countries.length > 0 && languageDisplay && (
        <div className="map-info-bar">
          🌐 <strong>{languageDisplay}</strong> — {countries.length} país{countries.length !== 1 ? 'es' : ''}
        </div>
      )}
    </div>
  );
}

export default MapView;
