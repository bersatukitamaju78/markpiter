import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initializer for Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiAI(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

/**
 * POST /api/generate-division-kpis
 * Generates Division KPIs linked to selected Corporate KPIs and compliant with Gas Transmission standards.
 * Actively translates user input from "Key Deliverables / Output Pekerjaan / Performance Measures" into measurable KPIs.
 */
app.post('/api/generate-division-kpis', async (req, res) => {
  try {
    const { corporateKPIs, selectedCorporateKpis, divisionProfile } = req.body;
    const corpList = selectedCorporateKpis || corporateKPIs || [];

    if (!divisionProfile || !divisionProfile.divisionName) {
      return res.status(400).json({ error: 'Data Profil Divisi (Nama Divisi) diperlukan.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on server.',
        fallbackNeeded: true
      });
    }

    const ai = getGeminiAI();

    const systemPrompt = `Anda adalah Executive Advisor Performance Management Korporat & Spesialis Pipeline Engineering Transmisi Gas Alam (Ahli standar ASME B31.8, ASME B31.8S, API 1160, API 1104, API 570, API 1163, PHMSA 49 CFR 192, ISO 13623, ISO 55001, ISO 45001, ISO 14001, ISO 9001, NACE SP0169).

TUGAS UTAMA:
Menyusun usulan Matriks KPI Divisi yang komprehensif, terstruktur, dan selaras penuh dengan:
1. Isian formulir user pada "Key Deliverables / Output Pekerjaan / Performance Measures" serta "Job Desc Divisi".
2. KPI Korporat yang telah dipilih (alignment korporat).
3. Standar teknis perpipaan transmisi gas bumi terkini.

ATURAN WAJIB & PRIORITAS UTAMA:
1. PENERJEMAHAN WAJIB DARI "Key Deliverables / Output Pekerjaan / Performance Measures":
   - Anda WAJIB menganalisis secara mendalam setiap poin, butir, atau deskripsi yang diisikan user pada form "Key Deliverables / Output Pekerjaan / Performance Measures" dan "Job Desc".
   - Buat dan formulasikan usulan KPI Divisi spesifik yang MENGAKOMODASI dan MENTERJEMAHKAN LANGSUNG setiap output/deliverable/performance measure yang diinputkan pengguna tersebut menjadi KPI terukur (dengan formula perhitungan yang presisi, satuan yang sesuai, target yang jelas, dan kpiType yang tepat).
   - Pastikan setiap deliverable utama yang diinputkan user memiliki representasi KPI yang nyata dan terukur di dalam daftar usulan KPI Divisi.
2. INTEGRASI & ALIGNMENT DENGAN KPI KORPORAT:
   - JANGAN PERNAH mengubah nama, bobot, perspektif (Shareholders / Customer / Internal Process / Learning & Growth), ataupun target dari KPI Korporat.
   - Hubungkan setiap KPI Divisi (termasuk yang diturunkan dari Key Deliverables) ke KPI Korporat terkait yang dipilih user (misal NPAT, GeoHazard Risk Mitigation, Gas Delivered, Operation Excellence, Lost Time Injuries, dll).
3. STRUKTUR & DETAIL SETIAP KPI DIVISI:
   - divisionKpi: Nama KPI Divisi yang spesifik, formal, terukur, dan berbobot manajemen.
   - definition: Penjelasan definisi operasional KPI tersebut.
   - measurementFormula: Rumus perhitungan matematis atau metode verifikasi yang presisi dan baku.
   - unit: Satuan ukuran (misal: %, Hari, MMscfd, Kasus, Dokumen, Jam, Titik Uji, KM).
   - target: Target yang realistis dan terukur (misal: 100.00%, Zero LTI, Max 0.175%, dll).
   - kpiType: Salah satu dari ['Shareholders', 'Customer', 'Internal Process', 'Learning & Growth'].
   - kpiOwner: Jabatan pemilik KPI (contoh: 'Kepala [Nama Divisi]').
   - rationale: Alasan mengapa KPI ini penting, keterhubungannya dengan Key Deliverables divisi dan KPI Korporat, serta referensi standar teknis pipa gas terkait (ASME B31.8S, API 1160, NACE SP0169, ISO 55001, dll).
   - linkedCorporateKpiId: ID KPI Korporat terkait.
   - linkedCorporateKpiName: Nama KPI Korporat terkait.
   - gasStandardRef: Kode standar acuan (misal: 'ASME B31.8S / API 1160', 'ISO 55001', 'NACE SP0169', 'PHMSA 192', dll).
   - weightEstimate: Estimasi persentase bobot (angka integer 5 - 25).
4. Hasilkan antara 5 sampai 10 KPI Divisi yang seimbang, mencakup seluruh Key Deliverables yang diisi pengguna ditambah KPI mandatori korporat.
5. Format output harus strictly JSON array sesuai schema.`;

    const userContent = `Berikut adalah data masukan dari pengguna:

=== PROFIL DIVISI & KEY DELIVERABLES ===
Nama Divisi: ${divisionProfile.divisionName}
Deskripsi Singkat Divisi: ${divisionProfile.divisionDescription || '-'}
Job Desc Divisi: ${divisionProfile.jobDesc || '-'}
Key Deliverables / Output Pekerjaan / Performance Measures (PRIORITAS UNTUK DIBUATKAN KPI):
"""
${divisionProfile.keyDeliverables || '-'}
"""

=== KPI KORPORAT TERPILIH ===
${JSON.stringify(corpList, null, 2)}

Silakan proses dan buatkan usulan Matriks KPI Divisi, pastikan membuatkan KPI spesifik yang mencerminkan isian pada form "Key Deliverables / Output Pekerjaan / Performance Measures" di atas serta selaras dengan KPI Korporat terpilih dan standar transmisi pipa gas.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userContent,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.25,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              divisionKpi: { type: Type.STRING, description: 'Nama KPI Divisi' },
              definition: { type: Type.STRING, description: 'Penjelasan definisi KPI Divisi' },
              measurementFormula: { type: Type.STRING, description: 'Formula atau metode pengukuran KPI' },
              unit: { type: Type.STRING, description: 'Satuan ukuran KPI' },
              target: { type: Type.STRING, description: 'Target kuantitatif / kualitatif KPI' },
              kpiType: { 
                type: Type.STRING, 
                enum: ['Shareholders', 'Customer', 'Internal Process', 'Learning & Growth'],
                description: 'Perspektif Balanced Scorecard'
              },
              kpiOwner: { type: Type.STRING, description: 'Pemilik / Penanggung jawab KPI' },
              rationale: { type: Type.STRING, description: 'Alasan relevansi, alignment key deliverables, dan standar pipa gas' },
              linkedCorporateKpiId: { type: Type.STRING, description: 'ID KPI Korporat terkait' },
              linkedCorporateKpiName: { type: Type.STRING, description: 'Nama KPI Korporat terkait' },
              gasStandardRef: { type: Type.STRING, description: 'Standar referensi ASME/API/PHMSA/ISO' },
              weightEstimate: { type: Type.INTEGER, description: 'Estimasi persentase bobot KPI' }
            },
            required: ['divisionKpi', 'definition', 'measurementFormula', 'unit', 'target', 'kpiType', 'rationale']
          }
        }
      }
    });

    const text = response.text || '[]';
    const parsedKpis = JSON.parse(text);

    // Add unique IDs and isSelected default true
    const divisionKpis = parsedKpis.map((k: any, idx: number) => ({
      ...k,
      id: `div-kpi-${Date.now()}-${idx + 1}`,
      isSelected: true,
      kpiOwner: k.kpiOwner || `Kepala ${divisionProfile.divisionName}`
    }));

    return res.json({ success: true, kpis: divisionKpis, data: divisionKpis });
  } catch (error: any) {
    console.error('Error generating Division KPIs:', error);
    return res.status(500).json({
      error: error.message || 'Gagal memproses KPI Divisi melalui AI.',
      fallbackNeeded: true
    });
  }
});

/**
 * POST /api/generate-officer-kpis
 * Generates cascaded Officer KPIs from final Division KPIs and Officer Job Description & Performance Measures.
 */
app.post('/api/generate-officer-kpis', async (req, res) => {
  try {
    const { divisionKPIs, selectedDivisionKpis, officerProfile } = req.body;
    const divList = selectedDivisionKpis || divisionKPIs || [];

    if (!officerProfile || !officerProfile.positionName) {
      return res.status(400).json({ error: 'Data Profil Jabatan (Nama Jabatan) diperlukan.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on server.',
        fallbackNeeded: true
      });
    }

    const ai = getGeminiAI();

    const systemPrompt = `Anda adalah Executive Advisor Human Capital & Pipeline Operations Engineer Spesialis.

TUGAS UTAMA:
Menurunkan (cascade) KPI Divisi yang sudah final menjadi KPI Turunan tingkat Jabatan/Officer/Staf secara sistematis, terukur, berorientasi hasil teknis (output/deliverables), dan patuh pada standar perpipaan gas transmisi (ASME B31.8, API 1160, API 1104, NACE SP0169, PHMSA 49 CFR 192, ISO 9001/45001/14001).

ATURAN WAJIB & PRIORITAS:
1. ANALISIS MENDALAM "Performance Measures / Key Deliverables" & "Job Desc" JABATAN:
   - Anda WAJIB menganalisis setiap butir atau uraian pada "Performance Measures / Key Deliverables" serta "Job Desc" yang diisikan user untuk jabatan ${officerProfile.positionName}.
   - Ubah dan terjemahkan setiap output/performance measure individu tersebut menjadi KPI Officer yang terukur, spesifik, dan memiliki formula operasional.
2. ALIGNMENT DENGAN KPI DIVISI INDUK:
   - Setiap KPI Officer harus mencerminkan kontribusi individual/pelaksana jabatan terhadap KPI Divisi induknya.
3. STRUKTUR SETIAP KPI OFFICER:
   - officerKpi: Nama KPI Officer yang terukur dan spesifik pada aksi jabatan.
   - definition: Definisi jelas lingkup pekerjaan/tanggung jawab yang diukur.
   - measurementFormula: Formula perhitungan matematis atau bukti verifikasi deliverable.
   - unit: Satuan ukuran (% kepatuhan, SLA jam/hari, frekuensi, dokumen, rasio, titik uji).
   - target: Target spesifik level staf/officer (misal 100%, Max 2 Jam, >= 98%).
   - kpiType: Salah satu dari ['Shareholders', 'Customer', 'Internal Process', 'Learning & Growth'].
   - cascadedFromDivisionKpi: Nama KPI Divisi asal penurunan.
   - rationale: Alasan dan hubungan logis penurunan KPI, keselarasan dengan Performance Measures jabatan, serta referensi kode standar gas transmisi terkait.
   - gasStandardRef: Acuan standar teknis jika relevan.
   - weightEstimate: Estimasi bobot (angka integer 5 - 35).
4. Hasilkan 5 sampai 8 KPI Officer yang mencakup tugas teknis, operasional, HSSE, dan pengembangan kompetensi.
5. Format output harus strictly JSON array sesuai schema.`;

    const userContent = `Berikut adalah data masukan:

=== PROFIL JABATAN & PERFORMANCE MEASURES ===
Nama Jabatan: ${officerProfile.positionName}
Deskripsi Singkat Jabatan: ${officerProfile.positionDescription || '-'}
Job Desc Jabatan: ${officerProfile.jobDesc || '-'}
Performance Measures / Key Deliverables Jabatan (PRIORITAS UNTUK DIBUATKAN KPI):
"""
${officerProfile.performanceMeasures || '-'}
"""

=== KPI DIVISI (FINAL / INDUK) ===
${JSON.stringify(divList, null, 2)}

Silakan buat usulan Matriks KPI Turunan Jabatan (Officer) yang operasional, presisi, dan mengakomodasi Performance Measures di atas.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userContent,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.25,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              officerKpi: { type: Type.STRING, description: 'Nama KPI Officer' },
              definition: { type: Type.STRING, description: 'Penjelasan definisi KPI Officer' },
              measurementFormula: { type: Type.STRING, description: 'Formula pengukuran KPI' },
              unit: { type: Type.STRING, description: 'Satuan ukuran KPI' },
              target: { type: Type.STRING, description: 'Target kuantitatif / kualitatif' },
              kpiType: { 
                type: Type.STRING, 
                enum: ['Shareholders', 'Customer', 'Internal Process', 'Learning & Growth'],
                description: 'Perspektif Balanced Scorecard'
              },
              cascadedFromDivisionKpi: { type: Type.STRING, description: 'KPI Divisi Induk yang diturunkan' },
              rationale: { type: Type.STRING, description: 'Alasan cascading dan alignment standar pipa' },
              gasStandardRef: { type: Type.STRING, description: 'Standar referensi ASME/API/PHMSA/ISO' },
              weightEstimate: { type: Type.INTEGER, description: 'Estimasi bobot %' }
            },
            required: ['officerKpi', 'definition', 'measurementFormula', 'unit', 'target', 'kpiType', 'cascadedFromDivisionKpi', 'rationale']
          }
        }
      }
    });

    const text = response.text || '[]';
    const parsedKpis = JSON.parse(text);

    const officerKpis = parsedKpis.map((k: any, idx: number) => ({
      ...k,
      id: `off-kpi-${Date.now()}-${idx + 1}`,
      isSelected: true
    }));

    return res.json({ success: true, kpis: officerKpis, data: officerKpis });
  } catch (error: any) {
    console.error('Error generating Officer KPIs:', error);
    return res.status(500).json({
      error: error.message || 'Gagal memproses KPI Officer melalui AI.',
      fallbackNeeded: true
    });
  }
});

// Vite middleware for development & static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MARKPITER Server running on http://localhost:${PORT}`);
  });
}

startServer();
