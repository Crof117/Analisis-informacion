import React, { useState, useMemo } from 'react';
import { MunicipalityRecord, ThreatLevel } from '../types/intelligence';
import {
  Search,
  Filter,
  Download,
  ArrowUpDown,
  ExternalLink,
  Shield,
  Flame,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet
} from 'lucide-react';

interface MunicipalDossierTableProps {
  municipalities: MunicipalityRecord[];
  onSelectMunicipality: (m: MunicipalityRecord) => void;
}

type SortField = 'name' | 'department' | 'mesas' | 'votos' | 'porcentaje' | 'nivelRiesgo';

export const MunicipalDossierTable: React.FC<MunicipalDossierTableProps> = ({
  municipalities,
  onSelectMunicipality,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [sortField, setSortField] = useState<SortField>('porcentaje');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Extract unique departments
  const departments = useMemo(() => {
    return Array.from(new Set(municipalities.map((m) => m.department))).sort();
  }, [municipalities]);

  // Filter & Search logic
  const filtered = useMemo(() => {
    return municipalities.filter((m) => {
      if (selectedDept !== 'all' && m.department !== selectedDept) return false;
      if (selectedRisk !== 'all' && m.nivelRiesgo !== selectedRisk) return false;

      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return (
        m.name.toLowerCase().includes(term) ||
        m.department.toLowerCase().includes(term) ||
        m.posicionGeoestrategica.toLowerCase().includes(term) ||
        m.gruposArmados.some((g) => g.toLowerCase().includes(term)) ||
        (m.subestructuras && m.subestructuras.some((s) => s.toLowerCase().includes(term)))
      );
    });
  }, [municipalities, searchTerm, selectedDept, selectedRisk]);

  // Sort logic
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === 'nivelRiesgo') {
        const priority: Record<ThreatLevel, number> = {
          Crítico: 4,
          'Muy Alto': 3,
          Alto: 2,
          Moderado: 1,
        };
        aVal = priority[a.nivelRiesgo] || 0;
        bVal = priority[b.nivelRiesgo] || 0;
      }

      if (aVal < bVal) return sortAsc ? -1 : 1;
      if (aVal > bVal) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filtered, sortField, sortAsc]);

  // Pagination logic
  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, currentPage]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // default desc
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Municipio',
      'Departamento',
      'Región',
      'Mesas',
      'Votos',
      'Porcentaje',
      'Nivel de Riesgo',
      'Grupos Armados',
      'Posición Geoestratégica',
    ];

    const rows = sorted.map((m) => [
      `"${m.id}"`,
      `"${m.name}"`,
      `"${m.department}"`,
      `"${m.region}"`,
      m.mesas,
      m.votos,
      m.porcentaje.toFixed(2),
      `"${m.nivelRiesgo}"`,
      `"${m.gruposArmados.join('; ')}"`,
      `"${m.posicionGeoestrategica.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dossier_inteligencia_colombia_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const riskBadgeStyles: Record<ThreatLevel, string> = {
    Crítico: 'bg-rose-950/60 text-rose-300 border-rose-800/80',
    'Muy Alto': 'bg-orange-950/60 text-orange-300 border-orange-800/80',
    Alto: 'bg-amber-950/60 text-amber-300 border-amber-800/80',
    Moderado: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80',
  };

  return (
    <div id="municipal-dossier-table-container" className="space-y-4">
      {/* Header & Export Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm backdrop-blur-md">
        <div>
          <h2 className="text-base font-bold text-white font-sans flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-rose-500" />
            Base de Datos de Inteligencia Municipal (156 Focos)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">
            Registros de escrutinio oficial E-26 cruzados con presencia armada y alertas de seguridad.
          </p>
        </div>

        <button
          id="btn-export-csv"
          onClick={handleExportCSV}
          className="flex items-center gap-2 rounded-lg bg-slate-800 hover:bg-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-200 border border-slate-700 transition-all font-mono"
        >
          <Download className="h-4 w-4 text-rose-400" />
          <span>Exportar Matriz CSV ({sorted.length})</span>
        </button>
      </div>

      {/* Search & Filter Row */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs">
        <div className="sm:col-span-6 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            id="table-search-input"
            type="text"
            placeholder="Buscar por municipio, departamento, subestructura o palabra táctica..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 pl-9 pr-3 py-2 text-slate-200 placeholder-slate-500 focus:border-rose-500 focus:outline-none"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            id="table-filter-dept"
            value={selectedDept}
            onChange={(e) => {
              setSelectedDept(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200 focus:border-rose-500 focus:outline-none"
          >
            <option value="all">Todos los Departamentos</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            id="table-filter-risk"
            value={selectedRisk}
            onChange={(e) => {
              setSelectedRisk(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200 focus:border-rose-500 focus:outline-none"
          >
            <option value="all">Todos los Niveles de Riesgo</option>
            <option value="Crítico">Crítico</option>
            <option value="Muy Alto">Muy Alto</option>
            <option value="Alto">Alto</option>
            <option value="Moderado">Moderado</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-900/90 text-[11px] font-mono uppercase text-slate-400">
              <tr>
                <th
                  onClick={() => handleSort('name')}
                  className="cursor-pointer px-4 py-3 hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Municipio</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('department')}
                  className="cursor-pointer px-4 py-3 hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Departamento</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('mesas')}
                  className="cursor-pointer px-4 py-3 hover:text-white transition-colors text-right"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Mesas</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('votos')}
                  className="cursor-pointer px-4 py-3 hover:text-white transition-colors text-right"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Votos E-26</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('porcentaje')}
                  className="cursor-pointer px-4 py-3 hover:text-white transition-colors text-right"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>% Votación</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('nivelRiesgo')}
                  className="cursor-pointer px-4 py-3 hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Amenaza</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3">Actores Armados</th>
                <th className="px-4 py-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {paginatedData.length > 0 ? (
                paginatedData.map((m) => (
                  <tr
                    key={m.id}
                    className="hover:bg-slate-900/60 transition-colors group cursor-pointer"
                    onClick={() => onSelectMunicipality(m)}
                  >
                    <td className="px-4 py-3 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <span>{m.name}</span>
                        {m.porcentaje >= 90 && (
                          <span className="rounded bg-rose-500/20 px-1.5 py-0.2 text-[10px] font-mono text-rose-300 border border-rose-500/40">
                            HOTSPOT
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-400">{m.department}</td>
                    <td className="px-4 py-3 font-mono text-slate-400 text-right">{m.mesas}</td>
                    <td className="px-4 py-3 font-mono text-slate-300 text-right font-semibold">
                      {m.votos.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`font-mono font-bold text-sm ${
                          m.porcentaje >= 90
                            ? 'text-rose-400'
                            : m.porcentaje >= 75
                            ? 'text-orange-400'
                            : m.porcentaje >= 60
                            ? 'text-amber-400'
                            : 'text-slate-300'
                        }`}
                      >
                        {m.porcentaje.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded px-2 py-0.5 text-[11px] font-mono font-semibold border ${
                          riskBadgeStyles[m.nivelRiesgo]
                        }`}
                      >
                        {m.nivelRiesgo}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {m.gruposArmados.map((g, idx) => (
                          <span
                            key={idx}
                            className="rounded bg-slate-900 px-1.5 py-0.5 text-[10px] text-slate-400 border border-slate-800"
                          >
                            {g.split(' ')[0]}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectMunicipality(m);
                        }}
                        className="rounded bg-slate-800 px-2 py-1 text-[11px] font-mono text-rose-400 hover:bg-rose-950 hover:text-rose-200 border border-slate-700 transition-all"
                      >
                        Ver Ficha
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500 font-mono">
                    No se encontraron focos municipales con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between border-t border-slate-800 px-4 py-3 text-xs font-mono text-slate-400 bg-slate-900/50">
          <div>
            Mostrando {sorted.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} a{' '}
            {Math.min(currentPage * pageSize, sorted.length)} de {sorted.length} registros
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-slate-300">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
