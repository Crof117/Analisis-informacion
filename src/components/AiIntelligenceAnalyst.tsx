import React, { useState } from 'react';
import { MunicipalityRecord } from '../types/intelligence';
import {
  Sparkles,
  Send,
  Loader2,
  ShieldCheck,
  Radio,
  FileCheck,
  Copy,
  Check,
  AlertCircle,
  HelpCircle,
  Flame,
  Plane,
  Crosshair
} from 'lucide-react';

interface AiIntelligenceAnalystProps {
  municipalities: MunicipalityRecord[];
  selectedMunicipality: MunicipalityRecord | null;
}

export const AiIntelligenceAnalyst: React.FC<AiIntelligenceAnalystProps> = ({
  municipalities,
  selectedMunicipality,
}) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const presetQueries = [
    {
      title: 'Correlación de Votos Extremos (>85%)',
      prompt:
        'Evalúa la correlación empírica y geopolítica entre el control territorial hegemónico de grupos armados (EMC, ELN, Segunda Marquetalia) y las concentraciones atípicas de votos (>85%) en municipios como El Litoral del San Juan (98.18%), Mosquera (97.97%), Magüí Payán (97.59%) y Timbiquí (97.39%). ¿Qué mecanismos de coacción operan?',
      icon: Flame,
    },
    {
      title: 'Guerra Asimétrica de Drones en Cauca y Valle',
      prompt:
        'Elabora un informe de inteligencia operacional sobre el empleo de enjambres de drones acondicionados con explosivos (AEI) por parte de las disidencias de las FARC (frentes Jaime Martínez y Dagoberto Ramos) en Morales, Cajibío, Jamundí y Candelaria. ¿Cuál es la amenaza para la Fuerza Pública y la infraestructura civil?',
      icon: Crosshair,
    },
    {
      title: 'Rutas Marítimas del Clan del Golfo (Caribe)',
      prompt:
        'Analiza la red logística del Clan del Golfo (Subestructuras Manuel José Gaitán, Rubén Darío Ávila, Zuley Guerra y Fulaye Vargas) en el Golfo de Morrosquillo, Sucre, Córdoba y el Canal del Dique para la salida de lanchas rápidas go-fast y el control del contrabando de armas.',
      icon: Radio,
    },
    {
      title: 'Macroextorsión y Carnetización en la Amazonía',
      prompt:
        'Diagnóstico sobre el cobro de vacunas ganaderas forzosas y la carnetización campesina impuesta por las disidencias de Calarcá (Bloque Jorge Suárez Briceño / Frente Rodrigo Cadete) y los Comandos de Frontera en Caquetá y Putumayo.',
      icon: ShieldCheck,
    },
  ];

  const handleRunAnalysis = async (queryText: string) => {
    if (!queryText.trim()) return;

    setIsLoading(true);
    setError(null);
    setResponse(null);

    // Build context payload
    const contextPayload = {
      totalMunicipalitiesAnalyzed: municipalities.length,
      sampleHighConcentration: municipalities
        .filter((m) => m.porcentaje >= 88)
        .slice(0, 10)
        .map((m) => ({
          name: m.name,
          dept: m.department,
          pct: m.porcentaje,
          actors: m.gruposArmados,
          modalities: m.modalidades,
        })),
      selectedFocus: selectedMunicipality
        ? {
            name: selectedMunicipality.name,
            dept: selectedMunicipality.department,
            mesas: selectedMunicipality.mesas,
            votos: selectedMunicipality.votos,
            porcentaje: selectedMunicipality.porcentaje,
            actors: selectedMunicipality.gruposArmados,
            subestructuras: selectedMunicipality.subestructuras,
            modalities: selectedMunicipality.modalidades,
            posicion: selectedMunicipality.posicionGeoestrategica,
            ordenPublico: selectedMunicipality.analisisOrdenPublico,
          }
        : null,
    };

    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: queryText,
          context: contextPayload,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Error del servidor de inteligencia (${res.status})`);
      }

      const data = await res.json();
      setResponse(data.analysis);
    } catch (err: any) {
      console.error('Error querying AI analyst:', err);
      setError(err.message || 'Error al conectar con el motor de inteligencia artificial.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="ai-intelligence-analyst-container" className="space-y-4">
      {/* Header Banner */}
      <div className="rounded-xl border border-amber-900/40 bg-gradient-to-r from-amber-950/30 via-slate-900 to-rose-950/20 p-5 shadow-sm backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-sans">
                  Analista Estratégico de Inteligencia (Gemini 2.5 Flash)
                </h2>
                <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-mono font-semibold text-amber-300 border border-amber-500/40">
                  SERVER-SIDE AI
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluaciones de seguridad nacional, cruzamiento de datos de orden público y proyecciones de integridad democrática.
              </p>
            </div>
          </div>

          {selectedMunicipality && (
            <div className="rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-1.5 text-xs text-slate-300 font-mono">
              <span className="text-slate-500 block text-[10px]">FOCO EN CONTEXTO:</span>
              <span className="font-bold text-rose-400">{selectedMunicipality.name}</span> ({selectedMunicipality.department})
            </div>
          )}
        </div>
      </div>

      {/* Preset Queries Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {presetQueries.map((pq, idx) => {
          const IconComponent = pq.icon;
          return (
            <button
              key={idx}
              onClick={() => {
                setPrompt(pq.prompt);
                handleRunAnalysis(pq.prompt);
              }}
              disabled={isLoading}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-left hover:border-amber-700/60 hover:bg-slate-850 transition-all group disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <IconComponent className="h-4 w-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <h4 className="text-xs font-bold text-slate-200 group-hover:text-white font-sans">
                  {pq.title}
                </h4>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 font-sans">
                {pq.prompt}
              </p>
            </button>
          );
        })}
      </div>

      {/* Custom Query Input Box */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-md backdrop-blur-md">
        <label className="block text-xs font-mono uppercase font-bold text-slate-300 mb-2">
          Consulta al Estado Mayor de Inteligencia:
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <textarea
            id="ai-query-textarea"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ejemplo: ¿Qué impacto tienen las alianzas entre el Clan del Golfo y bandas como Los Costeños sobre el puerto de Barranquilla? ¿O cómo mitigar el riesgo electoral en el Cañón del Micay?"
            className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none resize-none font-sans"
          />
          <button
            id="btn-run-ai-query"
            onClick={() => handleRunAnalysis(prompt)}
            disabled={isLoading || !prompt.trim()}
            className="flex sm:flex-col items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 px-5 py-3 text-xs font-bold text-white shadow-md disabled:opacity-50 transition-all shrink-0 font-mono"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Analizando...</span>
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span>Ejecutar Análisis</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="rounded-xl border border-amber-900/40 bg-slate-950 p-6 text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-amber-400 mx-auto" />
          <p className="text-sm font-bold text-slate-200 font-sans">
            Sintetizando Dossier de Inteligencia Territorial
          </p>
          <p className="text-xs text-slate-400 font-mono">
            Procesando alertas tempranas, presencia de frentes armados y escrutinios oficiales E-26 con Gemini 2.5 Flash...
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-xl border border-rose-900 bg-rose-950/40 p-4 text-xs text-rose-300 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-400 mt-0.5" />
          <div>
            <span className="font-bold block">Error en el Servicio de Inteligencia:</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Analysis Output Document */}
      {response && !isLoading && (
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-emerald-400" />
              <div>
                <h3 className="text-sm font-bold text-white uppercase font-mono">
                  Informe de Inteligencia y Apreciación de Situación
                </h3>
                <span className="text-[10px] text-slate-500 font-mono">
                  Generado en tiempo real • Modelo: Gemini 2.5 Flash
                </span>
              </div>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-mono text-slate-300 hover:bg-slate-800 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-slate-400" />
                  <span>Copiar Informe</span>
                </>
              )}
            </button>
          </div>

          {/* Formatted Markdown-like Content */}
          <div className="prose prose-invert max-w-none text-xs leading-relaxed text-slate-300 font-sans space-y-3 whitespace-pre-wrap">
            {response}
          </div>

          <div className="border-t border-slate-800/80 pt-3 text-[11px] font-mono text-slate-500 flex items-center justify-between">
            <span>CLASIFICACIÓN: DOCUMENTO ESTRATÉGICO DE ANÁLISIS DE ORDEN PÚBLICO</span>
            <span>OBSERVATORIO COLOMBIA</span>
          </div>
        </div>
      )}
    </div>
  );
};
