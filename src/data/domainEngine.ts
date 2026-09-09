import { CorporateKPI, DivisionProfile, DivisionKPI, OfficerProfile, OfficerKPI } from '../types';
import { CORPORATE_KPIS } from './corporateKPIs';

/**
 * Intelligent Gas Transmission Domain Engine
 * Translates Corporate KPIs + Division Profile into standardized Division KPIs,
 * and cascades Division KPIs into Officer KPIs using ASME, API, PHMSA, and ISO standards.
 */

export function generateDivisionKPIsOffline(
  selectedCorpKpis: CorporateKPI[],
  profile: DivisionProfile
): DivisionKPI[] {
  const result: DivisionKPI[] = [];
  const textCorpus = `${profile.divisionName} ${profile.divisionDescription} ${profile.jobDesc} ${profile.keyDeliverables}`.toLowerCase();

  // If no corporate KPIs selected, default to all relevant ones
  const corpPool = selectedCorpKpis.length > 0 ? selectedCorpKpis : CORPORATE_KPIS;

  // Process selected Corporate KPIs
  corpPool.forEach((corp, idx) => {
    // Generate specialized division KPIs aligned to this corporate KPI
    const id = `div-kpi-${Date.now()}-${idx + 1}`;
    
    if (corp.id === 'corp-sh-1') {
      // NPAT
      result.push({
        id: `${id}-a`,
        divisionKpi: `Optimalisasi Efisiensi Biaya Operasional (OPEX) & Kepatuhan Anggaran Divisi ${profile.divisionName}`,
        definition: `Pengendalian realisasi anggaran belanja operasional (OPEX) perbaikan dan perawatan fasilitas transmisi gas di bawah pagu RKAP yang telah disetujui untuk mendukung target NPAT korporat.`,
        measurementFormula: `(Realisasi OPEX Divisi / Anggaran RKAP Disetujui) * 100%`,
        unit: '% Realisasi vs Budget',
        target: '<= 100.00% on Budget',
        kpiType: 'Shareholders',
        kpiOwner: `Kepala ${profile.divisionName}`,
        rationale: `Berkontribusi langsung pada target profitabilitas korporat (NPAT ${corp.target}) dengan mengoptimalkan biaya pemeliharaan dan operasi tanpa mengurangi standar keselamatan teknis ASME B31.8.`,
        linkedCorporateKpiId: corp.id,
        linkedCorporateKpiName: corp.name,
        gasStandardRef: 'ISO 55001 / ASME B31.8',
        weightEstimate: 10,
        isSelected: true
      });
    } else if (corp.id === 'corp-sh-2') {
      // GeoHazard Risk Mitigation Project
      result.push({
        id: `${id}-a`,
        divisionKpi: `Ketercapaian Program Mitigasi Risiko Geohazard & Stabilitas Jalur Pipa Transmisi`,
        definition: `Penyelesaian seluruh tahapan survei geoteknik, pemasangan sistem instrumentasi inclinometer/tiltmeter, perkuatan lereng perlintasan pipa (rip-rap/retaining wall), dan rekayasa penanganan zona rawan longsor/patahan aktif.`,
        measurementFormula: `(Jumlah Milestone Proyek Mitigasi Geohazard Terealisasi / Total Rencana Milestone) * 100%`,
        unit: '% Milestone Selesai',
        target: '100% Accomplished',
        kpiType: 'Shareholders',
        kpiOwner: `Kepala ${profile.divisionName}`,
        rationale: `Secara langsung mengeksekusi KPI Korporat GeoHazard Risk Mitigation Project (Bobot 10%) untuk mencegah pipa rupture/deformasi akibat pergerakan tanah sesuai pedoman ASME B31.8S Annex A & API 1160.`,
        linkedCorporateKpiId: corp.id,
        linkedCorporateKpiName: corp.name,
        gasStandardRef: 'ASME B31.8S / API 1160 / PHMSA 192',
        weightEstimate: 15,
        isSelected: true
      });
    } else if (corp.id === 'corp-sh-3') {
      // Major Project Contract Utilization
      result.push({
        id: `${id}-a`,
        divisionKpi: `Ketercapaian Utilisasi & Eksekusi Kontrak Pekerjaan Strategis Divisi Tepat Waktu`,
        definition: `Realisasi utilisasi kontrak pengadaan jasa inspeksi pipa (ILI Pigging, NDT, Proteksi Katodik, Penggantian Valve) sesuai schedule progress dan Terms of Reference (TOR).`,
        measurementFormula: `(Volume Eksekusi Kontrak Terealisasi / Target Kontrak Tahunan) * 100%`,
        unit: '% Utilisasi Kontrak',
        target: '100% Accomplished',
        kpiType: 'Shareholders',
        kpiOwner: `Kepala ${profile.divisionName}`,
        rationale: `Menjamin kelancaran pelaksanaan kontrak proyek utama perpipaan dan penyerapan investasi tepat waktu sesuai target korporat Major Project Contract Utilization.`,
        linkedCorporateKpiId: corp.id,
        linkedCorporateKpiName: corp.name,
        gasStandardRef: 'ISO 55001 / API 1160',
        weightEstimate: 10,
        isSelected: true
      });
    } else if (corp.id === 'corp-sh-4') {
      // GRC Programs
      result.push({
        id: `${id}-a`,
        divisionKpi: `Implementasi Program Tata Kelola, Manajemen Risiko (Risk Profile) & Kepatuhan Regulasi Pipa`,
        definition: `Pemutakhiran mitigasi pada Risk Register divisi dan pemenuhan 100% regulasi perizinan kelaikan teknis pipa (SKKP/SKPP Migas ESDM & Kemenhub).`,
        measurementFormula: `(Jumlah Program Mitigasi Risiko & Dokumen Kepatuhan Terpenuhi / Target Program) * 100%`,
        unit: '% Kepatuhan Program',
        target: '100% Accomplished 31 Des 2026',
        kpiType: 'Shareholders',
        kpiOwner: `Kepala ${profile.divisionName}`,
        rationale: `Mendukung pencapaian KPI Korporat GRC Programs (5%) dalam menjamin operasi bebas sanksi regulasi dan transparansi manajemen risiko perpipaan.`,
        linkedCorporateKpiId: corp.id,
        linkedCorporateKpiName: corp.name,
        gasStandardRef: 'ISO 31000 / Permen ESDM No. 32 / PHMSA 192',
        weightEstimate: 5,
        isSelected: true
      });
    } else if (corp.id === 'corp-cu-1') {
      // Customer Complaint Management
      result.push({
        id: `${id}-a`,
        divisionKpi: `Tingkat Kecepatan & Ketuntasan Penyelesaian Keluhan Teknis Pelanggan Gas`,
        definition: `Penyelesaian investigasi dan tindakan korektif terhadap komplain teknis pelanggan (shipper) terkait fluktuasi tekanan, kendala flow metering, atau kotoran gas dalam batas waktu SLA.`,
        measurementFormula: `(Jumlah Keluhan Pelanggan yang Tuntas Diselesaikan / Total Keluhan Masuk) * 100%`,
        unit: '% Resolved SLA',
        target: '100% Resolved',
        kpiType: 'Customer',
        kpiOwner: `Kepala ${profile.divisionName}`,
        rationale: `Mendukung pencapaian KPI Korporat Customer Complaint Management (10%) untuk menjaga kepuasan konsumen gas dan reputasi keandalan transmisi.`,
        linkedCorporateKpiId: corp.id,
        linkedCorporateKpiName: corp.name,
        gasStandardRef: 'ISO 9001 / GTA (Gas Transportation Agreement)',
        weightEstimate: 10,
        isSelected: true
      });
    } else if (corp.id === 'corp-cu-2') {
      // Gas Delivered
      result.push({
        id: `${id}-a`,
        divisionKpi: `Keandalan Kontinuitas & Ketercapaian Penyaluran Gas Alam Sesuai Nominasi Kontrak`,
        definition: `Menjaga stabilitas penyaluran gas tanpa gangguan supply (unplanned outage) untuk menjamin volume gas yang diterima shipper 100% sesuai komitmen GTA.`,
        measurementFormula: `(Volume Aktual Gas Tersalurkan / Total Nominasi Gas Terjadwal) * 100%`,
        unit: '% Penyaluran Gas',
        target: '100.00%',
        kpiType: 'Customer',
        kpiOwner: `Kepala ${profile.divisionName}`,
        rationale: `Berkorelasi langsung dengan KPI Korporat Gas Delivered (Bobot 10%) sebagai pilar utama penerimaan pendapatan tarif transmisi gas.`,
        linkedCorporateKpiId: corp.id,
        linkedCorporateKpiName: corp.name,
        gasStandardRef: 'ASME B31.8 / ISO 13623 / AGA 9',
        weightEstimate: 15,
        isSelected: true
      });
    } else if (corp.id === 'corp-ip-1') {
      // Unaccounted for Gas (UAG)
      result.push({
        id: `${id}-a`,
        divisionKpi: `Pengendalian Selisih Gas Tidak Terhitung (Unaccounted for Gas / UAG) Jaringan Pipa`,
        definition: `Pengendalian deviasi antara gas yang diterima (custody in) dengan gas yang diserahkan (custody out) melalui kalibrasi metering station, deteksi kebocoran valve, dan venting management.`,
        measurementFormula: `|Gas Inflow - Gas Outflow - Linepack Change| / Total Inflow * 100%`,
        unit: '% Losses (UAG)',
        target: 'Maximum 0.175%',
        kpiType: 'Internal Process',
        kpiOwner: `Kepala ${profile.divisionName}`,
        rationale: `Menopang langsung KPI Korporat Unaccounted for Gas (5%) guna meminimalkan kerugian fisik gas dan emisi metana sesuai standar AGA Report No. 3, 7, 9 & 11.`,
        linkedCorporateKpiId: corp.id,
        linkedCorporateKpiName: corp.name,
        gasStandardRef: 'AGA 3 / AGA 7 / AGA 9 / API MPMS',
        weightEstimate: 10,
        isSelected: true
      });
    } else if (corp.id === 'corp-ip-2') {
      // Operation Excellence
      result.push({
        id: `${id}-a`,
        divisionKpi: `Operational Availability & Reliability Fasilitas Utama Transmisi Gas`,
        definition: `Tingkat kesiapan dan keandalan operasi pipa, stasiun kompresor gas, valve station, dan sistem proteksi katodik untuk beroperasi 24/7 tanpa trip/downtime tak terencana.`,
        measurementFormula: `(Total Jam Operasi Tersedia / Total Jam Kalender) * 100%`,
        unit: '% Availability & Reliability',
        target: '100.00%',
        kpiType: 'Internal Process',
        kpiOwner: `Kepala ${profile.divisionName}`,
        rationale: `Mendukung langsung KPI Korporat Operation Excellence (Bobot 8%) untuk mewujudkan world-class pipeline operational excellence sesuai ASME B31.8 & ISO 13623.`,
        linkedCorporateKpiId: corp.id,
        linkedCorporateKpiName: corp.name,
        gasStandardRef: 'ASME B31.8 / ISO 13623 / API 570',
        weightEstimate: 12,
        isSelected: true
      });
    } else if (corp.id === 'corp-ip-3') {
      // Accomplishment HSSE programs
      result.push({
        id: `${id}-a`,
        divisionKpi: `Ketercapaian Program Kerja Keselamatan Kerja, Process Safety & Lindungan Lingkungan (HSSE)`,
        definition: `Pelaksanaan 100% agenda HSSE divisi meliputi Management Walkthrough (MWT), safety drill kebocoran gas, hazard observation, audit izin kerja panas (PTW), dan pelatihan K3 migas.`,
        measurementFormula: `(Jumlah Program HSSE Terlaksana / Rencana Program HSSE Tahunan) * 100%`,
        unit: '% Accomplished',
        target: '100% Accomplished 31 December 2026',
        kpiType: 'Internal Process',
        kpiOwner: `Kepala ${profile.divisionName}`,
        rationale: `Mendukung pencapaian KPI Korporat Accomplishment HSSE Programs (5%) dalam membangun safety culture tangguh di lingkungan transmisi gas alam bertekanan tinggi.`,
        linkedCorporateKpiId: corp.id,
        linkedCorporateKpiName: corp.name,
        gasStandardRef: 'ISO 45001 / ISO 14001 / PHMSA 192',
        weightEstimate: 8,
        isSelected: true
      });
    } else if (corp.id === 'corp-ip-4') {
      // Lost Time Injuries
      result.push({
        id: `${id}-a`,
        divisionKpi: `Tingkat Kinerja Keselamatan Kerja & Pencegahan Kecelakaan Fatal (Zero LTI)`,
        definition: `Memastikan tidak adanya kecelakaan kerja yang menyebabkan kehilangan hari kerja (Zero Lost Time Injury) bagi seluruh pekerja divisi dan mitra kontraktor lapangan.`,
        measurementFormula: `Jumlah Insiden Kecelakaan Kategori Lost Time Injury (LTI) dalam 1 Tahun`,
        unit: 'Kasus LTI',
        target: 'Zero LTI',
        kpiType: 'Internal Process',
        kpiOwner: `Kepala ${profile.divisionName}`,
        rationale: `Selaras penuh dengan KPI Korporat Lost Time Injuries (5%) dengan target mutlak Zero LTI melalui penerapan ketat Golden Rules Keselamatan Migas.`,
        linkedCorporateKpiId: corp.id,
        linkedCorporateKpiName: corp.name,
        gasStandardRef: 'ISO 45001 / OSHA 1904',
        weightEstimate: 10,
        isSelected: true
      });
    } else if (corp.id === 'corp-ip-5') {
      // Resolved Audit Findings
      result.push({
        id: `${id}-a`,
        divisionKpi: `Penyelesaian 100% Tindak Lanjut Rekomendasi Temuan Audit Internal & Eksternal`,
        definition: `Penyelesaian seluruh corrective and preventive action (CAPA) atas temuan audit operasi, audit finansial, inspeksi kelaikan Ditjen Migas, dan temuan audit BPK/SPI sesuai batas waktu komitmen.`,
        measurementFormula: `(Jumlah Temuan Audit yang Telah Closed / Total Temuan Audit Aktif) * 100%`,
        unit: '% Resolved',
        target: '100.00% Resolved',
        kpiType: 'Internal Process',
        kpiOwner: `Kepala ${profile.divisionName}`,
        rationale: `Mendukung pencapaian KPI Korporat Resolved Audit Findings (3%) guna menjamin continuous compliance dan tata kelola operasi berintegritas.`,
        linkedCorporateKpiId: corp.id,
        linkedCorporateKpiName: corp.name,
        gasStandardRef: 'ISO 9001 / ISO 55001',
        weightEstimate: 5,
        isSelected: true
      });
    } else if (corp.id === 'corp-ip-6') {
      // On time Procurement Process
      result.push({
        id: `${id}-a`,
        divisionKpi: `Ketepatan Waktu Penyusunan & Penyerahan Dokumen Teknis Pengadaan (TOR/HPS)`,
        definition: `Penyerahan Terms of Reference (TOR/KAK), Rencana Anggaran Biaya (Owner Estimate/HPS), dan evaluasi teknis pengadaan barang/jasa perpipaan sesuai Service Level Agreement (SLA).`,
        measurementFormula: `(Paket Dokumen Pengadaan Selesai Sesuai SLA / Total Paket Pengadaan) * 100%`,
        unit: '% SLA Achievement',
        target: '100% SLA Achievement',
        kpiType: 'Internal Process',
        kpiOwner: `Kepala ${profile.divisionName}`,
        rationale: `Mendukung KPI Korporat On time Procurement Process (2%) agar pengadaan suku cadang kritis, pigging vendor, dan material pipa tidak mengalami keterlambatan operasional.`,
        linkedCorporateKpiId: corp.id,
        linkedCorporateKpiName: corp.name,
        gasStandardRef: 'ISO 9001 / Procurement Governance',
        weightEstimate: 5,
        isSelected: true
      });
    } else if (corp.id === 'corp-ip-7') {
      // ESG Implementation
      result.push({
        id: `${id}-a`,
        divisionKpi: `Ketercapaian Program Dekarbonisasi, Reduksi Emisi Gas Buang & Kepatuhan ESG`,
        definition: `Pelaksanaan inisiatif deteksi kebocoran metana (LDAR), optimalisasi konsumsi bahan bakar kompresor gas, dan pengelolaan limbah sludge pigging B3 sesuai baku mutu.`,
        measurementFormula: `(Jumlah Program Inisiatif ESG Terlaksana / Rencana Program ESG Divisi) * 100%`,
        unit: '% Programs Accomplished',
        target: '100% Programs Accomplished',
        kpiType: 'Internal Process',
        kpiOwner: `Kepala ${profile.divisionName}`,
        rationale: `Selaras dengan KPI Korporat Environment Social and Governance (ESG) Implementation (5%) untuk mencapai target dekarbonisasi dan keberlanjutan sektor energi gas bumi.`,
        linkedCorporateKpiId: corp.id,
        linkedCorporateKpiName: corp.name,
        gasStandardRef: 'ISO 14001 / GHG Protocol Scope 1 & 2',
        weightEstimate: 8,
        isSelected: true
      });
    } else if (corp.id === 'corp-ip-8') {
      // Business Process Improvement
      result.push({
        id: `${id}-a`,
        divisionKpi: `Digitalisasi & Continuous Improvement Proses Rekayasa (Engineering) & Operasi`,
        definition: `Implementasi otomatisasi pelaporan operasional (SCADA/PIMS/GIS Dashboard), perbaikan Standar Operasional Prosedur (SOP), dan continuous improvement CIP di bidang transmisi gas.`,
        measurementFormula: `(Inisiatif Improvement / Digitalisasi Terealisasi / Target Inisiatif) * 100%`,
        unit: '% Accomplished',
        target: '100% Accomplished 31 Des 2026',
        kpiType: 'Internal Process',
        kpiOwner: `Kepala ${profile.divisionName}`,
        rationale: `Secara spesifik mengeksekusi KPI Korporat Business Process Improvement on Eng & Operation (5%) untuk meningkatkan efisiensi proses kerja engineering.`,
        linkedCorporateKpiId: corp.id,
        linkedCorporateKpiName: corp.name,
        gasStandardRef: 'ISO 9001 / Lean Six Sigma',
        weightEstimate: 7,
        isSelected: true
      });
    } else if (corp.id === 'corp-lg-1') {
      // Job Grade Review
      result.push({
        id: `${id}-a`,
        divisionKpi: `Ketercapaian Review & Pemutakhiran Job Description & Kompetensi Jabatan Divisi`,
        definition: `Penyelesaian evaluasi beban kerja (workload analysis), uraian jabatan (Job Desc), dan pemutakhiran matrik kompetensi teknis seluruh staf divisi sesuai standar Job Grade korporat.`,
        measurementFormula: `(Posisi Jabatan yang Telah Selesai Direview / Total Posisi Jabatan Divisi) * 100%`,
        unit: '% Review Selesai',
        target: '100.00% Accomplished',
        kpiType: 'Learning & Growth',
        kpiOwner: `Kepala ${profile.divisionName}`,
        rationale: `Mendukung KPI Korporat Job Grade Review for all position (3%) dalam menata kesesuaian uraian tugas dan grade kompetensi pegawai.`,
        linkedCorporateKpiId: corp.id,
        linkedCorporateKpiName: corp.name,
        gasStandardRef: 'ISO 9001 / Human Capital Framework',
        weightEstimate: 5,
        isSelected: true
      });
    } else if (corp.id === 'corp-lg-2') {
      // AKHLAK
      result.push({
        id: `${id}-a`,
        divisionKpi: `Tingkat Partisipasi & Internalisasi Nilai-Nilai Budaya Kerja AKHLAK di Lingkungan Divisi`,
        definition: `Keterlibatan seluruh personel divisi dalam survei internalisasi budaya AKHLAK, program sharing session integritas kerja, dan implementasi perilaku utama BUMN.`,
        measurementFormula: `(Skor Indeks Partisipasi & Implementasi Budaya AKHLAK Divisi / Target Skor) * 100%`,
        unit: '% Accomplished',
        target: '100.00% Accomplished',
        kpiType: 'Learning & Growth',
        kpiOwner: `Kepala ${profile.divisionName}`,
        rationale: `Selaras dengan KPI Korporat Assessment for internalization culture refer to AKHLAK (2%) untuk mengokohkan etika kerja profesional.`,
        linkedCorporateKpiId: corp.id,
        linkedCorporateKpiName: corp.name,
        gasStandardRef: 'Panduan Budaya AKHLAK BUMN',
        weightEstimate: 5,
        isSelected: true
      });
    } else if (corp.id === 'corp-lg-3') {
      // OE Implementation
      result.push({
        id: `${id}-a`,
        divisionKpi: `Implementasi Sub-Pilar Operational Excellence (OE) & Sertifikasi Keahlian Teknis Pipa`,
        definition: `Pencapaian pemenuhan sertifikasi kompetensi teknis migas personel (Sertifikasi Inspektur Pipa, Proteksi Katodik, Pengelasan NDT) dan audit implementasi sub-pilar OE keandalan aset.`,
        measurementFormula: `(Realisasi Program Sub-Pilar OE Divisi / Rencana Kerja OE) * 100%`,
        unit: '% Accomplished',
        target: '100.00% Accomplished',
        kpiType: 'Learning & Growth',
        kpiOwner: `Kepala ${profile.divisionName}`,
        rationale: `Mendukung pencapaian KPI Korporat Operational Excellence (OE) Implementation (Sub Pillars) (2%) guna menjamin kualifikasi operator dan teknisi sesuai standar ASME/API.`,
        linkedCorporateKpiId: corp.id,
        linkedCorporateKpiName: corp.name,
        gasStandardRef: 'ASME B31.8S / API 1163 / SKKNI Migas',
        weightEstimate: 5,
        isSelected: true
      });
    }
  });

  // If text mentions specific technical aspects, add domain-specific pipeline integrity KPIs
  if (textCorpus.includes('integrity') || textCorpus.includes('integritas') || textCorpus.includes('pigging') || textCorpus.includes('ili')) {
    result.push({
      id: `div-kpi-custom-integrity`,
      divisionKpi: `Kepatuhan Pelaksanaan Rencana Inspeksi Integritas Pipa (ILI / Smart Pigging) Sesuai ASME B31.8S`,
      definition: `Penyelesaian survei berkala In-Line Inspection (MFL / Geometry Pigging) pada ruas pipa transmisi utama untuk mendeteksi kehilangan ketebalan dinding pipa akibat korosi internal/eksternal.`,
      measurementFormula: `(Kilometer Panjang Pipa yang Telah Diinspeksi ILI / Target KM Pipa RKAP) * 100%`,
      unit: '% KM Terinspeksi',
      target: '100.00%',
      kpiType: 'Internal Process',
      kpiOwner: `Kepala ${profile.divisionName}`,
      rationale: `Standar ASME B31.8S Section 6 & API 1163 mewajibkan penilaian integritas berkala guna memastikan Maximum Allowable Operating Pressure (MAOP) pipa gas tetap aman.`,
      linkedCorporateKpiId: 'corp-ip-2',
      linkedCorporateKpiName: 'Operation Excellence **',
      gasStandardRef: 'ASME B31.8S / API 1163',
      weightEstimate: 10,
      isSelected: true
    });
  }

  return result;
}

