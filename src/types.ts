export type BSCCategory = 'Shareholders' | 'Customer' | 'Internal Process' | 'Learning & Growth';

export interface CorporateKPI {
  id: string;
  name: string;
  category: BSCCategory;
  weight: string; // e.g. "10%"
  weightValue: number; // e.g. 10
  target: string;
  code?: string;
  description?: string;
}

export interface DivisionProfile {
  divisionName: string;
  divisionDescription: string;
  jobDesc: string;
  keyDeliverables: string;
  targetYear?: string;
}

export interface DivisionKPI {
  id: string;
  divisionKpi: string;
  definition: string;
  measurementFormula: string;
  unit: string;
  target: string;
  kpiType: BSCCategory;
  kpiOwner: string;
  rationale: string;
  linkedCorporateKpiId?: string;
  linkedCorporateKpiName?: string;
  gasStandardRef?: string; // e.g., ASME B31.8S, API 1160, PHMSA 192
  weightEstimate?: number;
  isSelected?: boolean;
}

export interface OfficerProfile {
  positionName: string;
  positionDescription: string;
  jobDesc: string;
  performanceMeasures: string;
  divisionName?: string;
}

export interface OfficerKPI {
  id: string;
  officerKpi: string;
  definition: string;
  measurementFormula: string;
  unit: string;
  target: string;
  kpiType: BSCCategory;
  cascadedFromDivisionKpi: string;
  weightEstimate?: number;
  rationale: string;
  gasStandardRef?: string;
  isSelected?: boolean;
}

export type MainMenu = 'division' | 'officer';

export type DivisionStep = 
  | 'corporate_kpi' // 1. Input & Pilih KPI Korporat
  | 'division_profile' // 2. Input Profil Divisi
  | 'division_kpi_results'; // 3. Hasil & Kelola KPI Divisi

export type OfficerStep =
  | 'select_division_kpi' // 1. Cascade KPI Divisi
  | 'officer_profile' // 2. Input Profil Jabatan
  | 'officer_kpi_results'; // 3. Hasil & Kelola KPI Officer

export interface AppDraft {
  lastUpdated: string;
  selectedCorporateKpiIds: string[];
  divisionProfile: DivisionProfile;
  divisionKpis: DivisionKPI[];
  officerProfile: OfficerProfile;
  officerSelectedDivisionKpiIds: string[];
  officerKpis: OfficerKPI[];
}
