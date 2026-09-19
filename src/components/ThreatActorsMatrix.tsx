import React, { useState } from 'react';
import { ArmedGroupCategory } from '../types/intelligence';
import {
  ShieldAlert,
  Flame,
  Radio,
  Crosshair,
  MapPin,
  Anchor,
  Plane,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ActorProfile {
  name: ArmedGroupCategory;
  alias: string;
  commanders: string;
  theaterOfOperations: string;
  strengthEstimate: string;
  primarySubstructures: string[];
  tacticalModalities: string[];
  strategicObjective: string;
  electoralInterferencePattern: string;
  riskBadgeColor: string;
}

export const ThreatActorsMatrix: React.FC = () => {
  const [expandedActor, setExpandedActor] = useState<string | null>('Clan del Golfo / AGC');

  const actors: ActorProfile[] = [
    {
      name: 'Clan del Golfo / AGC',
      alias: 'Ejército Gaitanista de Colombia (EGC) / Clan del Golfo',
      commanders: 'Estado Mayor Central AGC (Chiquito Malo, Gonzalito, Siopas †)',
      theaterOfOperations: 'Urabá antioqueño y chocoano, Córdoba, Sucre, Bolívar, Atlántico, Magdalena, La Guajira, Valle.',
      strengthEstimate: '6.000+ combatientes en armas y redes de apoyo urbano sicariales',
      primarySubstructures: [
        'Subestructura Manuel José Gaitán (Hegemonía en Sucre y Montes de María)',
        'Subestructura Rubén Darío Ávila (Nudo de Paramillo y sur de Córdoba)',
        'Subestructura Javier Yepes Cantero (Sinú medio y bajo)',
        'Subestructura Zuley Guerra Castro (Costanera y Golfo de Morrosquillo)',
        'Subestructura Carlos Daniel Fulaye Vargas (Atlántico y Canal del Dique)',
        'Subestructura Sergio Antonio Carrascal Gómez (Barranquilla y puertos)',
        'Subestructura Nicolás Antonio Urango Reyes (Cartagena y Turbaco)',
        'Subestructura Jhon Fredy Orejuela (Chocó y Bajo Atrato)',
        'Subestructura Uldar Cardona Rueda (La Mojana)',
        'Subestructura Erlin Pino Duarte (Serranía de San Lucas)'
      ],
      tacticalModalities: [
        'Salidas masivas con lanchas rápidas go-fast hacia Centroamérica',
        'Extorsión generalizada y tasada al sector agropecuario, ganadero e inmobiliario',
        'Tercerización armada con bandas satélites urbanas (Los Costeños, Los Pepes)',
        'Paros armados relámpago con paralización total de comercio y transporte',
        'Acopio y contrabando de armas pesadas a través de puertos menores'
      ],
      strategicObjective: 'Consolidación del monopolio de la salida de cocaína en las costas Caribe y Pacífica, cooptación de rentas públicas municipales y control social hegemónico.',
      electoralInterferencePattern: 'Control de la movilidad en áreas rurales; coacción sobre jurados y testigos; constreñimiento a presidentes de Juntas de Acción Comunal en Sucre y Córdoba.',
      riskBadgeColor: 'border-rose-800 bg-rose-950/40 text-rose-300',
    },
    {
      name: 'Disidencias FARC (Iván Mordisco / EMC)',
      alias: 'Estado Mayor Central de las FARC-EP (Bloque Occidental Jacobo Arenas)',
      commanders: 'Iván Lozada / Iván Mordisco, Walter Mendoza, alias Cholinga, Sebastián',
      theaterOfOperations: 'Cauca (Cañón del Micay, Norte y Macizo), Valle del Cauca (Jamundí, Dagua, Buga), Nariño, Putumayo, Vaupés, Guaviare.',
      strengthEstimate: '4.500+ hombres en armas con unidades móviles tecnificadas',
      primarySubstructures: [
        'Frente Jaime Martínez (Jamundí, Dagua, Morales, Cajibío, López de Micay)',
        'Frente Carlos Patiño (Argelia, El Plateado, Balboa, Cañón del Micay)',
        'Frente Dagoberto Ramos (Toribío, Corinto, Caloto, Miranda, Florida, Pradera)',
        'Frente Rafael Aguilera (Litoral pacífico de Cauca y Nariño)',
        'Frente Carolina Ramírez (Putumayo y cuenca amazónica)',
        'Frente Franco Benavides (Cordillera nariñense)',
        'Frente Armando Ríos (Vaupés y Guainía)'
      ],
      tacticalModalities: [
        'Guerra asimétrica con enjambres de drones acondicionados con explosivos (AEI)',
        'Campos minados masivos protegiendo enclaves cocaleros y laboratorios',
        'Asonadas obligadas con instrumentalización de campesinos para expulsar al Ejército',
        'Retenes ilegales con carnetización forzada de habitantes rurales',
        'Reclutamiento infantil sistemático en resguardos indígenas e internados'
      ],
      strategicObjective: 'Preservar el santuario cocalero del Cañón del Micay y la salida fluvio-marítima al Pacífico, aislando a las Fuerzas Militares mediante guerra tecnológica de drones.',
      electoralInterferencePattern: 'Votaciones anómalas superiores al 85%-95% en municipios con presencia absoluta; intimidación a misiones de observación electoral; prohibición de campañas no afines.',
      riskBadgeColor: 'border-red-800 bg-red-950/40 text-red-300',
    },
    {
      name: 'Disidencias FARC (Calarcá / Suárez Briceño)',
      alias: 'Bloque Jorge Suárez Briceño / Frente 57 Yair Bermúdez',
      commanders: 'Alexander Díaz Mendoza alias Calarcá Córdoba, alias Andrey Avendaño',
      theaterOfOperations: 'Caquetá, Huila, Meta, Guaviare, y fracturas en Valle del Cauca (Pradera, Florida, Buga).',
      strengthEstimate: '2.500+ hombres divididos tras la escisión del EMC de Mordisco',
      primarySubstructures: [
        'Frente 57 Yair Bermúdez (Guerra a muerte contra Dagoberto Ramos en Valle/Cauca)',
        'Frente Rodrigo Cadete (Caquetá y Huila)',
        'Bloque Magdalena Medio',
        'Comisión Marco Aurelio Buendía'
      ],
      tacticalModalities: [
        'Macroextorsión ganadera con boletas de citación a campamentos en Caquetá',
        'Carnetización veredal y cobro por cabeza de ganado y hectárea cultivada',
        'Combates fratricidas intensos contra las tropas de Iván Mordisco',
        'Ataques sicariales dirigidos a excombatientes y autoridades locales'
      ],
      strategicObjective: 'Control de la frontera agropecuaria y la cuenca de la Amazonía, intermediación con autoridades locales y legitimación en mesas de negociación política.',
      electoralInterferencePattern: 'Control del censo rural a través de carnets comunales; imposición de cuotas a candidatos y veto a fuerzas opositoras en Caquetá y Huila.',
      riskBadgeColor: 'border-orange-800 bg-orange-950/40 text-orange-300',
    },
    {
      name: 'ELN',
      alias: 'Ejército de Liberación Nacional (COCE / Frentes de Guerra)',
      commanders: 'Antonio García, Pablo Beltrán, alias Uriel (†), alias Gerson',
      theaterOfOperations: 'Chocó (San Juan, Baudó, Atrato), Cauca, Nariño, Serranía de San Lucas (Bolívar), Arauca, Catatumbo.',
      strengthEstimate: '3.800+ guerrilleros en armas y frentes milicianos urbanos',
      primarySubstructures: [
        'Frente de Guerra Occidental Ogli Padilla (Chocó)',
        'Frente Ernesto Che Guevara (Cuenca del San Juan)',
        'Frente Manuel Vásquez Castaño (Sur de Cauca y norte de Nariño)',
        'Frente Luis José Solano Sepúlveda (Serranía de San Lucas, Bolívar)',
        'Compañía Néstor Tulio Durán (Pacífico norte chocoano)'
      ],
      tacticalModalities: [
        'Paros armados indefinidos con confinamiento forzado de comunidades étnicas',
        'Siembra intensiva de minas antipersonal (MAP) en trochas y caminos escolares',
        'Secuestros extorsivos y peajes fluviales sobre embarcaciones civiles',
        'Extorsión y control de maquinaria en entables de minería ilegal de oro'
      ],
      strategicObjective: 'Mantener el dominio de corredores interoceánicos entre el río Atrato y el Océano Pacífico, explotando vetas de oro para financiamiento bélico.',
      electoralInterferencePattern: 'Confinamiento de pueblos enteros que impide el desplazamiento a mesas de votación; voto condicionado en cabildos y consejos comunitarios.',
      riskBadgeColor: 'border-amber-800 bg-amber-950/40 text-amber-300',
    },
    {
      name: 'Segunda Marquetalia',
      alias: 'Segunda Marquetalia - Coordinadora Guerrillera del Pacífico',
      commanders: 'Iván Márquez, Walter Mendoza, alias Allende (Pacífico nariñense)',
      theaterOfOperations: 'Nariño (Telembí, Sanquianga, Tumaco), Putumayo, Guainía (frontera con Venezuela), Cauca.',
      strengthEstimate: '1.800+ combatientes especializados en operaciones navales y fronterizas',
      primarySubstructures: [
        'Frente Oliver Sinisterra (Tumaco y Nariño costero)',
        'Estructura Alfonso Cano (Bocas de Satinga, Mosquera, Salahonda)',
        'Frente Iván Ríos (Samaniego y piedemonte)',
        'Estructura Diomer Cortés (Límites de Cauca y Nariño)',
        'Frente Acacio Medina (Guainía y minería de coltán en frontera venezolana)'
      ],
      tacticalModalities: [
        'Construcción de artefactos navales semisumergibles en astilleros de manglar',
        'Control de los complejos de cristalizaderos en el Triángulo de Telembí',
        'Rutas transfronterizas de tráfico hacia Ecuador y Venezuela',
        'Treguas tácticas y alianzas con autoridades corruptas regionales'
      ],
      strategicObjective: 'Dominio de la exportación marítima hacia Centroamérica mediante sumergibles y explotación de recursos estratégicos mineros (oro, coltán).',
      electoralInterferencePattern: '90%+ de votación en municipios costeros de Nariño (Mosquera 97.97%, Magüí Payán 97.59%, Olaya Herrera 93.91%); férreo control del transporte fluvial.',
      riskBadgeColor: 'border-purple-800 bg-purple-950/40 text-purple-300',
    },
    {
      name: 'Comandos de Frontera (CDF)',
      alias: 'Comandos de la Frontera - Ejército Bolivariano (Estructura 48)',
      commanders: 'Alias Araña, alias Giovani',
      theaterOfOperations: 'Putumayo (San Miguel, Puerto Asís, Puerto Leguízamo), Amazonas (Puerto Alegría, Tarapacá), Sucumbíos (Ecuador).',
      strengthEstimate: '1.200+ combatientes con equipamiento táctico de última generación',
      primarySubstructures: [
        'Estructura 48 (San Miguel y Puerto Asís)',
        'Frentes fluviales del río Caquetá y Putumayo',
        'Redes de contrabando en la provincia de Sucumbíos (Ecuador)'
      ],
      tacticalModalities: [
        'Uso de drones térmicos para burlar patrullas nocturnas de guardacostas',
        'Monopolio de la compra de base de coca en dólares en efectivo',
        'Tráfico de precursores químicos e insumos de contrabando desde Ecuador',
        'Reclutamiento de menores en colegios e internados indígenas fronterizos'
      ],
      strategicObjective: 'Conectar la cuenca cocalera de Putumayo con la economía dolarizada ecuatoriana y los puertos peruanos y brasileños del río Amazonas.',
      electoralInterferencePattern: 'Control militar de los muelles de abordaje electoral; supervisión directa del sufragio en caseríos de frontera.',
      riskBadgeColor: 'border-cyan-800 bg-cyan-950/40 text-cyan-300',
    },
    {
      name: 'GDOs Urbanos (Costeños/Pepes/Inmaculada/Flacos)',
      alias: 'Grupos de Delincuencia Organizada y Oficinas de Cobro',
      commanders: 'Digno Palomino (Los Pepes), Castor (Los Costeños), Pipe Tuluá (La Inmaculada)',
      theaterOfOperations: 'Barranquilla y Área Metropolitana, Tuluá y Cartago (Valle del Cauca), Soledad, Malambo, Palmira.',
      strengthEstimate: '2.500+ sicarios e integrantes de pandillas barriales en nómina',
      primarySubstructures: [
        'Los Costeños (Barranquilla, Soledad, Malambo)',
        'Los Pepes (Disputa a muerte contra Costeños por rentas portuarias)',
        'La Inmaculada (Tuluá - atentados terroristas urbanos)',
        'Los Flacos (Cartago y Zarzal - microtráfico en el Eje Cafetero)',
        'Pandillas de Puerto Tejada (27 pandillas activas armadas con fusil)'
      ],
      tacticalModalities: [
        'Atentados sicariales a locales de comercio, transporte público y farmacias',
        'Lanzamiento de granadas y artefactos explosivos contra estaciones policiales',
        'Manejo del microtráfico barrial y préstamos ilegales gota a gota',
        'Lavado de activos en bienes raíces, droguerías y casas de cambio'
      ],
      strategicObjective: 'Monopolio de las rentas ilícitas urbanas y servicios de sicariato tercerizado para grandes carteles del narcotráfico.',
      electoralInterferencePattern: 'Coacción en comunas y barrios vulnerables; compra masiva de votos con fondos del microtráfico; intimidación a líderes comunitarios independientes.',
      riskBadgeColor: 'border-emerald-800 bg-emerald-950/40 text-emerald-300',
    }
  ];

  return (
    <div id="threat-actors-matrix-container" className="space-y-4">
      {/* Header Banner */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="h-6 w-6 text-rose-500" />
          <div>
            <h2 className="text-base font-bold text-white uppercase font-sans tracking-wide">
              Matriz Estratégica de Actores Armados Ilegales en Colombia
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Estructura operacional, subestructuras identificadas, modalidades delictivas y patrones de interferencia electoral documentados en los 156 municipios.
            </p>
          </div>
        </div>
      </div>

      {/* Actors Accordion Cards */}
      <div className="space-y-3">
        {actors.map((actor) => {
          const isExpanded = expandedActor === actor.name;
          return (
            <div
              key={actor.name}
              className="rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden shadow-sm transition-all"
            >
              <button
                onClick={() => setExpandedActor(isExpanded ? null : actor.name)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-rose-400">
                    <Crosshair className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white font-sans">{actor.name}</h3>
                      <span className={`rounded px-2 py-0.5 text-[10px] font-mono border ${actor.riskBadgeColor}`}>
                        {actor.strengthEstimate.split(' ')[0]} combatientes
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{actor.alias}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="hidden md:inline text-xs font-mono text-slate-400">
                    {actor.primarySubstructures.length} Subestructuras registradas
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="p-4 pt-0 border-t border-slate-800/80 bg-slate-950/60 space-y-4 text-xs">
                  {/* Commanders and Theater */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    <div className="rounded-lg bg-slate-900 p-3 border border-slate-800">
                      <span className="text-slate-400 font-mono block mb-1 font-semibold">
                        MANDO Y CABECILLAS:
                      </span>
                      <p className="text-slate-200 font-sans">{actor.commanders}</p>
                    </div>

                    <div className="rounded-lg bg-slate-900 p-3 border border-slate-800">
                      <span className="text-slate-400 font-mono block mb-1 font-semibold">
                        TEATRO DE OPERACIONES:
                      </span>
                      <p className="text-slate-200 font-sans">{actor.theaterOfOperations}</p>
                    </div>
                  </div>

                  {/* Primary Substructures */}
                  <div>
                    <h4 className="font-bold text-slate-300 uppercase font-mono mb-2 flex items-center gap-1.5">
                      <Radio className="h-3.5 w-3.5 text-rose-400" />
                      Frentes y Subestructuras Operativas Documentadas
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {actor.primarySubstructures.map((sub, idx) => (
                        <div
                          key={idx}
                          className="rounded bg-slate-900/90 px-2.5 py-1.5 text-[11px] font-mono text-slate-300 border border-slate-800 flex items-center gap-2"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                          <span>{sub}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tactical Modalities */}
                  <div>
                    <h4 className="font-bold text-slate-300 uppercase font-mono mb-2 flex items-center gap-1.5">
                      <Flame className="h-3.5 w-3.5 text-amber-400" />
                      Modalidades Tácticas y Delictivas
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {actor.tacticalModalities.map((mod, idx) => (
                        <div
                          key={idx}
                          className="rounded bg-amber-950/20 px-2.5 py-1.5 text-[11px] text-amber-200 border border-amber-800/40 flex items-center gap-2"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                          <span>{mod}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strategic & Electoral Impact */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-lg bg-slate-900 p-3 border border-slate-800">
                      <span className="text-cyan-400 font-mono block mb-1 font-semibold">
                        OBJETIVO GEOESTRATÉGICO:
                      </span>
                      <p className="text-slate-300 leading-relaxed font-sans text-justify">
                        {actor.strategicObjective}
                      </p>
                    </div>

                    <div className="rounded-lg bg-rose-950/30 p-3 border border-rose-900/60">
                      <span className="text-rose-300 font-mono block mb-1 font-semibold flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                        PATRÓN DE COACCIÓN E INTERFERENCIA ELECTORAL:
                      </span>
                      <p className="text-slate-200 leading-relaxed font-sans text-justify">
                        {actor.electoralInterferencePattern}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
