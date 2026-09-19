import React, { useMemo, useState } from 'react';
import { MunicipalityRecord } from '../types/intelligence';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
  PieChart,
  Pie,
  Legend
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  AlertOctagon,
  Percent,
  ShieldCheck,
  Award,
  Zap,
  Flame,
  Search
} from 'lucide-react';

interface AnalyticsViewProps {
  municipalities: MunicipalityRecord[];
  onSelectMunicipality: (m: MunicipalityRecord) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  municipalities,
  onSelectMunicipality,
}) => {
  const [activeMetric, setActiveMetric] = useState<'topVote' | 'byActor' | 'byModality'>('topVote');

  // Top 15 highest vote concentration municipalities
  const top15 = useMemo(() => {
    return [...municipalities]
      .sort((a, b) => b.porcentaje - a.porcentaje)
      .slice(0, 15)
      .map((m) => ({
        id: m.id,
        name: `${m.name} (${m.department.slice(0, 4)}.)`,
        fullName: `${m.name}, ${m.department}`,
        porcentaje: Number(m.porcentaje.toFixed(2)),
        votos: m.votos,
        mesas: m.mesas,
        riesgo: m.nivelRiesgo,
        raw: m,
      }));
  }, [municipalities]);

  // Average percentage by armed group
  const byActor = useMemo(() => {
    const actorStats: Record<string, { totalPct: number; count: number; totalVotos: number }> = {};
    municipalities.forEach((m) => {
      m.gruposArmados.forEach((actor) => {
        if (!actorStats[actor]) {
          actorStats[actor] = { totalPct: 0, count: 0, totalVotos: 0 };
        }
        actorStats[actor].totalPct += m.porcentaje;
        actorStats[actor].count += 1;
        actorStats[actor].totalVotos += m.votos;
      });
    });

    return Object.entries(actorStats)
      .map(([actor, stat]) => ({
        actor: actor.length > 24 ? actor.slice(0, 22) + '...' : actor,
        fullActor: actor,
        avgPct: Number((stat.totalPct / stat.count).toFixed(1)),
        focos: stat.count,
        totalVotos: stat.totalVotos,
      }))
      .sort((a, b) => b.avgPct - a.avgPct);
  }, [municipalities]);

  // Modalities count
  const modalitiesData = useMemo(() => {
    const modCount: Record<string, number> = {};
    municipalities.forEach((m) => {
      m.modalidades.forEach((mod) => {
        modCount[mod] = (modCount[mod] || 0) + 1;
      });
    });

    return Object.entries(modCount)
      .map(([name, count]) => ({
        name: name.length > 25 ? name.slice(0, 23) + '..' : name,
        fullName: name,
        frecuencia: count,
      }))
      .sort((a, b) => b.frecuencia - a.frecuencia);
  }, [municipalities]);

  // Risk breakdown
  const riskBreakdown = useMemo(() => {
    const counts = { Crítico: 0, 'Muy Alto': 0, Alto: 0, Moderado: 0 };
    municipalities.forEach((m) => {
      if (counts[m.nivelRiesgo] !== undefined) {
        counts[m.nivelRiesgo]++;
      }
    });

    return [
      { name: 'Crítico', value: counts.Crítico, color: '#f43f5e' },
      { name: 'Muy Alto', value: counts['Muy Alto'], color: '#f97316' },
      { name: 'Alto', value: counts.Alto, color: '#eab308' },
      { name: 'Moderado', value: counts.Moderado, color: '#10b981' },
    ];
  }, [municipalities]);

  // Overall calculations
  const totalVotesCount = useMemo(() => {
    return municipalities.reduce((acc, m) => acc + m.votos, 0);
  }, [municipalities]);

  const avgNationalVoteInZones = useMemo(() => {
    if (!municipalities.length) return 0;
    const sum = municipalities.reduce((acc, m) => acc + m.porcentaje, 0);
    return (sum / municipalities.length).toFixed(1);
  }, [municipalities]);

  const criticalAvg = useMemo(() => {
    const crit = municipalities.filter((m) => m.nivelRiesgo === 'Crítico');
    if (!crit.length) return 0;
    const sum = crit.reduce((acc, m) => acc + m.porcentaje, 0);
    return (sum / crit.length).toFixed(1);
  }, [municipalities]);

  return (
    <div id="analytics-view-container" className="space-y-6">
      {/* Executive Statistical Callouts */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-rose-900/50 bg-rose-950/20 p-4">
          <span className="text-xs font-mono uppercase text-rose-400 font-semibold block">
            Promedio en Focos Críticos
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold font-mono text-white">{criticalAvg}%</span>
            <span className="text-xs text-rose-300 font-mono">de concentración</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            En zonas con presencia simultánea de frentes del EMC, Segunda Marquetalia y ELN.
          </p>
        </div>

        <div className="rounded-xl border border-amber-900/50 bg-amber-950/20 p-4">
          <span className="text-xs font-mono uppercase text-amber-400 font-semibold block">
            Votación Récord Registrada
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold font-mono text-white">98.18%</span>
            <span className="text-xs text-amber-300 font-mono">El Litoral del San Juan</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Chocó (5.343 votos). Territorio en disputa armada naval entre AGC y ELN.
          </p>
        </div>

        <div className="rounded-xl border border-cyan-900/50 bg-cyan-950/20 p-4">
          <span className="text-xs font-mono uppercase text-cyan-400 font-semibold block">
            Votos Mapeados en Dossier
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold font-mono text-white">
              {(totalVotesCount / 1000000).toFixed(2)}M
            </span>
            <span className="text-xs text-cyan-300 font-mono">sufragios escrutados</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Datos consolidados correspondientes a los 156 municipios del informe.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <span className="text-xs font-mono uppercase text-slate-400 font-semibold block">
            Anomalía Electoral Relativa
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold font-mono text-white">+{avgNationalVoteInZones}%</span>
            <span className="text-xs text-slate-300 font-mono">vs 50.44% Nacional</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Diferencia promedio de concentración electoral en municipios con grupos armados.
          </p>
        </div>
      </div>

      {/* Metric Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-rose-500" />
          <h2 className="text-sm font-bold tracking-wide text-white uppercase font-mono">
            Modelos de Correlación: Seguridad vs Sufragio Oficial
          </h2>
        </div>

        <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveMetric('topVote')}
            className={`rounded-md px-3 py-1.5 transition-all ${
              activeMetric === 'topVote'
                ? 'bg-rose-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Top 15 Hotspots Electorales
          </button>
          <button
            onClick={() => setActiveMetric('byActor')}
            className={`rounded-md px-3 py-1.5 transition-all ${
              activeMetric === 'byActor'
                ? 'bg-rose-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            % Promedio por Actor Armado
          </button>
          <button
            onClick={() => setActiveMetric('byModality')}
            className={`rounded-md px-3 py-1.5 transition-all ${
              activeMetric === 'byModality'
                ? 'bg-rose-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Matriz de Modalidades Tácticas
          </button>
        </div>
      </div>

      {/* Active Chart Container */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm backdrop-blur-md">
        {activeMetric === 'topVote' && (
          <div>
            <div className="mb-4">
              <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
                <Flame className="h-4 w-4 text-rose-500" />
                Municipios con Mayor Concentración Electoral en Zonas de Conflicto Armado
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Porcentaje oficial obtenido por la candidatura presidencial en 2022 (Segunda Vuelta). Haz clic en cualquier barra para ver la ficha militar.
              </p>
            </div>

            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={top15}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 80, bottom: 20 }}
                  onClick={(e: any) => {
                    if (e && e.activePayload && e.activePayload.length) {
                      onSelectMunicipality(e.activePayload[0].payload.raw);
                    }
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                  <XAxis
                    type="number"
                    domain={[40, 100]}
                    stroke="#64748b"
                    tickFormatter={(val) => `${val}%`}
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#64748b"
                    tick={{ fill: '#e2e8f0', fontSize: 11, fontWeight: 500 }}
                    width={100}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-xs shadow-xl">
                            <p className="font-bold text-white font-sans text-sm">{data.fullName}</p>
                            <p className="text-rose-400 font-mono mt-1 font-bold">
                              {data.porcentaje}% de Votación Oficial
                            </p>
                            <p className="text-slate-400 font-mono">
                              {data.votos.toLocaleString()} votos | {data.mesas} mesas
                            </p>
                            <span className="mt-2 inline-block rounded bg-rose-950 px-2 py-0.5 text-[10px] font-mono text-rose-300 border border-rose-800">
                              Nivel: {data.riesgo}
                            </span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="porcentaje" radius={[0, 4, 4, 0]} cursor="pointer">
                    {top15.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.porcentaje >= 95 ? '#f43f5e' : entry.porcentaje >= 90 ? '#f97316' : '#eab308'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeMetric === 'byActor' && (
          <div>
            <div className="mb-4">
              <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-cyan-400" />
                Concentración Promedio de Voto por Presencia de Actor Armado
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Comparativo del porcentaje electoral promedio en municipios donde opera cada organización armada ilegal.
              </p>
            </div>

            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={byActor}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis
                    dataKey="actor"
                    stroke="#64748b"
                    tick={{ fill: '#cbd5e1', fontSize: 11 }}
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                  />
                  <YAxis
                    domain={[40, 100]}
                    stroke="#64748b"
                    tickFormatter={(val) => `${val}%`}
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-xs shadow-xl">
                            <p className="font-bold text-white font-sans text-sm">{data.fullActor}</p>
                            <p className="text-cyan-400 font-mono mt-1 font-bold">
                              Promedio: {data.avgPct}% de Votos
                            </p>
                            <p className="text-slate-400 font-mono">
                              {data.focos} Municipios con presencia documentada
                            </p>
                            <p className="text-slate-400 font-mono">
                              {data.totalVotos.toLocaleString()} Votos totales
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="avgPct" fill="#0284c7" radius={[4, 4, 0, 0]}>
                    {byActor.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.avgPct >= 80 ? '#f43f5e' : entry.avgPct >= 70 ? '#0284c7' : '#64748b'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeMetric === 'byModality' && (
          <div>
            <div className="mb-4">
              <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-400" />
                Modalidades Tácticas y Criminales Predominantes en el Territorio
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Frecuencia de modalidades delictivas registradas en los 156 municipios del observatorio.
              </p>
            </div>

            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={modalitiesData}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 140, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                  <XAxis
                    type="number"
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#64748b"
                    tick={{ fill: '#e2e8f0', fontSize: 11 }}
                    width={140}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-xs shadow-xl">
                            <p className="font-bold text-white font-sans text-sm">{data.fullName}</p>
                            <p className="text-amber-400 font-mono mt-1 font-bold">
                              Presente en {data.frecuencia} Municipios
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="frecuencia" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Threat Distribution Matrix & Risk Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {riskBreakdown.map((risk) => (
          <div
            key={risk.name}
            className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-mono uppercase text-slate-400 block">
                Nivel {risk.name}
              </span>
              <span className="text-2xl font-bold font-mono text-white mt-1 block">
                {risk.value} municipios
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {((risk.value / municipalities.length) * 100).toFixed(1)}% del dossier
              </span>
            </div>
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center font-mono font-bold text-xs"
              style={{ backgroundColor: `${risk.color}25`, color: risk.color, border: `1px solid ${risk.color}50` }}
            >
              {risk.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
