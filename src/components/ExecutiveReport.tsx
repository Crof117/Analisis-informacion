import React from 'react';
import { DEPARTMENTS_DATA } from '../data/departments';
import { MunicipalityRecord } from '../types/intelligence';
import {
  Printer,
  FileText,
  ShieldAlert,
  Award,
  AlertTriangle,
  Flame,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

interface ExecutiveReportProps {
  municipalities: MunicipalityRecord[];
}

export const ExecutiveReport: React.FC<ExecutiveReportProps> = ({ municipalities }) => {
  const handlePrint = () => {
    window.print();
  };

  const highVoteMuni = municipalities.filter((m) => m.porcentaje >= 85);
  const criticalMuni = municipalities.filter((m) => m.nivelRiesgo === 'Crítico');

  return (
    <div id="executive-report-container" className="space-y-6 max-w-5xl mx-auto">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm backdrop-blur-md print:hidden">
        <div>
          <h2 className="text-base font-bold text-white font-sans flex items-center gap-2">
            <FileText className="h-5 w-5 text-rose-500" />
            Informe Estratégico Ejecutivo
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Documento consolidado para análisis de seguridad nacional y Estado Mayor.
          </p>
        </div>

        <button
          id="btn-print-report"
          onClick={handlePrint}
          className="flex items-center gap-2 rounded-lg bg-rose-600 hover:bg-rose-500 px-4 py-2 text-xs font-bold text-white shadow-md transition-all font-mono"
        >
          <Printer className="h-4 w-4" />
          <span>Imprimir / Exportar PDF</span>
        </button>
      </div>

      {/* Printable Briefing Canvas */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-8 shadow-2xl space-y-8 text-slate-200 print:border-none print:p-0 print:bg-white print:text-black">
        {/* Document Header */}
        <div className="border-b-2 border-slate-800 pb-6 print:border-black">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-rose-600 to-amber-600 flex items-center justify-center text-white font-bold text-lg">
                <ShieldAlert className="h-7 w-7" />
              </div>
              <div>
                <span className="text-[11px] font-mono tracking-widest uppercase text-rose-400 font-bold block print:text-rose-700">
                  ESTADO MAYOR DE INTELIGENCIA Y SEGURIDAD NACIONAL
                </span>
                <h1 className="text-xl font-extrabold text-white sm:text-2xl font-sans tracking-tight print:text-black">
                  INFORME GEOESTRATÉGICO Y ELECTORAL DE COLOMBIA
                </h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5 print:text-slate-600">
                  Correlación entre Hegemonía Armada, Confinamientos Colectivos y Resultados Electorales E-26
                </p>
              </div>
            </div>

            <div className="text-right font-mono text-xs text-slate-400 print:text-slate-600">
              <div className="font-bold text-slate-200 print:text-black">DOC-INT-2024-CNE</div>
              <div>Edición Especial Oficial</div>
              <div>156 Municipios / 19 Departamentos</div>
            </div>
          </div>
        </div>

        {/* Executive Summary Section */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-rose-400 flex items-center gap-2 print:text-rose-700">
            <Award className="h-4 w-4" />
            1. Resumen Ejecutivo y Metodología
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed font-sans text-justify print:text-slate-800">
            El presente observatorio consolida los datos oficiales de votación de las elecciones presidenciales de Colombia (Segunda Vuelta, 2022) suministrados por la Registraduría Nacional del Estado Civil (formularios E-26) y el Consejo Nacional Electoral (CNE), cruzados de manera exhaustiva con las Alertas Tempranas de la Defensoría del Pueblo, los informes de orden público del Ministerio de Defensa y los registros de inteligencia territorial de la Policía Nacional y las Fuerzas Militares.
          </p>
          <p className="text-xs text-slate-300 leading-relaxed font-sans text-justify print:text-slate-800">
            El análisis abarca <strong>156 municipios</strong> distribuidos a lo largo de <strong>19 departamentos</strong> (desde la península de La Guajira hasta la Amazonía profunda y el litoral Pacífico), identificando un patrón consistente de correlación entre el dominio hegemónico de grupos armados ilegales y la obtención de márgenes atípicos de concentración de votos que van del <strong>80% al 98.18%</strong>.
          </p>
        </section>

        {/* Key Numerical Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl border border-slate-800 bg-slate-900/50 p-4 print:bg-slate-100 print:border-slate-300">
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase block">Municipios Monitoreados</span>
            <span className="text-2xl font-bold font-mono text-white print:text-black">156</span>
          </div>
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase block">Focos de Riesgo Crítico</span>
            <span className="text-2xl font-bold font-mono text-rose-400 print:text-rose-700">{criticalMuni.length}</span>
          </div>
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase block">Votación &gt;85% en Conflicto</span>
            <span className="text-2xl font-bold font-mono text-amber-400 print:text-amber-700">{highVoteMuni.length} municipios</span>
          </div>
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase block">Récord de Votación</span>
            <span className="text-2xl font-bold font-mono text-cyan-400 print:text-cyan-700">98.18%</span>
          </div>
        </div>

        {/* Strategic Conclusions Section */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-rose-400 flex items-center gap-2 print:text-rose-700">
            <AlertTriangle className="h-4 w-4" />
            2. Hallazgos Estratégicos de Seguridad Nacional
          </h2>

          <div className="space-y-3 text-xs text-slate-300 print:text-slate-800 font-sans">
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-1.5 print:bg-white print:border-slate-300">
              <h3 className="font-bold text-white print:text-black text-xs font-mono">
                A. CORRELACIÓN EMPÍRICA ENTRE HEGEMONÍA ARMADA Y SUFRAGIO UNILATERAL
              </h3>
              <p className="leading-relaxed text-justify">
                En los municipios donde no existe disputa entre estructuras armadas y un solo actor ejerce hegemonía territorial completa (como el ELN y AGC en el Litoral del San Juan con 98.18%, Segunda Marquetalia en Mosquera con 97.97% y Magüí Payán con 97.59%, o el EMC en Timbiquí con 97.39%), la participación y orientación del sufragio se unifica de manera casi absoluta, anulando la pluralidad democrática bajo mecanismos de amenaza implícita o explícita.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-1.5 print:bg-white print:border-slate-300">
              <h3 className="font-bold text-white print:text-black text-xs font-mono">
                B. MECANISMOS DE COACCIÓN: CONFINAMIENTO, PAROS Y CARNETIZACIÓN
              </h3>
              <p className="leading-relaxed text-justify">
                El constreñimiento al votante no se limita al día de comicios; se ejerce a través de la restricción sistemática de movilidad mediante paros armados fluviales (ríos Atrato, Baudó, San Juan, Telembí), la siembra de campos minados antipersonal en caminos rurales y la expedición forzada de carnets comunales por parte de disidencias como el Frente Rodrigo Cadete en Caquetá o el Bloque Occidental en el Cañón del Micay.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-1.5 print:bg-white print:border-slate-300">
              <h3 className="font-bold text-white print:text-black text-xs font-mono">
                C. EVOLUCIÓN TÁCTICA ASIMÉTRICA: GUERRA CON DRONES EXPLOSIVOS (AEI)
              </h3>
              <p className="leading-relaxed text-justify">
                Se documenta el salto cualitativo hacia el uso sistemático de drones comerciales acondicionados con bombas de fragmentación y artefactos explosivos improvisados en municipios del Cauca (Morales, Cajibío, Suárez) y Valle del Cauca (Jamundí, Candelaria). Esta táctica inhabilita la presencia de garitas policiales e infunde pánico colectivo sin exponer a los combatientes insurgentes.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-1.5 print:bg-white print:border-slate-300">
              <h3 className="font-bold text-white print:text-black text-xs font-mono">
                D. CONTROL DE CORREDORES GEOESTRATÉGICOS Y RENTAS CRIMINALES
              </h3>
              <p className="leading-relaxed text-justify">
                La preservación de las rutas de salida de cocaína en lanchas rápidas y semisumergibles (Golfo de Urabá, Golfo de Morrosquillo, bocanas de Nariño) y las cuencas de minería ilegal de oro (Serranía de San Lucas, ríos San Juan y Telembí) constituye el interés primordial de las organizaciones armadas, subordinando a las comunidades y a la institucionalidad local.
              </p>
            </div>
          </div>
        </section>

        {/* Regional Strategic Summary Table */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-rose-400 flex items-center gap-2 print:text-rose-700">
            <CheckCircle className="h-4 w-4" />
            3. Síntesis Territorial por Departamentos Estratégicos
          </h2>

          <div className="overflow-x-auto rounded-xl border border-slate-800 print:border-slate-300">
            <table className="w-full text-left text-xs text-slate-300 print:text-black">
              <thead className="border-b border-slate-800 bg-slate-900/80 font-mono text-[11px] uppercase print:bg-slate-200">
                <tr>
                  <th className="px-3 py-2.5">Departamento</th>
                  <th className="px-3 py-2.5">Región</th>
                  <th className="px-3 py-2.5 text-right">Mesas</th>
                  <th className="px-3 py-2.5 text-right">Votos Totales</th>
                  <th className="px-3 py-2.5 text-right">% Promedio</th>
                  <th className="px-3 py-2.5">Actores Armados Predominantes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans print:divide-slate-300">
                {DEPARTMENTS_DATA.slice(0, 12).map((d) => (
                  <tr key={d.slug} className="hover:bg-slate-900/40 print:hover:bg-transparent">
                    <td className="px-3 py-2 font-semibold text-white print:text-black">{d.name}</td>
                    <td className="px-3 py-2 text-slate-400 font-mono">{d.region}</td>
                    <td className="px-3 py-2 text-right font-mono">{d.totalMesas.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right font-mono">{d.totalVotos.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right font-mono font-bold text-rose-400 print:text-black">
                      {d.promedioPorcentaje.toFixed(1)}%
                    </td>
                    <td className="px-3 py-2 text-[11px] text-slate-400 print:text-slate-700">
                      {d.principalesActores.join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer Signature Box */}
        <div className="border-t border-slate-800 pt-6 text-xs text-slate-400 font-mono flex flex-col sm:flex-row items-center justify-between gap-3 print:border-black print:text-slate-600">
          <div>
            <span>OBSERVATORIO GEOPOLÍTICO Y ELECTORAL DE COLOMBIA</span>
            <span className="block text-[10px] text-slate-500">Documento Clasificado para Fines Académicos y de Inteligencia Estratégica</span>
          </div>

          <div className="text-right">
            <span>Fecha de Emisión: {new Date().toLocaleDateString('es-CO')}</span>
            <span className="block text-[10px] text-emerald-500">SISTEMA VERIFICADO</span>
          </div>
        </div>
      </div>
    </div>
  );
};
