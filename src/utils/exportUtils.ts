import * as XLSX from 'xlsx';
import { DivisionKPI, OfficerKPI, DivisionProfile, OfficerProfile } from '../types';

/**
 * Utility functions for exporting KPIs to Excel (.xlsx), CSV (.csv), and Google Sheets formats.
 */

export function exportDivisionKPIsToExcel(
  kpis: DivisionKPI[],
  profile: DivisionProfile,
  fileName: string = 'MARKPITER_KPI_Divisi.xlsx'
) {
  const activeKpis = kpis.filter(k => k.isSelected !== false);

  // 1. Data rows matching the exact required format:
  // | Division KPI | Definition | Measurement/Formula | Unit | Target | KPI Type | KPI Owner | Rationale
  const rows = activeKpis.map((kpi, index) => ({
    'No': index + 1,
    'Division KPI': kpi.divisionKpi,
    'Definition': kpi.definition,
    'Measurement/Formula': kpi.measurementFormula,
    'Unit': kpi.unit,
    'Target': kpi.target,
    'KPI Type': kpi.kpiType,
    'KPI Owner': kpi.kpiOwner || `Kepala ${profile.divisionName}`,
    'Rationale': kpi.rationale,
    'Gas Transmission Code / Standard': kpi.gasStandardRef || '-',
    'Linked Corporate KPI': kpi.linkedCorporateKpiName || '-'
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 5 },  // No
    { wch: 40 }, // Division KPI
    { wch: 50 }, // Definition
    { wch: 35 }, // Measurement/Formula
    { wch: 18 }, // Unit
    { wch: 22 }, // Target
    { wch: 20 }, // KPI Type
    { wch: 32 }, // KPI Owner
    { wch: 55 }, // Rationale
    { wch: 30 }, // Gas Transmission Code
    { wch: 35 }  // Linked Corporate KPI
  ];

  // Create Profile Summary sheet
  const profileRows = [
    { 'Parameter Profil Divisi': 'Nama Divisi', 'Informasi': profile.divisionName },
    { 'Parameter Profil Divisi': 'Deskripsi Singkat', 'Informasi': profile.divisionDescription },
    { 'Parameter Profil Divisi': 'Uraian Tugas (Job Desc)', 'Informasi': profile.jobDesc },
    { 'Parameter Profil Divisi': 'Key Deliverables / Output', 'Informasi': profile.keyDeliverables },
    { 'Parameter Profil Divisi': 'Total KPI Divisi Terpilih', 'Informasi': `${activeKpis.length} KPI` },
    { 'Parameter Profil Divisi': 'Tanggal Penyusunan', 'Informasi': new Date().toLocaleDateString('id-ID', { dateStyle: 'full' }) },
    { 'Parameter Profil Divisi': 'Sistem', 'Informasi': 'MARKPITER (Matriks KPI Terintegrasi - ASME/API/PHMSA/ISO Compliant)' }
  ];
  const profileSheet = XLSX.utils.json_to_sheet(profileRows);
  profileSheet['!cols'] = [{ wch: 28 }, { wch: 80 }];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, profileSheet, 'Profil Divisi');
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Matriks KPI Divisi');

  XLSX.writeFile(workbook, fileName);
}

export function exportDivisionKPIsToCSV(
  kpis: DivisionKPI[],
  profile: DivisionProfile,
  fileName: string = 'MARKPITER_KPI_Divisi.csv'
) {
  const activeKpis = kpis.filter(k => k.isSelected !== false);

  const headers = [
    'Division KPI',
    'Definition',
    'Measurement/Formula',
    'Unit',
    'Target',
    'KPI Type',
    'KPI Owner',
    'Rationale'
  ];

  const csvRows = [
    headers.join(','),
    ...activeKpis.map(k => [
      `"${escapeCSV(k.divisionKpi)}"`,
      `"${escapeCSV(k.definition)}"`,
      `"${escapeCSV(k.measurementFormula)}"`,
      `"${escapeCSV(k.unit)}"`,
      `"${escapeCSV(k.target)}"`,
      `"${escapeCSV(k.kpiType)}"`,
      `"${escapeCSV(k.kpiOwner || `Kepala ${profile.divisionName}`)}"`,
      `"${escapeCSV(k.rationale)}"`
    ].join(','))
  ];

  const csvContent = '\uFEFF' + csvRows.join('\r\n');
  downloadBlob(csvContent, 'text/csv;charset=utf-8;', fileName);
}

