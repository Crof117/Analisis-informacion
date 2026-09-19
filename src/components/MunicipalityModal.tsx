import React from 'react';
import { MunicipalityRecord, ThreatLevel } from '../types/intelligence';
import {
  X,
  MapPin,
  Shield,
  Flame,
  AlertTriangle,
  Radio,
  Sparkles,
  Award,
  Crosshair,
  FileText
} from 'lucide-react';

interface MunicipalityModalProps {
  municipality: MunicipalityRecord | null;
  onClose: () => void;
  onConsultAI: (municipality: MunicipalityRecord) => void;
}

export const MunicipalityModal: React.FC<MunicipalityModalProps> = ({
  municipality,
  onClose,
  onConsultAI,
}) => {
  if (!municipality) return null;

  const riskBadgeStyles: Record<ThreatLevel, { badge: string; border: string }> = {
    Crítico: {
      badge: 'bg-rose-950/80 text-rose-300 border-rose-800',
      border: 'border-rose-900/60',
    },
    'Muy Alto': {
      badge: 'bg-orange-950/80 text-orange-300 border-orange-800',
      border: 'border-orange-900/60',
    },
    Alto: {
      badge: 'bg-amber-950/80 text-amber-300 border-amber-800',
      border: 'border-amber-900/60',
    },
    Moderado: {
      badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-800',
      border: 'border-emerald-900/60',
    },
  };

  const style = riskBadgeStyles[municipality.nivelRiesgo] || riskBadgeStyles.Alto;

  return (
    <div
      id="municipality-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="municipality-modal-content"
        className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border ${style.border} bg-slate-950 p-6 shadow-2xl space-y-5 text-slate-200`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="rounded bg-rose-500/20 px-2 py-0.5 text-[11px] font-mono font-bold text-rose-300 border border-rose-500/30">
                DOSSIER MUNICIPAL DE INTELIGENCIA
              </span>
              <span
                className={`rounded px-2.5 py-0.5 text-[11px] font-mono font-bold border ${style.badge}`}
              >
                Amenaza {municipality.nivelRiesgo}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white font-sans">
              {municipality.name}
            </h2>
            <p className="text-xs text-slate-400 font-mono flex items-center gap-2 mt-0.5">
              <MapPin className="h-3.5 w-3.5 text-slate-500" />
              <span>{municipality.department}</span>
              <span>•</span>
              <span>Región {municipality.region}</span>
              <span>•</span>
              <span>
                Lat: {municipality.coordinates.lat}, Lng: {municipality.coordinates.lng}
              </span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Electoral Official Scorecard */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-xl border border-slate-800/80 bg-slate-900/60 p-4">
          <div>
            <span className="text-xs font-mono uppercase text-slate-400 block font-semibold">
              Mesas Escrutadas (E-26)
            </span>
            <span className="text-xl font-bold font-mono text-white mt-0.5 block">
              {municipality.mesas} mesas
            </span>
          </div>

          <div>
            <span className="text-xs font-mono uppercase text-slate-400 block font-semibold">
              Votos Registrados
            </span>
            <span className="text-xl font-bold font-mono text-white mt-0.5 block">
              {municipality.votos.toLocaleString()}
            </span>
          </div>

          <div>
            <span className="text-xs font-mono uppercase text-slate-400 block font-semibold">
              Porcentaje Oficial
            </span>
            <span
              className={`text-xl font-bold font-mono mt-0.5 block ${
                municipality.porcentaje >= 85
                  ? 'text-rose-400'
                  : municipality.porcentaje >= 70
                  ? 'text-orange-400'
                  : 'text-amber-400'
              }`}
            >
              {municipality.porcentaje.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Strategic Position */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-1.5">
          <h3 className="text-xs font-mono uppercase font-bold text-slate-300 flex items-center gap-1.5">
            <Crosshair className="h-4 w-4 text-rose-400" />
            Posición Geoestratégica y Corredores de Movilidad
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-sans text-justify">
            {municipality.posicionGeoestrategica}
          </p>
        </div>

        {/* Public Order & Security Analysis */}
        <div className="rounded-xl border border-rose-900/40 bg-rose-950/10 p-4 space-y-1.5">
          <h3 className="text-xs font-mono uppercase font-bold text-rose-300 flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-rose-400" />
            Análisis Operacional de Orden Público
          </h3>
          <p className="text-xs text-slate-200 leading-relaxed font-sans text-justify">
            {municipality.analisisOrdenPublico}
          </p>
        </div>

        {/* Armed Groups & Substructures */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <h4 className="text-xs font-mono uppercase font-bold text-slate-300 mb-2 flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-rose-400" />
              Organizaciones Armadas Presentes
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {municipality.gruposArmados.map((g, idx) => (
                <span
                  key={idx}
                  className="rounded-md bg-rose-950/50 px-2.5 py-1 text-xs text-rose-300 border border-rose-800/60 font-sans"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <h4 className="text-xs font-mono uppercase font-bold text-slate-300 mb-2 flex items-center gap-1.5">
              <Radio className="h-4 w-4 text-cyan-400" />
              Frentes y Subestructuras Específicas
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {municipality.subestructuras && municipality.subestructuras.length > 0 ? (
                municipality.subestructuras.map((sub, idx) => (
                  <span
                    key={idx}
                    className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] font-mono text-slate-200 border border-slate-700"
                  >
                    {sub}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 font-mono">
                  Comisiones no identificadas
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tactical Modalities */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <h4 className="text-xs font-mono uppercase font-bold text-slate-300 mb-2 flex items-center gap-1.5">
            <Flame className="h-4 w-4 text-amber-400" />
            Modalidades Delictivas Registradas
          </h4>
          <div className="flex flex-wrap gap-2">
            {municipality.modalidades.map((mod, idx) => (
              <span
                key={idx}
                className="rounded-lg bg-amber-950/30 px-2.5 py-1 text-xs text-amber-300 border border-amber-800/40 font-sans"
              >
                {mod}
              </span>
            ))}
          </div>
        </div>

        {/* Early Warning Alert */}
        {municipality.alertasDestacadas && (
          <div className="rounded-xl border border-amber-800/60 bg-amber-950/20 p-3.5 text-xs text-amber-200">
            <span className="font-bold block text-[11px] font-mono text-amber-300 mb-0.5">
              ALERTA TEMPRANA CLASIFICADA:
            </span>
            {municipality.alertasDestacadas}
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-mono text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Cerrar Ficha
          </button>

          <button
            onClick={() => {
              onClose();
              onConsultAI(municipality);
            }}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 px-4 py-2 text-xs font-bold font-mono text-white shadow-md transition-all"
          >
            <Sparkles className="h-4 w-4" />
            <span>Consultar con Analista IA</span>
          </button>
        </div>
      </div>
    </div>
  );
};
