import { CorporateKPI } from '../types';

/**
 * 17 Corporate KPIs strictly defined from the Balanced Scorecard document (August 2026).
 * Grouped into 4 Balanced Scorecard Perspectives:
 * 1. Shareholders (4 KPIs, Total Weight: 35%)
 * 2. Customer (2 KPIs, Total Weight: 20%)
 * 3. Internal Process (8 KPIs, Total Weight: 38%)
 * 4. Learning & Growth (3 KPIs, Total Weight: 7%)
 * Total Weight: 100%
 *
 * NOTE: The AI engine and system will strictly NOT modify the names, weights, perspectives, or targets of these Corporate KPIs.
 */
export const CORPORATE_KPIS: CorporateKPI[] = [
  // 1. SHAREHOLDERS
  {
    id: 'corp-sh-1',
    name: 'NPAT (Net Profit After Tax)',
    category: 'Shareholders',
    weight: '10%',
    weightValue: 10,
    target: '36.09 MM USD',
    code: 'SH-01',
    description: 'Laba bersih setelah pajak korporat untuk periode tahun berjalan target 36.09 Juta USD.'
  },
  {
    id: 'corp-sh-2',
    name: 'GeoHazard Risk Mitigation Project',
    category: 'Shareholders',
    weight: '10%',
    weightValue: 10,
    target: '100% Accomplished',
    code: 'SH-02',
    description: 'Penyelesaian program mitigasi risiko geohazard (pergeseran tanah, longsor, erosi pipa transmisi) sesuai rencana kerja.'
  },
  {
    id: 'corp-sh-3',
    name: 'Major Project Contract Utilization*',
    category: 'Shareholders',
    weight: '10%',
    weightValue: 10,
    target: '100% Accomplished',
    code: 'SH-03',
    description: 'Utilisasi dan eksekusi kontrak proyek-proyek strategis utama transmisi gas secara tepat waktu dan on-budget.'
  },
  {
    id: 'corp-sh-4',
    name: 'Governance, Risk management and Compliance (GRC) Programs',
    category: 'Shareholders',
    weight: '5%',
    weightValue: 5,
    target: '100% Accomplished 31 Des 2026',
    code: 'SH-04',
    description: 'Implementasi menyeluruh program Tata Kelola, Manajemen Risiko, dan Kepatuhan regulasi gas dan perundangan.'
  },

  // 2. CUSTOMER
  {
    id: 'corp-cu-1',
    name: 'Customer Complaint Management',
    category: 'Customer',
    weight: '10%',
    weightValue: 10,
    target: '100% Resolved',
    code: 'CU-01',
    description: 'Penanganan dan penyelesaian keluhan pelanggan (shipper gas, pembangkit, industri) hingga tuntas 100%.'
  },
  {
    id: 'corp-cu-2',
    name: 'Gas Delivered',
    category: 'Customer',
    weight: '10%',
    weightValue: 10,
    target: '100.00%',
    code: 'CU-02',
    description: 'Penyaluran dan pengiriman volume gas alam sesuai nominasi kontrak perjanjian transportasi gas (GTA).'
  },

  // 3. INTERNAL PROCESS
  {
    id: 'corp-ip-1',
    name: 'Unaccounted for Gas',
    category: 'Internal Process',
    weight: '5%',
    weightValue: 5,
    target: 'Maximum 0.175%',
    code: 'IP-01',
    description: 'Pengendalian selisih gas tidak terhitung (UAG/losses) pada sistem jaringan pipa transmisi di bawah toleransi 0.175%.'
  },
  {
    id: 'corp-ip-2',
    name: 'Operation Excellence **',
    category: 'Internal Process',
    weight: '8%',
    weightValue: 8,
    target: '100.00%',
    code: 'IP-02',
    description: 'Keandalan operasi transmisi gas (availability, reliability, zero unplanned downtime pipa & kompresor).'
  },
  {
    id: 'corp-ip-3',
    name: 'Accomplishment HSSE programs',
    category: 'Internal Process',
    weight: '5%',
    weightValue: 5,
    target: '100% Accomplished 31 December 2026',
    code: 'IP-03',
    description: 'Pencapaian 100% program Keselamatan, Kesehatan Kerja, Keamanan dan Lindungan Lingkungan (HSSE).'
  },
  {
    id: 'corp-ip-4',
    name: 'Lost Time Injuries',
    category: 'Internal Process',
    weight: '5%',
    weightValue: 5,
    target: 'Zero LTI',
    code: 'IP-04',
    description: 'Nir-kecelakaan kerja yang mengakibatkan kehilangan jam kerja (Zero Lost Time Injury).'
  },
  {
    id: 'corp-ip-5',
    name: 'Resolved Audit Findings',
    category: 'Internal Process',
    weight: '3%',
    weightValue: 3,
    target: '100.00% Resolved',
    code: 'IP-05',
    description: 'Penyelesaian tindak lanjut temuan audit internal, eksternal, BPK, dan inspeksi teknis perpipaan 100%.'
  },
  {
    id: 'corp-ip-6',
    name: 'On time Procurement Process',
    category: 'Internal Process',
    weight: '2%',
    weightValue: 2,
    target: '100% SLA Achievement',
    code: 'IP-06',
    description: 'Ketepatan waktu proses pengadaan barang/jasa perbaikan & material gas transmisi sesuai Service Level Agreement.'
  },
  {
    id: 'corp-ip-7',
    name: 'Environment Social and Governance (ESG) Implementation',
    category: 'Internal Process',
    weight: '5%',
    weightValue: 5,
    target: '100% Programs Accomplished',
    code: 'IP-07',
    description: 'Pelaksanaan inisiatif ESG, dekarbonisasi, reduksi gas suar/venting, dan program keberlanjutan sosial.'
  },
  {
    id: 'corp-ip-8',
    name: 'Business Process Improvement on Eng & Operation',
    category: 'Internal Process',
    weight: '5%',
    weightValue: 5,
    target: '100% Accomplished 31 Des 2026',
    code: 'IP-08',
    description: 'Peningkatan efisiensi dan digitalisasi proses bisnis operasional, perpipaan, dan keteknikan.'
  },

  // 4. LEARNING & GROWTH
  {
    id: 'corp-lg-1',
    name: 'Job Grade Review for all position',
    category: 'Learning & Growth',
    weight: '3%',
    weightValue: 3,
    target: '100.00% Accomplished',
    code: 'LG-01',
    description: 'Penyelesaian peninjauan dan evaluasi standarisasi level/grade jabatan untuk seluruh posisi organisasi.'
  },
  {
    id: 'corp-lg-2',
    name: 'Assessment for internalization culture refer to AKHLAK',
    category: 'Learning & Growth',
    weight: '2%',
    weightValue: 2,
    target: '100.00% Accomplished',
    code: 'LG-02',
    description: 'Pengukuran dan internalisasi nilai budaya kerja AKHLAK (Amanah, Kompeten, Harmonis, Loyal, Adaptif, Kolaboratif).'
  },
  {
    id: 'corp-lg-3',
    name: 'Operational Excellence (OE) Implementation (Sub Pillars)',
    category: 'Learning & Growth',
    weight: '2%',
    weightValue: 2,
    target: '100.00% Accomplished',
    code: 'LG-03',
    description: 'Implementasi sub-pilar Operational Excellence pada kompetensi personel, budaya keandalan, dan sertifikasi teknis.'
  }
];

