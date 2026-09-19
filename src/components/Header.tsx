import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  MapPin,
  BarChart3,
  Database,
  Sparkles,
  FileText,
  Radio,
  Users,
  ShieldCheck,
  Clock,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export type NavTab = 'map' | 'analytics' | 'dossier' | 'actors' | 'ai' | 'report';

interface HeaderProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  totalMunicipalities: number;
  totalDepartments: number;
  criticalCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  totalMunicipalities,
  totalDepartments,
  criticalCount,
}) => {
  const [timeString, setTimeString] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleDateString('es-CO', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: 'America/Bogota',
        }).toUpperCase() + ' (COT)'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header id="main-header" className="border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-md sticky top-0 z-30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Official Institutional Protocol Bar */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800/60 py-1.5 text-[11px] font-mono">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              <span>SISTEMA NACIONAL EN LÍNEA</span>
            </div>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400 hidden sm:inline">
              REPÚBLICA DE COLOMBIA &bull; SEGURIDAD Y DEFENSA
            </span>
            <span className="text-slate-700 hidden md:inline">|</span>
            <span className="text-slate-500 hidden md:inline">
              PROTOCOLO CARTOGRÁFICO WGS-84
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <div className="flex items-center gap-1 text-slate-300">
              <Clock className="h-3 w-3 text-slate-400" />
              <span>{timeString || 'BOGOTÁ, D.C.'}</span>
            </div>
            <span className="text-slate-700">|</span>
            <span className="rounded bg-slate-900 px-2 py-0.5 text-[10px] text-slate-400 border border-slate-800">
              ACCESO ANALÍTICO OFICIAL
            </span>
          </div>
        </div>

        {/* Main Institutional Banner */}
        <div className="flex flex-col gap-4 py-3.5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3.5">
            {/* Seal / Emblem */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-amber-400 border border-slate-800 shadow-sm">
              <ShieldCheck className="h-6 w-6 text-amber-400/90" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white font-sans">
                  Observatorio de Geopolítica, Orden Público y Dinámicas Electorales
                </h1>
                <span className="hidden sm:inline-flex rounded bg-slate-800/80 px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-300 border border-slate-700/80">
                  COLOMBIA
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans">
                Monitoreo Geoespacial de Grupos Armados Ilegales, Confinamientos y Resultados E-26 Oficiales
              </p>
            </div>
          </div>

          {/* Quick Institutional Summary Metrics */}
          <div className="hidden lg:flex items-center gap-2.5 font-mono text-xs">
            <div className="rounded-lg border border-slate-800/80 bg-slate-900/60 px-3 py-1.5">
              <span className="text-slate-400 block text-[10px]">COBERTURA:</span>
              <span className="font-semibold text-slate-200">
                {totalMunicipalities} Focos / {totalDepartments} Dptos
              </span>
            </div>
            <div className="rounded-lg border border-rose-900/40 bg-rose-950/20 px-3 py-1.5">
              <span className="text-rose-400 block text-[10px]">AMENAZA CRÍTICA:</span>
              <span className="font-semibold text-rose-300">
                {criticalCount} Municipios
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex items-center gap-1 overflow-x-auto pb-2 border-t border-slate-800/60 pt-2 no-scrollbar">
          <button
            id="tab-map"
            onClick={() => onSelectTab('map')}
            className={`flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'map'
                ? 'bg-slate-800 text-white font-semibold border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
            }`}
          >
            <MapPin className="h-3.5 w-3.5 text-rose-400" />
            <span>Cartografía Georreferenciada</span>
          </button>

          <button
            id="tab-analytics"
            onClick={() => onSelectTab('analytics')}
            className={`flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'analytics'
                ? 'bg-slate-800 text-white font-semibold border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5 text-cyan-400" />
            <span>Análisis y Correlación E-26</span>
          </button>

          <button
            id="tab-dossier"
            onClick={() => onSelectTab('dossier')}
            className={`flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'dossier'
                ? 'bg-slate-800 text-white font-semibold border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
            }`}
          >
            <Database className="h-3.5 w-3.5 text-amber-400" />
            <span>Base de Datos Territorial</span>
          </button>

          <button
            id="tab-actors"
            onClick={() => onSelectTab('actors')}
            className={`flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'actors'
                ? 'bg-slate-800 text-white font-semibold border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
            }`}
          >
            <Users className="h-3.5 w-3.5 text-purple-400" />
            <span>Estructuras Armadas Ilegales</span>
          </button>

          <button
            id="tab-ai"
            onClick={() => onSelectTab('ai')}
            className={`flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'ai'
                ? 'bg-slate-800 text-amber-300 font-semibold border border-amber-800/60 shadow-sm'
                : 'text-amber-400/80 hover:bg-slate-900 hover:text-amber-300 border border-transparent'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Analista de Inteligencia IA</span>
          </button>

          <button
            id="tab-report"
            onClick={() => onSelectTab('report')}
            className={`flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'report'
                ? 'bg-slate-800 text-white font-semibold border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
            }`}
          >
            <FileText className="h-3.5 w-3.5 text-emerald-400" />
            <span>Informe Ejecutivo Oficial</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