export function exportOfficerKPIsToExcel(
  kpis: OfficerKPI[],
  officerProfile: OfficerProfile,
  fileName: string = 'MARKPITER_KPI_Officer.xlsx'
) {
  const activeKpis = kpis.filter(k => k.isSelected !== false);

  const rows = activeKpis.map((kpi, index) => ({
    'No': index + 1,
    'Officer KPI': kpi.officerKpi,
    'Definition': kpi.definition,
    'Measurement/Formula': kpi.measurementFormula,
    'Unit': kpi.unit,
    'Target': kpi.target,
    'KPI Type': kpi.kpiType,
    'Cascaded From Division KPI': kpi.cascadedFromDivisionKpi,
    'Rationale': kpi.rationale,
    'Standard Code Ref': kpi.gasStandardRef || '-',
    'Estimasi Bobot': kpi.weightEstimate ? `${kpi.weightEstimate}%` : '-'
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);

  worksheet['!cols'] = [
    { wch: 5 },  // No
    { wch: 42 }, // Officer KPI
    { wch: 50 }, // Definition
    { wch: 35 }, // Measurement/Formula
    { wch: 18 }, // Unit
    { wch: 22 }, // Target
    { wch: 20 }, // KPI Type
    { wch: 45 }, // Cascaded From Division KPI
    { wch: 55 }, // Rationale
    { wch: 28 }, // Standard Code
    { wch: 15 }  // Estimasi Bobot
  ];

  const profileRows = [
    { 'Parameter Profil Jabatan': 'Nama Jabatan / Posisi', 'Informasi': officerProfile.positionName },
    { 'Parameter Profil Jabatan': 'Deskripsi Singkat Tanggung Jawab', 'Informasi': officerProfile.positionDescription },
    { 'Parameter Profil Jabatan': 'Uraian Pekerjaan (Job Desc)', 'Informasi': officerProfile.jobDesc },
    { 'Parameter Profil Jabatan': 'Performance Measures', 'Informasi': officerProfile.performanceMeasures },
    { 'Parameter Profil Jabatan': 'Total KPI Turunan Terpilih', 'Informasi': `${activeKpis.length} KPI` },
    { 'Parameter Profil Jabatan': 'Tanggal Penyusunan', 'Informasi': new Date().toLocaleDateString('id-ID', { dateStyle: 'full' }) }
  ];
  const profileSheet = XLSX.utils.json_to_sheet(profileRows);
  profileSheet['!cols'] = [{ wch: 32 }, { wch: 80 }];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, profileSheet, 'Profil Jabatan');
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Matriks KPI Officer');

  XLSX.writeFile(workbook, fileName);
}

export function exportOfficerKPIsToCSV(
  kpis: OfficerKPI[],
  officerProfile: OfficerProfile,
  fileName: string = 'MARKPITER_KPI_Officer.csv'
) {
  const activeKpis = kpis.filter(k => k.isSelected !== false);

  const headers = [
    'Officer KPI',
    'Definition',
    'Measurement/Formula',
    'Unit',
    'Target',
    'KPI Type',
    'Cascaded From Division KPI',
    'Rationale'
  ];

  const csvRows = [
    headers.join(','),
    ...activeKpis.map(k => [
      `"${escapeCSV(k.officerKpi)}"`,
      `"${escapeCSV(k.definition)}"`,
      `"${escapeCSV(k.measurementFormula)}"`,
      `"${escapeCSV(k.unit)}"`,
      `"${escapeCSV(k.target)}"`,
      `"${escapeCSV(k.kpiType)}"`,
      `"${escapeCSV(k.cascadedFromDivisionKpi)}"`,
      `"${escapeCSV(k.rationale)}"`
    ].join(','))
  ];

  const csvContent = '\uFEFF' + csvRows.join('\r\n');
  downloadBlob(csvContent, 'text/csv;charset=utf-8;', fileName);
}

export function exportAllIntegratedToExcel(
  divisionProfile: DivisionProfile,
  divisionKpis: DivisionKPI[],
  officerProfile: OfficerProfile,
  officerKpis: OfficerKPI[],
  fileName: string = 'MARKPITER_Matriks_KPI_Terintegrasi.xlsx'
) {
  const workbook = XLSX.utils.book_new();

  // 1. Division Sheet
  const divRows = divisionKpis.filter(k => k.isSelected !== false).map((kpi, idx) => ({
    'No': idx + 1,
    'Division KPI': kpi.divisionKpi,
    'Definition': kpi.definition,
    'Measurement/Formula': kpi.measurementFormula,
    'Unit': kpi.unit,
    'Target': kpi.target,
    'KPI Type': kpi.kpiType,
    'KPI Owner': kpi.kpiOwner || `Kepala ${divisionProfile.divisionName}`,
    'Rationale': kpi.rationale,
    'Standard Code': kpi.gasStandardRef || '-'
  }));
  const divSheet = XLSX.utils.json_to_sheet(divRows);
  XLSX.utils.book_append_sheet(workbook, divSheet, 'KPI Divisi');

  // 2. Officer Sheet
  const offRows = officerKpis.filter(k => k.isSelected !== false).map((kpi, idx) => ({
    'No': idx + 1,
    'Officer KPI': kpi.officerKpi,
    'Definition': kpi.definition,
    'Measurement/Formula': kpi.measurementFormula,
    'Unit': kpi.unit,
    'Target': kpi.target,
    'KPI Type': kpi.kpiType,
    'Cascaded From Division KPI': kpi.cascadedFromDivisionKpi,
    'Rationale': kpi.rationale,
    'Standard Code': kpi.gasStandardRef || '-'
  }));
  const offSheet = XLSX.utils.json_to_sheet(offRows);
  XLSX.utils.book_append_sheet(workbook, offSheet, 'KPI Officer');

  XLSX.writeFile(workbook, fileName);
}

/**
 * Convenient aliases for components
 */
export const exportDivisionKpisToExcel = (profile: DivisionProfile, kpis: DivisionKPI[]) => 
  exportDivisionKPIsToExcel(kpis, profile);

export const exportDivisionKpisToCSV = (profile: DivisionProfile, kpis: DivisionKPI[]) => 
  exportDivisionKPIsToCSV(kpis, profile);

export const exportDivisionKpisToTSV = (kpis: DivisionKPI[], profile?: DivisionProfile): string => {
  const activeKpis = kpis.filter(k => k.isSelected !== false);
  const headers = ['Division KPI', 'Definition', 'Measurement/Formula', 'Unit', 'Target', 'KPI Type', 'KPI Owner', 'Rationale'];
  const rows = activeKpis.map(k => [
    k.divisionKpi,
    k.definition,
    k.measurementFormula,
    k.unit,
    k.target,
    k.kpiType,
    k.kpiOwner || (profile ? `Kepala ${profile.divisionName}` : 'Kepala Divisi'),
    k.rationale
  ]);
  return [headers.join('\t'), ...rows.map(r => r.map(c => (c || '').replace(/[\t\n\r]+/g, ' ')).join('\t'))].join('\n');
};

export const exportOfficerKpisToExcel = (profile: OfficerProfile, kpis: OfficerKPI[]) => 
  exportOfficerKPIsToExcel(kpis, profile);

export const exportOfficerKpisToCSV = (profile: OfficerProfile, kpis: OfficerKPI[]) => 
  exportOfficerKPIsToCSV(kpis, profile);

export const exportOfficerKpisToTSV = (kpis: OfficerKPI[]): string => {
  const activeKpis = kpis.filter(k => k.isSelected !== false);
  const headers = ['Officer KPI', 'Definition', 'Measurement/Formula', 'Unit', 'Target', 'KPI Type', 'Cascaded From Division KPI', 'Rationale'];
  const rows = activeKpis.map(k => [
    k.officerKpi,
    k.definition,
    k.measurementFormula,
    k.unit,
    k.target,
    k.kpiType,
    k.cascadedFromDivisionKpi,
    k.rationale
  ]);
  return [headers.join('\t'), ...rows.map(r => r.map(c => (c || '').replace(/[\t\n\r]+/g, ' ')).join('\t'))].join('\n');
};

function escapeCSV(text: string | undefined): string {
  if (!text) return '';
  return text.replace(/"/g, '""').replace(/\r\n/g, ' ').replace(/\n/g, ' ');
}

function downloadBlob(content: string, mimeType: string, filename: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
