import React, { useState, useMemo } from 'react';
import { MunicipalityRecord } from './types/intelligence';
import rawMunicipalities from './data/municipalities.json';
import { DEPARTMENTS_DATA } from './data/departments';
import { Header, NavTab } from './components/Header';
import { StatCard } from './components/StatCard';
import { TacticalMap } from './components/TacticalMap';
import { AnalyticsView } from './components/AnalyticsView';
import { MunicipalDossierTable } from './components/MunicipalDossierTable';
import { ThreatActorsMatrix } from './components/ThreatActorsMatrix';
import { AiIntelligenceAnalyst } from './components/AiIntelligenceAnalyst';
import { ExecutiveReport } from './components/ExecutiveReport';
import { MunicipalityModal } from './components/MunicipalityModal';
import {
  ShieldAlert,
  MapPin,
  Flame,
  Radio,
  BarChart3,
  Award,
  Sparkles,
  Users,
  Database
} from 'lucide-react';

export default function App() {
  const municipalities: MunicipalityRecord[] = rawMunicipalities as MunicipalityRecord[];

  const [activeTab, setActiveTab] = useState<NavTab>('map');
  const [selectedMunicipality, setSelectedMunicipality] = useState<MunicipalityRecord | null>(null);
  const [modalMunicipality, setModalMunicipality] = useState<MunicipalityRecord | null>(null);

  // Global KPIs
  const criticalCount = useMemo(() => {
    return municipalities.filter((m) => m.nivelRiesgo === 'Crítico').length;
  }, [municipalities]);

  const totalMesas = useMemo(() => {
    return municipalities.reduce((acc, m) => acc + m.mesas, 0);
  }, [municipalities]);

  const totalVotos = useMemo(() => {
    return municipalities.reduce((acc, m) => acc + m.votos, 0);
  }, [municipalities]);

  const maxPctRecord = useMemo(() => {
    if (!municipalities.length) return { name: '', pct: 0 };
    const max = municipalities.reduce((prev, curr) =>
      curr.porcentaje > prev.porcentaje ? curr : prev
    );
    return { name: max.name, pct: max.porcentaje.toFixed(2), dept: max.department };
  }, [municipalities]);

  const handleSelectMunicipality = (muni: MunicipalityRecord) => {
    setSelectedMunicipality(muni);
  };

  const handleOpenModal = (muni: MunicipalityRecord) => {
    setSelectedMunicipality(muni);
    setModalMunicipality(muni);
  };

  const handleConsultAI = (muni: MunicipalityRecord) => {
    setSelectedMunicipality(muni);
    setActiveTab('ai');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex flex-col selection:bg-rose-500 selection:text-white">
      {/* Header with Navigation and Status */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        totalMunicipalities={municipalities.length}
        totalDepartments={DEPARTMENTS_DATA.length}
        criticalCount={criticalCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Global Situation Overview KPI Cards */}
        <section id="kpi-overview-section" className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            id="kpi-municipalities"
            label="Focos Territoriales Auditados"
            value={`${municipalities.length} Municipios`}
            subValue="19 Departamentos bajo observación especial"
            source="Registraduría Nacional del Estado Civil"
            icon={MapPin}
            variant="neutral"
            trend="100% Cobertura"
          />

          <StatCard
            id="kpi-critical"
            label="Amenaza Crítica Activa"
            value={`${criticalCount} Municipios`}
            subValue="Combates, drones y confinamiento forzado"
            source="Defensoría del Pueblo (Sistema de Alertas)"
            icon={ShieldAlert}
            variant="danger"
            trend="Alerta Roja"
          />

          <StatCard
            id="kpi-mesas"
            label="Infraestructura Electoral"
            value={`${totalMesas.toLocaleString()} Mesas`}
            subValue={`${(totalVotos / 1000000).toFixed(2)}M sufragios en áreas de disputa`}
            source="Consolidado Oficial Formulario E-26"
            icon={BarChart3}
            variant="info"
            trend="E-26 Oficial"
          />

          <StatCard
            id="kpi-record"
            label="Concentración Máxima Registrada"
            value={`${maxPctRecord.pct}%`}
            subValue={`${maxPctRecord.name} (${maxPctRecord.dept})`}
            source="Escrutinio Oficial Segunda Vuelta"
            icon={Flame}
            variant="warning"
            trend="Récord Nacional"
          />
        </section>

        {/* Tab View Switcher */}
        {activeTab === 'map' && (
          <section id="view-map">
            <TacticalMap
              municipalities={municipalities}
              onSelectMunicipality={handleSelectMunicipality}
              selectedMunicipality={selectedMunicipality}
              onOpenModal={handleOpenModal}
            />
          </section>
        )}

        {activeTab === 'analytics' && (
          <section id="view-analytics">
            <AnalyticsView
              municipalities={municipalities}
              onSelectMunicipality={handleSelectMunicipality}
            />
          </section>
        )}

        {activeTab === 'dossier' && (
          <section id="view-dossier">
            <MunicipalDossierTable
              municipalities={municipalities}
              onSelectMunicipality={handleSelectMunicipality}
            />
          </section>
        )}

        {activeTab === 'actors' && (
          <section id="view-actors">
            <ThreatActorsMatrix />
          </section>
        )}

        {activeTab === 'ai' && (
          <section id="view-ai">
            <AiIntelligenceAnalyst
              municipalities={municipalities}
              selectedMunicipality={selectedMunicipality}
            />
          </section>
        )}

        {activeTab === 'report' && (
          <section id="view-report">
            <ExecutiveReport municipalities={municipalities} />
          </section>
        )}
      </main>

      {/* Full Municipality Dossier Modal */}
      <MunicipalityModal
        municipality={modalMunicipality}
        onClose={() => setModalMunicipality(null)}
        onConsultAI={handleConsultAI}
      />

      {/* Tactical Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 mt-auto text-xs text-slate-500 font-mono">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span>OBSERVATORIO GEOPOLÍTICO Y ELECTORAL DE COLOMBIA</span>
          </div>
          <div>
            Datos Oficiales: Registraduría Nacional (E-26) • CNE • Defensoría del Pueblo • MinDefensa
          </div>
        </div>
      </footer>
    </div>
  );
}
