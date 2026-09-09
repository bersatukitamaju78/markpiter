export interface PipelineStandard {
  code: string;
  name: string;
  organization: 'ASME' | 'API' | 'PHMSA' | 'ISO' | 'NACE / AMPP' | 'SNI / ESDM';
  scope: string;
  keyAspects: string[];
}

export const PIPELINE_STANDARDS: PipelineStandard[] = [
  {
    code: 'ASME B31.8',
    name: 'Gas Transmission and Distribution Piping Systems',
    organization: 'ASME',
    scope: 'Desain, fabrikasi, instalasi, inspeksi, pengujian, serta aspek keselamatan pipa transmisi gas alam.',
    keyAspects: ['Design Factor & Class Location', 'Pressure Testing (Hydrotest)', 'Pipeline Valves & Relief Systems', 'Operating Pressure (MAOP)']
  },
  {
    code: 'ASME B31.8S',
    name: 'Managing System Integrity of Gas Pipelines',
    organization: 'ASME',
    scope: 'Standar Manajemen Integritas Pipa Gas (PIMS) mencakup 21 ancaman bahaya pipa gas.',
    keyAspects: ['Threat Identification & Risk Assessment', 'In-Line Inspection (ILI / Smart Pigging)', 'Direct Assessment (ECDA/ICDA/SCCDA)', 'Mitigation & Preventive Repair']
  },
  {
    code: 'API 1160',
    name: 'Managing System Integrity for Hazardous Liquid / Gas Pipelines',
    organization: 'API',
    scope: 'Framework komprehensif implementasi Pipeline Integrity Management System berbasis siklus PDCA.',
    keyAspects: ['Risk-Based Inspection Planning', 'Integrity Assessment Scheduling', 'Data Integration & GIS Alignment', 'Performance Metric Monitoring']
  },
  {
    code: 'API 1104',
    name: 'Welding of Pipelines and Related Facilities',
    organization: 'API',
    scope: 'Kualifikasi prosedur pengelasan (WPS/PQR), kualifikasi welder, dan standar inspeksi NDT sambungan pipa.',
    keyAspects: ['Welder Qualification', 'Radiographic & Ultrasonic Testing', 'Defect Acceptance Criteria', 'Repair Welding Procedures']
  },
  {
    code: 'API 1163',
    name: 'In-line Inspection Systems Qualification',
    organization: 'API',
    scope: 'Validasi dan verifikasi akurasi data inspeksi pig cerdas (MFL, TFI, UT, Caliper Pig).',
    keyAspects: ['ILI Tool Tolerance & Accuracy Verification', 'Dig Verification & Correlation', 'Anomaly Sizing & Classification']
  },
  {
    code: 'API 570',
    name: 'Piping Inspection Code: In-service Inspection, Rating, Repair, and Alteration',
    organization: 'API',
    scope: 'Inspeksi berkala dan penentuan remaining life pipa station dan fasilitas kompresor gas.',
    keyAspects: ['Corrosion Rate Calculation', 'Remaining Life Assessment', 'Thickness Measurement Locations (TML)']
  },
  {
    code: 'PHMSA 49 CFR Part 192',
    name: 'Transportation of Natural Gas by Pipeline: Minimum Federal Safety Standards',
    organization: 'PHMSA',
    scope: 'Regulasi baku keselamatan pipa transmisi gas alam terkemuka di dunia.',
    keyAspects: ['High Consequence Area (HCA) Identification', 'Corrosion Control Mandates', 'Damage Prevention & Public Awareness', 'Incident Reporting Thresholds']
  },
  {
    code: 'ISO 13623',
    name: 'Petroleum and Natural Gas Industries — Pipeline Transportation Systems',
    organization: 'ISO',
    scope: 'Standar internasional fungsional untuk sistem transportasi pipa minyak dan gas bumi.',
    keyAspects: ['System Design & Safety Principles', 'Operational Envelopes & SCADA Control', 'Decommissioning & Life Extension']
  },
  {
    code: 'ISO 55001',
    name: 'Asset Management — Management Systems — Requirements',
    organization: 'ISO',
    scope: 'Sistem manajemen aset fisik infrastruktur transmisi gas untuk optimalisasi umur aset & CAPEX/OPEX.',
    keyAspects: ['Asset Lifecycle Strategy (SAMP)', 'Risk-Based Asset Maintenance', 'Criticality Assessment']
  },
  {
    code: 'AMPP / NACE SP0169',
    name: 'Control of External Corrosion on Underground Metallic Piping Systems',
    organization: 'NACE / AMPP',
    scope: 'Kriteria proteksi katodik (CP) dan pelapisan pipa (coating) untuk mencegah korosi eksternal.',
    keyAspects: ['-850 mV Off-Potential Criteria', 'Close Interval Survey (CIS)', 'Direct Current Voltage Gradient (DCVG)', 'Soil Resistivity Testing']
  },
  {
    code: 'ISO 45001 / ISO 14001',
    name: 'Occupational Health and Safety & Environmental Management',
    organization: 'ISO',
    scope: 'Standar implementasi HSSE, Process Safety, pencegahan kecelakaan LTI, dan manajemen lingkungan emisi gas suar.',
    keyAspects: ['Process Safety Management (PSM)', 'Zero LTI Programs', 'Methane Leak Detection & Repair (LDAR)', 'Hazard Identification & Risk Assessment (HIRA)']
  }
];