export function generateOfficerKPIsOffline(
  divisionKpis: DivisionKPI[],
  officerProfile: OfficerProfile
): OfficerKPI[] {
  const result: OfficerKPI[] = [];
  const textCorpus = `${officerProfile.positionName} ${officerProfile.positionDescription} ${officerProfile.jobDesc} ${officerProfile.performanceMeasures}`.toLowerCase();

  // If division KPIs available, map them into officer cascaded deliverables
  divisionKpis.forEach((divKpi, idx) => {
    const id = `off-kpi-${Date.now()}-${idx + 1}`;

    if (divKpi.kpiType === 'Internal Process' || divKpi.divisionKpi.toLowerCase().includes('geohazard') || divKpi.divisionKpi.toLowerCase().includes('integritas')) {
      result.push({
        id: `${id}-1`,
        officerKpi: `Ketepatan Waktu Analisis Data Teknis & Eksekusi Verifikasi Lapangan untuk ${divKpi.divisionKpi.substring(0, 45)}...`,
        definition: `Melaksanakan verifikasi data lapangan, pengujian NDT/survei teknis, dan penyusunan laporan rekomendasi rekayasa sesuai instruksi kerja dalam batas SLA.`,
        measurementFormula: `(Jumlah Laporan Teknis Selesai Tepat Waktu / Total Permintaan Tugas) * 100%`,
        unit: '% Laporan On-Time',
        target: '100.00%',
        kpiType: divKpi.kpiType,
        cascadedFromDivisionKpi: divKpi.divisionKpi,
        weightEstimate: 20,
        rationale: `Merupakan turunan langsung tingkat operasional dari KPI Divisi '${divKpi.divisionKpi}' agar target divisi tercapai secara konsisten mengacu pada ASME B31.8 / API 1160.`,
        gasStandardRef: divKpi.gasStandardRef || 'ASME B31.8S / API 1160',
        isSelected: true
      });
    } else if (divKpi.kpiType === 'Shareholders') {
      result.push({
        id: `${id}-2`,
        officerKpi: `Ketepatan Waktu Pelaksanaan Tugas & Pengendalian Biaya Aktivitas Jabatan ${officerProfile.positionName}`,
        definition: `Memastikan seluruh pengeluaran operasional di bawah kewenangan jabatan sesuai estimasi anggaran teknis dan bebas dari pemborosan sumber daya.`,
        measurementFormula: `(Realisasi Anggaran Tugas / Alokasi Anggaran Tugas) * 100%`,
        unit: '% Kepatuhan Budget',
        target: '<= 100.00%',
        kpiType: 'Shareholders',
        cascadedFromDivisionKpi: divKpi.divisionKpi,
        weightEstimate: 15,
        rationale: `Mendukung efisiensi biaya operasional divisi yang diturunkan dari KPI Divisi '${divKpi.divisionKpi}'.`,
        gasStandardRef: 'ISO 55001',
        isSelected: true
      });
    } else if (divKpi.kpiType === 'Customer') {
      result.push({
        id: `${id}-3`,
        officerKpi: `Kecepatan Respons & Resolusi Penanganan Gangguan Operasional Terkait Pelanggan`,
        definition: `Menindaklanjuti dan menyelesaikan kendala teknis atau pelaporan deviasi penyaluran gas di lapangan dalam waktu respon maksimal 2 jam.`,
        measurementFormula: `(Insiden Tertangani Sesuai Target Waktu / Total Insiden Ditugaskan) * 100%`,
        unit: '% Kecepatan Respons',
        target: '100.00%',
        kpiType: 'Customer',
        cascadedFromDivisionKpi: divKpi.divisionKpi,
        weightEstimate: 15,
        rationale: `Menjamin kelancaran penyaluran gas dan kepuasan shipper yang diturunkan dari KPI Divisi '${divKpi.divisionKpi}'.`,
        gasStandardRef: 'GTA / ISO 9001',
        isSelected: true
      });
    } else if (divKpi.kpiType === 'Learning & Growth') {
      result.push({
        id: `${id}-4`,
        officerKpi: `Pencapaian Jam Pembelajaran (Learning Hours) & Kepatuhan Nilai Budaya AKHLAK`,
        definition: `Menyelesaikan minimal 20 jam pelatihan teknis perpipaan/HSSE per tahun dan menerapkan 100% perilaku amanah dan kompeten di tempat kerja.`,
        measurementFormula: `(Realisasi Jam Pelatihan / Target 20 Jam Pelatihan) * 100%`,
        unit: '% Realisasi Pelatihan',
        target: '100.00% (Min 20 Jam)',
        kpiType: 'Learning & Growth',
        cascadedFromDivisionKpi: divKpi.divisionKpi,
        weightEstimate: 10,
        rationale: `Meningkatkan kapabilitas teknis pemegang jabatan '${officerProfile.positionName}' sesuai mandat KPI Divisi '${divKpi.divisionKpi}'.`,
        gasStandardRef: 'AKHLAK BUMN / SKKNI Migas',
        isSelected: true
      });
    }
  });

  // Add specific position-based KPI if relevant
  if (textCorpus.includes('cathodic') || textCorpus.includes('korosi') || textCorpus.includes('cp')) {
    result.push({
      id: `off-kpi-specific-cp`,
      officerKpi: `Pencapaian Kepatuhan Nilai Potensial Proteksi Katodik Test Post (-850 mV Off Potential)`,
      definition: `Melakukan pengukuran rutin potensial pipa di seluruh test box dan memastikan nilai proteksi memenuhi kriteria NACE SP0169 minimal 98% titik uji.`,
      measurementFormula: `(Jumlah Test Post Memenuhi Kriteria -850 mV / Total Test Post Diukur) * 100%`,
      unit: '% Kepatuhan Titik Uji',
      target: '>= 98.00%',
      kpiType: 'Internal Process',
      cascadedFromDivisionKpi: divisionKpis[0]?.divisionKpi || 'Keandalan Operasi Pipa',
      weightEstimate: 25,
      rationale: `Merupakan tugas pokok spesialis proteksi katodik untuk mencegah laju penipisan dinding pipa transmisi gas alam akibat korosi eksternal.`,
      gasStandardRef: 'NACE SP0169 / ASME B31.8',
      isSelected: true
    });
  } else if (textCorpus.includes('dispatcher') || textCorpus.includes('scada') || textCorpus.includes('metering')) {
    result.push({
      id: `off-kpi-specific-scada`,
      officerKpi: `Akurasi Monitoring SCADA & Kepatuhan Tekanan Operasi Dalam Batas MAOP`,
      definition: `Melakukan pemantauan kontinu 24/7 terhadap profil tekanan pipa transmisi dan mencegah terjadinya kondisi over-pressure melampaui batas MAOP yang diizinkan.`,
      measurementFormula: `(Jam Monitoring Tanpa Deviasi Tekanan Melebihi Batas / Total Jam Tugas) * 100%`,
      unit: '% Kepatuhan Tekanan',
      target: '100.00% (Zero Exceedance)',
      kpiType: 'Internal Process',
      cascadedFromDivisionKpi: divisionKpis[0]?.divisionKpi || 'Operation Excellence Fasilitas Transmisi Gas',
      weightEstimate: 25,
      rationale: `Menjamin keselamatan operasi pipa gas sesuai batas MAOP ASME B31.8 Section 845.`,
      gasStandardRef: 'ASME B31.8 / AGA 9',
      isSelected: true
    });
  } else if (textCorpus.includes('patrol') || textCorpus.includes('row') || textCorpus.includes('right of way')) {
    result.push({
      id: `off-kpi-specific-patrol`,
      officerKpi: `Kepatuhan Jadwal Patroli Jalur Pipa & Pencegahan Kerusakan Pihak Ketiga (Third-Party Damage)`,
      definition: `Melaksanakan patroli jalur pipa secara konsisten, mengawasi pekerjaan galian alat berat di sekitar ROW pipa, dan melaporkan indikasi pergerakan tanah / erosi lereng.`,
      measurementFormula: `(Jumlah Sesi Patroli Terlaksana / Total Jadwal Patroli) * 100%`,
      unit: '% Patroli Terlaksana',
      target: '100.00% & Zero Incident',
      kpiType: 'Internal Process',
      cascadedFromDivisionKpi: divisionKpis[0]?.divisionKpi || 'GeoHazard Risk Mitigation Project',
      weightEstimate: 25,
      rationale: `Mengacu pada PHMSA 49 CFR 192 Subpart M (Damage Prevention) dan mitigasi geohazard ASME B31.8S.`,
      gasStandardRef: 'PHMSA 192 / ASME B31.8S',
      isSelected: true
    });
  }

  return result;
}

export const generateOfflineDivisionKPIs = (profile: DivisionProfile, selectedCorpKpis: CorporateKPI[]): DivisionKPI[] => 
  generateDivisionKPIsOffline(selectedCorpKpis, profile);

export const generateOfflineOfficerKPIs = (officerProfile: OfficerProfile, divisionKpis: DivisionKPI[]): OfficerKPI[] => 
  generateOfficerKPIsOffline(divisionKpis, officerProfile);
