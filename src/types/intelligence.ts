export type ThreatLevel = 'Crítico' | 'Muy Alto' | 'Alto' | 'Moderado';

export type ArmedGroupCategory =
  | 'Clan del Golfo / AGC'
  | 'ACSN (Los Pachenca)'
  | 'ELN'
  | 'Disidencias FARC (Iván Mordisco / EMC)'
  | 'Disidencias FARC (Calarcá / Suárez Briceño)'
  | 'Segunda Marquetalia'
  | 'Comandos de Frontera (CDF)'
  | 'GDOs Urbanos (Costeños/Pepes/Inmaculada/Flacos)'
  | 'Comuneros del Sur / AUN';

export type TacticalModality =
  | 'Uso de Drones con Explosivos'
  | 'Salida Marítima / Lanchas Go-Fast'
  | 'Semisumergibles'
  | 'Minería Ilegal de Oro'
  | 'Extorsión Agropecuaria y Ganadera'
  | 'Extorsión Comercial y Servicios'
  | 'Confinamiento y Paros Armados'
  | 'Reclutamiento Forzado de Menores'
  | 'Tráfico y Acopio de Armamento'
  | 'Corredores Fluviales Estratégicos'
  | 'Asonadas a Fuerza Pública'
  | 'Ataques a Infraestructura';

export interface MunicipalityRecord {
  id: string;
  name: string;
  department: string;
  departmentSlug: string;
  region: 'Caribe' | 'Pacífico' | 'Andina Suroccidente' | 'Amazonía-Orinoquía' | 'Insular' | 'Capital';
  mesas: number;
  votos: number;
  porcentaje: number;
  gruposArmados: ArmedGroupCategory[];
  subestructuras: string[];
  modalidades: TacticalModality[];
  nivelRiesgo: ThreatLevel;
  poblacionContexto?: string;
  posicionGeoestrategica: string;
  analisisOrdenPublico: string;
  alertasDestacadas?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface DepartmentSummary {
  name: string;
  slug: string;
  region: 'Caribe' | 'Pacífico' | 'Andina Suroccidente' | 'Amazonía-Orinoquía' | 'Insular' | 'Capital';
  municipiosCount: number;
  totalMesas: number;
  totalVotos: number;
  promedioPorcentaje: number;
  principalesActores: ArmedGroupCategory[];
  enfoqueEstrategico: string;
}