export interface PresetDivision {
  id: string;
  name: string;
  description: string;
  jobDesc: string;
  keyDeliverables: string;
  relevantCorpKpiCodes: string[]; // references code like 'SH-02', 'IP-01', 'IP-02'
  officerPositions: {
    title: string;
    description: string;
    jobDesc: string;
    performanceMeasures: string;
  }[];
}

export const PRESET_DIVISIONS: PresetDivision[] = [
  {
    id: 'div-pipe-integrity',
    name: 'Divisi Pipeline Integrity & Asset Management',
    description: 'Bertanggung jawab memastikan keandalan, keamanan struktural, dan kepatuhan integritas jaringan pipa transmisi gas alam (onshore & offshore) sepanjang siklus hidup aset, mengacu pada standar ASME B31.8S, API 1160, dan ISO 55001.',
    jobDesc: `1. Menyusun dan mengeksekusi Rencana Manajemen Integritas Pipa (Pipeline Integrity Management Plan - PIMP).
2. Melaksanakan inspeksi In-Line Inspection (ILI / Smart Pigging) berkala (MFL, Geometry/Caliper, UT) dan verifikasi anomali pipa (dig verification).
3. Mengelola program pemantauan mitigasi risiko geohazard (pergerakan tanah, perlintasan sungai, zona patahan aktif).
4. Melakukan evaluasi sisa umur pipa (Remaining Life Assessment), evaluasi cacat ASME B31G / Modified B31G / RSTRENG, dan rekomendasi perbaikan permanen (composite wrap / type B sleeve).
5. Mengelola sistem Proteksi Katodik (CP) & coating assessment (DCVG/CIPS) sesuai NACE SP0169.
6. Memastikan kepatuhan audit teknis regulator dan sertifikasi kelaikan pipa (SKKP/SKPP ESDM).`,
    keyDeliverables: `1. Laporan Pelaksanaan & Evaluasi ILI Smart Pigging (100% tepat jadwal).
2. Dokumen Mitigasi Risiko Geohazard & Pemasangan Monitoring Geoteknik (100% Accomplished).
3. Zero Loss of Containment / Zero Kebocoran Pipa Akibat Korosi atau Kegagalan Mekanikal.
4. Kepatuhan Kriteria Proteksi Katodik Test Post (Ketercapaian kriteria -850 mV Off minimal 98%).
5. Penyelesaian Tindak Lanjut Temuan Audit Teknis & Anomali Integritas Pipa Kategori Kritis (100% Resolved).
6. Dokumen Rencana Strategis Manajemen Aset (SAMP) berbasis ISO 55001.`,
    relevantCorpKpiCodes: ['SH-02', 'IP-02', 'IP-03', 'IP-04', 'IP-05', 'IP-08', 'LG-03'],
    officerPositions: [
      {
        title: 'Pipeline Integrity Engineer',
        description: 'Melakukan analisis risiko integritas pipa, pemodelan laju korosi, interpretasi data ILI Smart Pigging, dan perhitungan tekanan kerja aman pipa (MAOP/RSTRENG).',
        jobDesc: `1. Menganalisis laporan hasil In-Line Inspection (ILI) dan mengidentifikasi anomali pipa dengan kedalaman >50% wt atau ERF > 1.0.
2. Menyusun jadwal dan prosedur penggalian verifikasi (dig verification) dan inspeksi NDT langsung di lapangan.
3. Melakukan perhitungan sisa umur pipa dan tekanan operasi maksimum yang diizinkan (MAOP re-rating).
4. Menyiapkan spesifikasi teknis metode perbaikan pipa sesuai ASME B31.8 / API 1160.`,
        performanceMeasures: `1. Ketepatan waktu analisis data ILI dan penetapan prioritas anomaly dig (<30 hari kalender).
2. Ketercapaian 100% jadwal verifikasi anomali pipa kritis.
3. Nol kegagalan prediksi anomali integritas pipa.`
      },
      {
        title: 'Cathodic Protection & Corrosion Specialist',
        description: 'Mengelola dan memonitor sistem proteksi katodik (Impressed Current & Sacrificial Anode), survey Close Interval Potential (CIPS), dan mitigasi interferensi arus liar (AC/DC interference).',
        jobDesc: `1. Mengawasi operasional dan keandalan Transformer Rectifier (TR) unit dan groundbed katodik.
2. Melaksanakan survey CIPS, DCVG, dan pengukuran resistivitas tanah tahunan.
3. Melakukan investigasi dan penanganan lokasi pipa dengan proteksi katodik di bawah kriteria standar NACE SP0169.
4. Memonitor laju korosi internal melalui coupon corrosion dan probe ER.`,
        performanceMeasures: `1. Persentase titik uji (test post) yang memenuhi kriteria proteksi katodik NACE (target >= 98%).
2. Ketersediaan operasi (uptime) unit Transformer Rectifier (TR) (target >= 99.5%).
3. Waktu respons perbaikan unit TR padam (< 48 jam).`
      },
      {
        title: 'Pipeline Patrol & Right-of-Way (ROW) Inspector',
        description: 'Memastikan keamanan jalur pipa transmisi gas (Right of Way), mencegah ancaman pihak ketiga (third-party damage), dan mengawasi titik rawan geohazard.',
        jobDesc: `1. Melakukan patroli harian/mingguan sepanjang jalur pipa gas (on foot, motor, drone survey).
2. Memverifikasi izin kerja pihak ketiga (One-Call / Dial Before Dig) di sekitar zona aman (ROW) pipa gas.
3. Memantau tanda-tanda erosi, longsoran tanah, atau pipa tersingkap (uncovered pipe) di perlintasan sungai & lereng bukit.
4. Mengedukasi masyarakat sekitar jalur pipa terkait keselamatan transmisi gas sesuai PHMSA Public Awareness.`,
        performanceMeasures: `1. Ketercapaian 100% jadwal patroli rutin jalur pipa transmisi.
2. Nol insiden kerusakan pipa akibat pekerjaan pihak ketiga tanpa izin (Zero third-party strike).
3. Ketepatan waktu pelaporan & mitigasi indikasi pergerakan tanah di zona geohazard (< 24 jam).`
      }
    ]
  },
  {
    id: 'div-gas-transmission',
    name: 'Divisi Operasi & Penyaluran Gas Transmisi',
    description: 'Bertanggung jawab atas pengoperasian jaringan pipa transmisi gas alam, stasiun kompresor, metering & regulating station (M&R), pengendalian tekanan/laju alir, serta akurasi alokasi penyaluran gas kepada konsumen.',
    jobDesc: `1. Mengendalikan penyaluran gas alam secara real-time melalui sistem SCADA/Gas Dispatching 24/7.
2. Memastikan pemenuhan nominasi pengiriman gas harian (Gas Delivered) sesuai Gas Transportation Agreement (GTA).
3. Mengendalikan selisih gas tidak terhitung (Unaccounted for Gas / UAG) dan menjaga akurasi sistem pengukuran metering custody transfer (AGA 3, AGA 7, AGA 9).
4. Menjaga keandalan unit kompresor gas transmisi dan station pressure control.
5. Menangani komplain pelanggan terkait deviasi tekanan, temperatur, dan kualitas gas.`,
    keyDeliverables: `1. Ketercapaian Penyaluran Gas (Gas Delivered) mencapai 100.00% target kontrak.
2. Pengendalian UAG (Unaccounted for Gas) di bawah toleransi maksimum 0.175%.
3. Operation Excellence Keandalan Fasilitas Transmisi Gas (Reliability & Availability >= 99.8%).
4. Customer Complaint Management Penyelesaian Keluhan Pelanggan 100% Resolved.
5. Zero Unplanned Shutdown pada Stasiun Kompresor & Stasiun Metering Gas.`,
    relevantCorpKpiCodes: ['SH-01', 'CU-01', 'CU-02', 'IP-01', 'IP-02', 'IP-03', 'IP-04', 'IP-08', 'LG-03'],
    officerPositions: [
      {
        title: 'Gas Dispatcher & Transmission Controller',
        description: 'Mengoperasikan sistem SCADA transmisi gas, mengontrol setpoint tekanan/flow pipa, dan mengelola alokasi gas real-time.',
        jobDesc: `1. Memonitor dan mengontrol parameter operasi jaringan pipa (suction/discharge pressure, flow rate, dew point).
2. Mengeksekusi instruksi manuver valve dan penyesuaian laju alir sesuai nominasi harian shipper.
3. Mendeteksi secara dini anomali penurunan tekanan mendadak (potensi leak/line break) menggunakan Real-Time Transient Model (RTTM).
4. Menyusun laporan harian penerimaan dan penyaluran gas (Daily Gas Balance).`,
        performanceMeasures: `1. Deviasi penyaluran terhadap nominasi shipper harian (< 1.0%).
2. Waktu respons penanganan alarm deviasi tekanan SCADA (< 3 menit).
3. Ketepatan waktu penerbitan Daily Gas Balance harian (100% tepat pukul 08:00).`
      },
      {
        title: 'Metering & Custody Transfer Officer',
        description: 'Bertanggung jawab atas akurasi, kalibrasi, proving, dan sertifikasi meter gas custody transfer (Ultrasonic, Turbine, Orifice).',
        jobDesc: `1. Melaksanakan kalibrasi berkala transmitter tekanan, temperatur, dan gas chromatograph sesuai standar AGA / ISO.
2. Melakukan meter proving dan verifikasi sound velocity meter ultrasonik (USM).
3. Melakukan rekonsiliasi volume gas bulanan dan menghitung neraca gas (Gas Balance System).
4. Menginvestigasi penyebab deviasi pengukuran dan mengusulkan koreksi teknis.`,
        performanceMeasures: `1. Kepatuhan jadwal kalibrasi alat ukur metering custody transfer (100% on schedule).
2. Akurasi kalkulasi Gas Chromatograph dan nilai Gross Heating Value (GHV) gas.
3. Tingkat error deviasi meter proving (< 0.2%).`
      }
    ]
  },
  {
    id: 'div-hsse-compliance',
    name: 'Divisi HSSE & Keselamatan Operasi Pipa',
    description: 'Bertanggung jawab menjamin standar Keselamatan, Kesehatan Kerja, Keamanan, Lindungan Lingkungan (HSSE), Process Safety Management (PSM), pencegahan LTI, dan kepatuhan ESG perpipaan gas alam.',
    jobDesc: `1. Mengimplementasikan Sistem Manajemen Keselamatan Migas (SMKM) dan standar ISO 45001 / ISO 14001 pada operasi pipa gas.
2. Memimpin program pencegahan kecelakaan kerja, inspeksi K3 berkala, dan penegakan Life Saving Rules.
3. Mengelola sistem tanggap darurat (Emergency Response Plan - ERP) kebocoran gas dan simulasi penanganan insiden transmisi gas.
4. Mengukur dan mengendalikan emisi gas rumah kaca, program deteksi kebocoran metana (LDAR), dan kepatuhan baku mutu lingkungan.
5. Memfasilitasi investigasi insiden, hazard hunting, dan audit kepatuhan regulasi keselamatan.`,
    keyDeliverables: `1. Zero Lost Time Injury (LTI) & Zero Fatality di seluruh area kerja operasi transmisi gas.
2. Pencapaian 100% Rencana Program Kerja HSSE (Accomplishment HSSE Programs).
3. Kepatuhan Implementasi ESG & Pengurangan Emisi Metana Fugitive (100% Target ESG Accomplished).
4. Pelaksanaan Simulasi Tanggap Darurat Kebocoran Gas Pipa Skala Major (100% Terlaksana).
5. Ketercapaian 100% Tindak Lanjut Rekomendasi Keselamatan & Temuan Audit K3.`,
    relevantCorpKpiCodes: ['SH-04', 'IP-03', 'IP-04', 'IP-05', 'IP-07', 'LG-02', 'LG-03'],
    officerPositions: [
      {
        title: 'HSSE & Process Safety Officer',
        description: 'Mengawasi keselamatan kerja lapangan, izin kerja berisiko tinggi (PTW, Hot Work, Confined Space), dan keselamatan proses pipa gas.',
        jobDesc: `1. Memverifikasi Job Safety Analysis (JSA) dan izin kerja (Permit to Work) untuk pekerjaan pengelasan panas (hot tapping), tie-in, dan purging gas.
2. Melaksanakan inspeksi keselamatan harian/mingguan di stasiun kompresor dan sepanjang ROW pipa.
3. Melakukan audit ketersediaan dan kesiapan peralatan pemadam (fire & gas detection, ESD system).
4. Memfasilitasi safety briefing (Toolbox Talk) dan sosialisasi Golden Rules K3.`,
        performanceMeasures: `1. Tingkat kepatuhan implementasi Permit to Work (PTW) (100% compliant).
2. Jumlah temuan un-safe act / un-safe condition yang ditindaklanjuti dan diselesaikan (>95%).
3. Ketercapaian jadwal inspeksi keselamatan fasilitas transmisi (100%).`
      },
      {
        title: 'Environmental & ESG Compliance Officer',
        description: 'Mengelola kepatuhan lingkungan hidup, pemantauan kualitas udara, pengelolaan limbah B3, dan pelaporan emisi metana sesuai standar ESG.',
        jobDesc: `1. Melaksanakan program survey Methane Leak Detection and Repair (LDAR) menggunakan kamera Optical Gas Imaging (OGI).
2. Mengelola perizinan lingkungan (Amdal / UKL-UPL) dan pelaporan Proper Lingkungan Hidup ke Kementerian LHK.
3. Mengawasi pengelolaan limbah B3 (spent catalyst, pigging sludge, pelumas bekas).
4. Menghitung inventarisasi jejak karbon (GHG Scope 1 & 2) dari operasional kompresor dan flaring gas.`,
        performanceMeasures: `1. Pemenuhan 100% pelaporan lingkungan hidup tepat waktu.
2. Ketercapaian target deteksi dan perbaikan kebocoran metana fugitive (LDAR).
3. Nilai evaluasi ketaatan PROPER Lingkungan Hidup (minimal peringkat Hijau/Biru).`
      }
    ]
  }
];
