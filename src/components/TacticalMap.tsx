import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import { MunicipalityRecord, ThreatLevel, ArmedGroupCategory, TacticalModality } from '../types/intelligence';
import {
  Crosshair,
  Shield,
  Flame,
  AlertTriangle,
  Layers,
  Globe,
  Map as MapIcon,
  Navigation,
  Search,
  Maximize2,
  FileText,
  Filter,
  Eye,
  Info,
  ExternalLink,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

interface TacticalMapProps {
  municipalities: MunicipalityRecord[];
  onSelectMunicipality: (municipality: MunicipalityRecord) => void;
  selectedMunicipality: MunicipalityRecord | null;
  onOpenModal?: (municipality: MunicipalityRecord) => void;
}

type TileLayerType = 'dark' | 'satellite' | 'street';

interface StrategicTheater {
  id: string;
  code: string;
  name: string;
  department: string;
  lat: number;
  lng: number;
  zoom: number;
  actorPrincipal: string;
}

const STRATEGIC_THEATERS: StrategicTheater[] = [
  {
    id: 'all',
    code: 'GEO-00',
    name: 'Jurisdicción Nacional',
    department: 'República de Colombia',
    lat: 4.5709,
    lng: -74.2973,
    zoom: 6,
    actorPrincipal: 'Monitoreo Global (19 Deptos)',
  },
  {
    id: 'micay',
    code: 'TEATRO I',
    name: 'Cañón del Micay',
    department: 'Cauca (Argelia / Plateado)',
    lat: 2.671,
    lng: -77.185,
    zoom: 10,
    actorPrincipal: 'EMC Carlos Patiño',
  },
  {
    id: 'catatumbo',
    code: 'TEATRO II',
    name: 'Región del Catatumbo',
    department: 'Norte de Santander (Tibú)',
    lat: 8.643,
    lng: -72.735,
    zoom: 9,
    actorPrincipal: 'ELN / Frente 33',
  },
  {
    id: 'san-juan',
    code: 'TEATRO III',
    name: 'Litoral Bajo San Juan',
    department: 'Chocó (San Juan / Baudó)',
    lat: 4.275,
    lng: -77.375,
    zoom: 9,
    actorPrincipal: 'ELN / AGC (98.18% Votación)',
  },
  {
    id: 'telembi',
    code: 'TEATRO IV',
    name: 'Triángulo del Telembí',
    department: 'Nariño (Barbacoas / Tumaco)',
    lat: 1.802,
    lng: -78.465,
    zoom: 9,
    actorPrincipal: 'Segunda Marquetalia / Oliver',
  },
  {
    id: 'uraba',
    code: 'TEATRO V',
    name: 'Nudo de Paramillo & Urabá',
    department: 'Antioquia / Córdoba',
    lat: 8.12,
    lng: -76.25,
    zoom: 8,
    actorPrincipal: 'Clan del Golfo (EGC)',
  },
  {
    id: 'arauca',
    code: 'TEATRO VI',
    name: 'Eje Fronterizo Araucano',
    department: 'Arauca (Saravena / Arauquita)',
    lat: 7.085,
    lng: -70.759,
    zoom: 9,
    actorPrincipal: 'ELN / Frente 10 EMC',
  },
  {
    id: 'guajira',
    code: 'TEATRO VII',
    name: 'Sierra Nevada & Guajira',
    department: 'La Guajira / Magdalena',
    lat: 11.24,
    lng: -73.55,
    zoom: 8,
    actorPrincipal: 'ACSN Pachenca / AGC',
  },
  {
    id: 'san-andres',
    code: 'INSULAR',
    name: 'Archipiélago San Andrés',
    department: 'San Andrés y Providencia',
    lat: 12.584,
    lng: -81.704,
    zoom: 11,
    actorPrincipal: 'Corredor Marítimo Internacional',
  },
];

export const TacticalMap: React.FC<TacticalMapProps> = ({
  municipalities,
  onSelectMunicipality,
  selectedMunicipality,
  onOpenModal,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [selectedActor, setSelectedActor] = useState<string>('all');
  const [selectedModality, setSelectedModality] = useState<string>('all');
  const [activeTileLayer, setActiveTileLayer] = useState<TileLayerType>('dark');
  const [activeTheater, setActiveTheater] = useState<string>('all');
  const [mapCoords, setMapCoords] = useState<{ lat: number; lng: number; zoom: number }>({
    lat: 4.57,
    lng: -74.3,
    zoom: 6,
  });

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersMapRef = useRef<Map<string, L.Marker>>(new Map());

  // Filter municipalities
  const filteredMunicipalities = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return municipalities.filter((m) => {
      if (selectedRegion !== 'all' && m.region !== selectedRegion) return false;
      if (selectedRisk !== 'all' && m.nivelRiesgo !== selectedRisk) return false;
      if (selectedActor !== 'all' && !m.gruposArmados.includes(selectedActor as ArmedGroupCategory)) return false;
      if (selectedModality !== 'all' && !m.modalidades.includes(selectedModality as TacticalModality)) return false;
      if (query) {
        const matchesName = m.name.toLowerCase().includes(query);
        const matchesDept = m.department.toLowerCase().includes(query);
        const matchesActor = m.gruposArmados.some((a) => a.toLowerCase().includes(query));
        const matchesSub = m.subestructuras?.some((s) => s.toLowerCase().includes(query));
        if (!matchesName && !matchesDept && !matchesActor && !matchesSub) return false;
      }
      return true;
    });
  }, [municipalities, selectedRegion, selectedRisk, selectedActor, selectedModality, searchQuery]);

  const riskPalette: Record<
    ThreatLevel,
    { fill: string; border: string; text: string; bg: string; badge: string }
  > = {
    Crítico: {
      fill: '#e11d48',
      border: '#be123c',
      text: 'text-rose-400',
      bg: 'bg-rose-950/40 border-rose-800/60',
      badge: 'bg-rose-950/60 text-rose-300 border-rose-800/80',
    },
    'Muy Alto': {
      fill: '#ea580c',
      border: '#c2410c',
      text: 'text-orange-400',
      bg: 'bg-orange-950/40 border-orange-800/60',
      badge: 'bg-orange-950/60 text-orange-300 border-orange-800/80',
    },
    Alto: {
      fill: '#d97706',
      border: '#b45309',
      text: 'text-amber-400',
      bg: 'bg-amber-950/40 border-amber-800/60',
      badge: 'bg-amber-950/60 text-amber-300 border-amber-800/80',
    },
    Moderado: {
      fill: '#059669',
      border: '#047857',
      text: 'text-emerald-400',
      bg: 'bg-emerald-950/40 border-emerald-800/60',
      badge: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80',
    },
  };

  const getTileUrl = (type: TileLayerType) => {
    switch (type) {
      case 'satellite':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'street':
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      case 'dark':
      default:
        return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    }
  };

  const getTileAttribution = (type: TileLayerType) => {
    switch (type) {
      case 'satellite':
        return '&copy; Esri, Earthstar Geographics, Maxar';
      case 'street':
        return '&copy; OpenStreetMap contributors';
      case 'dark':
      default:
        return '&copy; OpenStreetMap contributors &copy; CARTO';
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const initialCenter: [number, number] = [4.5709, -74.2973];
    const initialZoom = 6;

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      minZoom: 5,
      maxZoom: 17,
      maxBounds: [
        [-5.5, -86.0],
        [15.0, -65.0],
      ],
      zoomControl: true,
      attributionControl: true,
    });

    const tileLayer = L.tileLayer(getTileUrl('dark'), {
      attribution: getTileAttribution('dark'),
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;

    map.on('move', () => {
      const center = map.getCenter();
      setMapCoords({
        lat: center.lat,
        lng: center.lng,
        zoom: map.getZoom(),
      });
    });

    mapInstanceRef.current = map;

    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }

    const newTileLayer = L.tileLayer(getTileUrl(activeTileLayer), {
      attribution: getTileAttribution(activeTileLayer),
      subdomains: activeTileLayer === 'street' ? 'abc' : 'abcd',
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newTileLayer;
  }, [activeTileLayer]);

  // Update Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;

    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();
    markersMapRef.current.clear();

    filteredMunicipalities.forEach((muni) => {
      const { lat, lng } = muni.coordinates;
      const isSelected = selectedMunicipality?.id === muni.id;
      const isCritical = muni.nivelRiesgo === 'Crítico';
      const isHighVote = muni.porcentaje >= 90;
      const palette = riskPalette[muni.nivelRiesgo] || riskPalette.Alto;

      const size = isCritical || isSelected ? 28 : 22;
      const coreDot = isCritical || isSelected ? 12 : 9;

      // Professional Reticle / Pinpoint Icon
      const htmlIcon = `
        <div style="position: relative; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
          ${
            isCritical || isSelected
              ? `<div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; border: 1.5px solid ${palette.fill}; opacity: 0.7;"></div>`
              : ''
          }
          <div style="width: ${coreDot + 4}px; height: ${coreDot + 4}px; border-radius: 50%; background: #020617; display: flex; align-items: center; justify-content: center; border: 1.5px solid ${palette.fill}; box-shadow: 0 1px 4px rgba(0,0,0,0.8);">
            <div style="width: ${coreDot}px; height: ${coreDot}px; border-radius: 50%; background-color: ${palette.fill};"></div>
          </div>
          ${
            isHighVote
              ? `<div style="position: absolute; top: -11px; left: 50%; transform: translateX(-50%); background: #020617; border: 1px solid ${palette.fill}; color: #f8fafc; font-size: 9px; font-weight: bold; font-family: monospace; padding: 0px 4px; border-radius: 2px; white-space: nowrap; pointer-events: none;">${muni.porcentaje.toFixed(0)}%</div>`
              : ''
          }
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'tactical-div-icon',
        html: htmlIcon,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2],
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      const popupContent = `
        <div style="padding: 12px 14px; min-width: 260px; max-width: 290px; background: #0b1120; border-radius: 6px; font-family: system-ui, -apple-system, sans-serif;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 8px; border-bottom: 1px solid #1e293b; padding-bottom: 6px;">
            <span style="font-size: 10px; font-family: monospace; font-weight: 700; padding: 2px 6px; border-radius: 3px; background: ${palette.fill}20; color: ${palette.fill}; border: 1px solid ${palette.fill}50;">
              RIESGO ${muni.nivelRiesgo.toUpperCase()}
            </span>
            <span style="font-size: 12px; font-family: monospace; font-weight: 700; color: #38bdf8;">
              ${muni.porcentaje.toFixed(2)}% E-26
            </span>
          </div>

          <div style="font-size: 14px; font-weight: 700; color: #f8fafc; margin-bottom: 2px;">
            ${muni.name}
          </div>
          <div style="font-size: 11px; color: #94a3b8; font-family: monospace; margin-bottom: 8px;">
            ${muni.department} &bull; Región ${muni.region}
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; background: #020617; padding: 6px 8px; border-radius: 4px; border: 1px solid #1e293b; margin-bottom: 8px; font-size: 11px;">
            <div>
              <div style="color: #64748b; font-size: 9px; font-family: monospace;">MESAS:</div>
              <div style="color: #e2e8f0; font-weight: 600; font-family: monospace;">${muni.mesas}</div>
            </div>
            <div>
              <div style="color: #64748b; font-size: 9px; font-family: monospace;">SUFRAGIOS:</div>
              <div style="color: #e2e8f0; font-weight: 600; font-family: monospace;">${muni.votos.toLocaleString()}</div>
            </div>
          </div>

          <div style="font-size: 10.5px; color: #cbd5e1; line-height: 1.35; margin-bottom: 8px;">
            <strong style="color: #fda4af;">Actores:</strong> ${muni.gruposArmados.slice(0, 2).join(', ')}
          </div>

          <button id="btn-popup-select-${muni.id}" style="width: 100%; padding: 6px 8px; border-radius: 4px; background: #1e293b; color: #f8fafc; font-size: 11px; font-weight: 600; border: 1px solid #334155; cursor: pointer; text-align: center; transition: all 0.15s ease;">
            Examinar Ficha de Inteligencia &rarr;
          </button>
        </div>
      `;

      marker.bindPopup(popupContent, {
        closeButton: true,
        autoPan: true,
        maxWidth: 320,
      });

      marker.bindTooltip(
        `<b>${muni.name}</b> (${muni.department}) &bull; ${muni.porcentaje.toFixed(1)}% &bull; ${muni.nivelRiesgo}`,
        {
          direction: 'top',
          offset: [0, -12],
          opacity: 0.95,
        }
      );

      marker.on('click', () => {
        onSelectMunicipality(muni);
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-popup-select-${muni.id}`);
        if (btn) {
          btn.onclick = () => {
            onSelectMunicipality(muni);
          };
        }
      });

      layerGroup.addLayer(marker);
      markersMapRef.current.set(muni.id, marker);
    });
  }, [filteredMunicipalities, selectedMunicipality, onSelectMunicipality]);

  // Fly to selected municipality
  useEffect(() => {
    if (!selectedMunicipality || !mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    const { lat, lng } = selectedMunicipality.coordinates;

    map.flyTo([lat, lng], 10, {
      duration: 1.1,
      easeLinearity: 0.25,
    });

    setTimeout(() => {
      const marker = markersMapRef.current.get(selectedMunicipality.id);
      if (marker && mapInstanceRef.current) {
        marker.openPopup();
      }
    }, 1200);
  }, [selectedMunicipality]);

  const handleTheaterJump = (theater: StrategicTheater) => {
    setActiveTheater(theater.id);
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([theater.lat, theater.lng], theater.zoom, {
      duration: 1.1,
    });
  };

  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredMunicipalities.length > 0) {
      const first = filteredMunicipalities[0];
      onSelectMunicipality(first);
    }
  };

  return (
    <div id="tactical-map-container" className="space-y-4">
      {/* Institutional Mission Control Toolbar */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/90 p-4 shadow-sm backdrop-blur-md">
        {/* Row 1: Header + Layer Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/60 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-200 border border-slate-700">
              <Crosshair className="h-4 w-4 text-rose-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                  SISTEMA DE GEOINTELIGENCIA CARTOGRÁFICA
                </h2>
                <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300 border border-slate-700">
                  {filteredMunicipalities.length} / {municipalities.length} UNIDADES TERRITORIALES
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Cartografía Oficial Georreferenciada con Coordenadas WGS-84 y Registro E-26
              </p>
            </div>
          </div>

          {/* Cartographic Base Layer Switcher */}
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-slate-800 bg-slate-950 p-0.5 text-xs font-mono">
              <button
                id="layer-dark"
                onClick={() => setActiveTileLayer('dark')}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 transition-all ${
                  activeTileLayer === 'dark'
                    ? 'bg-slate-800 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Capa Cartográfica Nocturna de Alto Contraste (CARTO Dark Matter)"
              >
                <Layers className="h-3 w-3" />
                <span>Táctico</span>
              </button>

              <button
                id="layer-satellite"
                onClick={() => setActiveTileLayer('satellite')}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 transition-all ${
                  activeTileLayer === 'satellite'
                    ? 'bg-slate-800 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Ortofotografía Satelital Real de Alta Resolución (Esri World Imagery)"
              >
                <Globe className="h-3 w-3" />
                <span>Satélite Real</span>
              </button>

              <button
                id="layer-street"
                onClick={() => setActiveTileLayer('street')}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 transition-all ${
                  activeTileLayer === 'street'
                    ? 'bg-slate-800 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Red Vial Nacional y Cabeceras Municipales (OpenStreetMap)"
              >
                <MapIcon className="h-3 w-3" />
                <span>Red Vial</span>
              </button>
            </div>

            <button
              id="btn-recenter-colombia"
              onClick={() => handleTheaterJump(STRATEGIC_THEATERS[0])}
              className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs font-mono text-slate-300 hover:border-slate-700 hover:text-white transition-colors"
              title="Restablecer Encuadre Nacional de Colombia"
            >
              <RotateCcw className="h-3 w-3 text-slate-400" />
              <span>Encuadre Nacional</span>
            </button>
          </div>
        </div>

        {/* Row 2: Search Input & Theater Jump Corridor */}
        <div className="mt-3 flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
          {/* Quick Search */}
          <form onSubmit={handleQuickSearchSubmit} className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              id="input-map-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por municipio, departamento o grupo armado..."
              className="w-full rounded-lg border border-slate-800 bg-slate-950 pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none font-sans"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 hover:text-white"
              >
                Limpiar
              </button>
            )}
          </form>

          {/* Strategic Theaters Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-[10px] font-mono text-slate-400 uppercase whitespace-nowrap flex items-center gap-1">
              <Navigation className="h-3 w-3 text-slate-500" />
              Teatros Operacionales:
            </span>
            {STRATEGIC_THEATERS.map((theater) => (
              <button
                key={theater.id}
                id={`btn-theater-${theater.id}`}
                onClick={() => handleTheaterJump(theater)}
                className={`rounded-md px-2 py-1 text-[11px] whitespace-nowrap transition-all border font-mono ${
                  activeTheater === theater.id
                    ? 'border-slate-600 bg-slate-800 text-white font-semibold'
                    : 'border-slate-800/80 bg-slate-950/70 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <span>{theater.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Row 3: Standard Intelligence Dropdowns */}
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 text-xs font-sans">
          <div>
            <label className="block text-[11px] text-slate-400 font-semibold mb-1 font-mono">
              REGIÓN GEOGRÁFICA:
            </label>
            <select
              id="filter-map-region"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-slate-200 focus:border-slate-600 focus:outline-none text-xs"
            >
              <option value="all">Todas las Regiones (Nacional)</option>
              <option value="Caribe">Caribe (7 Dptos)</option>
              <option value="Pacífico">Pacífico (Chocó, Valle)</option>
              <option value="Andina Suroccidente">Andina Suroccidente (Cauca, Nariño)</option>
              <option value="Amazonía-Orinoquía">Amazonía - Orinoquía (Fronteras)</option>
              <option value="Insular">Insular (San Andrés y Prov.)</option>
              <option value="Capital">Capital (Bogotá D.C.)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 font-semibold mb-1 font-mono">
              NIVEL DE AMENAZA:
            </label>
            <select
              id="filter-map-risk"
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-slate-200 focus:border-slate-600 focus:outline-none text-xs"
            >
              <option value="all">Todos los Niveles de Riesgo</option>
              <option value="Crítico">Nivel Crítico (&gt;85% Votos o Combates)</option>
              <option value="Muy Alto">Nivel Muy Alto</option>
              <option value="Alto">Nivel Alto</option>
              <option value="Moderado">Nivel Moderado</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 font-semibold mb-1 font-mono">
              ACTOR ARMADO ILEGAL:
            </label>
            <select
              id="filter-map-actor"
              value={selectedActor}
              onChange={(e) => setSelectedActor(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-slate-200 focus:border-slate-600 focus:outline-none text-xs"
            >
              <option value="all">Todas las Organizaciones Armadas</option>
              <option value="Clan del Golfo / AGC">Clan del Golfo / AGC</option>
              <option value="Disidencias FARC (Iván Mordisco / EMC)">Disidencias FARC (Iván Mordisco / EMC)</option>
              <option value="Disidencias FARC (Calarcá / Suárez Briceño)">Disidencias FARC (Calarcá)</option>
              <option value="ELN">ELN (Ejército de Liberación Nacional)</option>
              <option value="Segunda Marquetalia">Segunda Marquetalia</option>
              <option value="Comandos de Frontera (CDF)">Comandos de Frontera (CDF)</option>
              <option value="ACSN (Los Pachenca)">ACSN (Los Pachenca)</option>
              <option value="GDOs Urbanos (Costeños/Pepes/Inmaculada/Flacos)">GDOs Urbanos</option>
              <option value="Comuneros del Sur / AUN">Comuneros del Sur / AUN</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 font-semibold mb-1 font-mono">
              MODALIDAD DELICTIVA:
            </label>
            <select
              id="filter-map-modality"
              value={selectedModality}
              onChange={(e) => setSelectedModality(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-slate-200 focus:border-slate-600 focus:outline-none text-xs"
            >
              <option value="all">Todas las Modalidades Tácticas</option>
              <option value="Uso de Drones con Explosivos">Drones con Explosivos (AEI)</option>
              <option value="Salida Marítima / Lanchas Go-Fast">Salida Marítima / Go-Fast</option>
              <option value="Semisumergibles">Artefactos Semisumergibles</option>
              <option value="Minería Ilegal de Oro">Minería Ilegal de Oro</option>
              <option value="Confinamiento y Paros Armados">Confinamiento y Paros Armados</option>
              <option value="Reclutamiento Forzado de Menores">Reclutamiento Forzado de Menores</option>
              <option value="Corredores Fluviales Estratégicos">Corredores Fluviales</option>
              <option value="Ataques a Infraestructura">Ataques a Infraestructura</option>
              <option value="Extorsión Comercial y Servicios">Extorsión Comercial</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Real Map + SITREP Side Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Real Leaflet Map Container */}
        <div className="lg:col-span-8 rounded-xl border border-slate-800 bg-slate-950 p-2 relative overflow-hidden shadow-xl flex flex-col">
          {/* Top HUD Telemetry Bar */}
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2 px-2 text-[11px] font-mono text-slate-400 border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              <span className="text-slate-300 font-semibold">CARTOGRAFÍA WGS-84</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">
                LAT: {mapCoords.lat.toFixed(3)}° &bull; LNG: {mapCoords.lng.toFixed(3)}°
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">ZOOM: {mapCoords.zoom}x</span>
            </div>

            {/* Severity Legend */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                <span className="text-slate-300">Crítico (&gt;85%)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                <span className="text-slate-300">Muy Alto</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                <span className="text-slate-300">Alto</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                <span className="text-slate-300">Moderado</span>
              </div>
            </div>
          </div>

          {/* Leaflet Mount Element */}
          <div
            id="real-colombia-leaflet-map"
            ref={mapContainerRef}
            className="w-full h-[620px] rounded-lg border border-slate-800/80 z-0 overflow-hidden relative shadow-inner"
            style={{ minHeight: '580px' }}
          />

          {/* Bottom Telemetry Note */}
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 px-2 text-[11px] font-mono text-slate-500 border-t border-slate-800/80 pt-2">
            <div>
              Haga clic sobre un objetivo para desplegar su expediente analítico de seguridad y auditoría electoral.
            </div>
            <div>
              Fuentes Oficiales: Registraduría Nacional del Estado Civil &bull; Defensoría del Pueblo (SAT)
            </div>
          </div>
        </div>

        {/* Selected Intelligence Focus Panel (Executive SITREP) */}
        <div className="lg:col-span-4 flex flex-col space-y-3">
          {selectedMunicipality ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg backdrop-blur-md space-y-4">
              {/* Card Classification Header */}
              <div className="border-b border-slate-800 pb-3">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-300 border border-slate-700">
                    SITREP REF: COL-{selectedMunicipality.id.toUpperCase()}
                  </span>
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-mono font-semibold ${
                      riskPalette[selectedMunicipality.nivelRiesgo].badge
                    }`}
                  >
                    NIVEL {selectedMunicipality.nivelRiesgo.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white font-sans">
                  {selectedMunicipality.name}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {selectedMunicipality.department} &bull; Región {selectedMunicipality.region}
                </p>
              </div>

              {/* Electoral Audit Snapshot */}
              <div className="rounded-lg bg-slate-950 p-3 border border-slate-800/80 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-slate-400 font-mono text-[11px]">CONCENTRACIÓN ELECTORAL:</span>
                  <span className="font-mono text-base font-bold text-sky-400">
                    {selectedMunicipality.porcentaje.toFixed(2)}%
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 block font-mono">Mesas Auditadas:</span>
                    <span className="font-mono font-semibold text-slate-200">
                      {selectedMunicipality.mesas} mesas
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-mono">Sufragios E-26:</span>
                    <span className="font-mono font-semibold text-slate-200">
                      {selectedMunicipality.votos.toLocaleString()} votos
                    </span>
                  </div>
                </div>
              </div>

              {/* Armed Actors */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-mono flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-rose-400" />
                  Actores Armados Operativos
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedMunicipality.gruposArmados.map((actor, idx) => (
                    <span
                      key={idx}
                      className="rounded bg-rose-950/40 px-2 py-0.5 text-xs text-rose-300 border border-rose-800/50 font-sans"
                    >
                      {actor}
                    </span>
                  ))}
                </div>
              </div>

              {/* Subestructuras & Frentes */}
              {selectedMunicipality.subestructuras && selectedMunicipality.subestructuras.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
                    Frentes y Estructuras Identificadas
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedMunicipality.subestructuras.map((sub, idx) => (
                      <span
                        key={idx}
                        className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300 border border-slate-700"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tactical Modalities */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-mono flex items-center gap-1.5">
                  <Flame className="h-3.5 w-3.5 text-amber-400" />
                  Modalidades Delictivas Registradas
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedMunicipality.modalidades.map((mod, idx) => (
                    <span
                      key={idx}
                      className="rounded bg-amber-950/30 px-2 py-0.5 text-[11px] text-amber-300 border border-amber-800/40 font-sans"
                    >
                      {mod}
                    </span>
                  ))}
                </div>
              </div>

              {/* Strategic Position */}
              <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs">
                <span className="font-bold text-slate-300 block mb-1 font-mono text-[11px]">
                  POSICIÓN GEOESTRATÉGICA:
                </span>
                <p className="text-slate-400 leading-relaxed font-sans text-xs">
                  {selectedMunicipality.posicionGeoestrategica}
                </p>
              </div>

              {/* Public Order Analysis */}
              <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs">
                <span className="font-bold text-rose-300 block mb-1 font-mono text-[11px] flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                  DIAGNÓSTICO DE ORDEN PÚBLICO:
                </span>
                <p className="text-slate-300 leading-relaxed font-sans text-xs text-justify">
                  {selectedMunicipality.analisisOrdenPublico}
                </p>
              </div>

              {/* Classified SAT Alert */}
              {selectedMunicipality.alertasDestacadas && (
                <div className="rounded-lg border border-amber-800/40 bg-amber-950/20 p-2.5 text-xs text-amber-200">
                  <span className="font-bold block text-[10px] font-mono text-amber-300 mb-0.5">
                    ALERTA TEMPRANA DEFENSORÍA DEL PUEBLO (SAT):
                  </span>
                  <p className="text-[11px] text-amber-100 font-sans">
                    {selectedMunicipality.alertasDestacadas}
                  </p>
                </div>
              )}

              {/* Full Modal Trigger */}
              {onOpenModal && (
                <button
                  id="btn-open-dossier-modal"
                  onClick={() => onOpenModal(selectedMunicipality)}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-2 text-xs font-semibold text-white border border-slate-700 transition-colors font-sans shadow-sm"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-slate-300" />
                  <span>Ampliar Expediente Completo</span>
                </button>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-6 text-center flex flex-col items-center justify-center h-full min-h-[380px] text-slate-400">
              <Crosshair className="h-9 w-9 text-slate-600 mb-3" />
              <h4 className="text-sm font-bold text-slate-200 font-sans">
                Panel de Ficha SITREP
              </h4>
              <p className="text-xs text-slate-400 mt-2 max-w-xs font-sans">
                Seleccione un foco territorial en la cartografía o utilice el buscador superior para examinar el expediente de seguridad y la auditoría de votación oficial.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-1.5 max-w-xs text-[10px] font-mono">
                <span className="rounded bg-slate-800/70 px-2 py-0.5 text-slate-400 border border-slate-700/50">
                  Cañón del Micay
                </span>
                <span className="rounded bg-slate-800/70 px-2 py-0.5 text-slate-400 border border-slate-700/50">
                  Catatumbo
                </span>
                <span className="rounded bg-slate-800/70 px-2 py-0.5 text-slate-400 border border-slate-700/50">
                  Bajo San Juan
                </span>
                <span className="rounded bg-slate-800/70 px-2 py-0.5 text-slate-400 border border-slate-700/50">
                  Telembí
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