export const BSC_PERSPECTIVE_META: Record<
  CorporateKPI['category'],
  { label: string; color: string; bgBadge: string; textBadge: string; border: string; desc: string }
> = {
  'Shareholders': {
    label: '1. Shareholders (Keuangan & Nilai Pemegang Saham)',
    color: 'emerald',
    bgBadge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    textBadge: 'text-emerald-700',
    border: 'border-emerald-300',
    desc: 'Target profitabilitas, eksekusi proyek mitigasi risiko geohazard, utilisasi kontrak, dan tata kelola GRC.'
  },
  'Customer': {
    label: '2. Customer (Kepuasan Pelanggan & Shipper)',
    color: 'blue',
    bgBadge: 'bg-blue-50 text-blue-800 border-blue-200',
    textBadge: 'text-blue-700',
    border: 'border-blue-300',
    desc: 'Penyaluran gas andal (Gas Delivered) dan responsivitas keluhan pelanggan.'
  },
  'Internal Process': {
    label: '3. Internal Process (Keandalan Operasi, Integritas & HSSE)',
    color: 'indigo',
    bgBadge: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    textBadge: 'text-indigo-700',
    border: 'border-indigo-300',
    desc: 'Pengendalian UAG gas losses, operational excellence, HSSE zero LTI, audit findings, ESG, dan perbaikan proses teknik.'
  },
  'Learning & Growth': {
    label: '4. Learning & Growth (Kapabilitas SDM & Budaya Kerja)',
    color: 'amber',
    bgBadge: 'bg-amber-50 text-amber-800 border-amber-200',
    textBadge: 'text-amber-700',
    border: 'border-amber-300',
    desc: 'Evaluasi Job Grade jabatan, internalisasi budaya AKHLAK, dan implementasi sub-pilar OE.'
  }
};
