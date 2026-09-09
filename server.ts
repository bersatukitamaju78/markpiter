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
 */
app.post('/api/generate-division-kpis', async (req, res) => {
  try {
    const { corporateKPIs, divisionProfile } = req.body;

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

    const systemPrompt = `Anda adalah Executive Advisor Performance Management Korporat & Spesialis Pipeline Engineering Transmisi Gas Alam (Ahli standar ASME B31.8, ASME B31.8S, API 1160, API 1104, API 570, API 1163, PHMSA 49 CFR 192, ISO 13623, ISO 55001, ISO 45001, ISO 14001, ISO 9001).

TUGAS UTAMA:
Menyusun usulan KPI Divisi yang terhubung (alignment) secara solid dengan KPI Korporat yang telah dipilih, serta relevan dengan Profil Divisi dan standar perpipaan gas transmisi terkini.

ATURAN WAJIB & KETAT:
1. JANGAN PERNAH mengubah nama, bobot, perspektif (Shareholders / Customer / Internal Process / Learning & Growth), ataupun target dari KPI Korporat.
2. Setiap KPI Divisi harus memiliki:
   - divisionKpi: Nama KPI Divisi yang spesifik, terukur, berbobot manajemen.
   - definition: Penjelasan singkat definisi operasional KPI tersebut.
   - measurementFormula: Rumus perhitungan atau metode verifikasi yang presisi dan baku.
   - unit: Satuan ukuran (misal: %, Hari, MMscfd, Kasus, Dokumen, Jam).
   - target: Target yang realistis dan terukur (misal: 100%, Zero LTI, Max 0.175%, dll).
   - kpiType: Salah satu dari ['Shareholders', 'Customer', 'Internal Process', 'Learning & Growth'].
   - kpiOwner: Jabatan pemilik KPI (contoh: 'Kepala Divisi ...').
   - rationale: Alasan mengapa KPI ini relevan, keterhubungannya dengan KPI Korporat tertentu, serta referensi standar teknis transmisi gas alam jika terkait (misal ASME B31.8S, API 1160, NACE SP0169, dll).
   - linkedCorporateKpiId: ID KPI Korporat yang diturunkan.
   - linkedCorporateKpiName: Nama KPI Korporat yang diturunkan.
   - gasStandardRef: Standar code acuan (misal: 'ASME B31.8S / API 1160', 'ISO 55001', 'NACE SP0169', 'PHMSA 192', dll).
   - weightEstimate: Estimasi bobot (angka integer 5 - 25).
3. Hasilkan 4 sampai 8 KPI Divisi yang seimbang di keempat perspektif Balanced Scorecard.
4. Format output harus strictly JSON array sesuai schema yang ditentukan.`;

    const userContent = `Berikut adalah data masukan:

=== KPI KORPORAT TERPILIH ===
${JSON.stringify(corporateKPIs, null, 2)}

=== PROFIL DIVISI ===
Nama Divisi: ${divisionProfile.divisionName}
Deskripsi Singkat Divisi: ${divisionProfile.divisionDescription || '-'}
Job Desc: ${divisionProfile.jobDesc || '-'}
Key Deliverable / Output Pekerjaan: ${divisionProfile.keyDeliverables || '-'}

Silakan buat usulan Matriks KPI Divisi yang komprehensif, terstruktur, dan sesuai standar transmisi gas alam.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userContent,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.3,
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
              rationale: { type: Type.STRING, description: 'Alasan relevansi dan alignment ke standar pipa gas' },
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

    return res.json({ success: true, data: divisionKpis });
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
 * Generates cascaded Officer KPIs from final Division KPIs and Officer Job Description.
 */
app.post('/api/generate-officer-kpis', async (req, res) => {
  try {
    const { divisionKPIs, officerProfile } = req.body;

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
Menurunkan (cascade) KPI Divisi yang sudah final menjadi KPI Turunan tingkat Jabatan/Officer/Staf secara sistematis, operasional, berorientasi hasil teknis (output/deliverables), dan patuh pada standar perpipaan gas transmisi (ASME B31.8, API 1160, API 1104, NACE SP0169, PHMSA 49 CFR 192, ISO 9001/45001/14001).

ATURAN WAJIB & KETAT:
1. Setiap KPI Officer harus mencerminkan kontribusi individual/pelaksana jabatan terhadap KPI Divisi induknya.
2. Setiap KPI Officer harus memiliki:
   - officerKpi: Nama KPI Officer yang terukur dan spesifik pada aksi jabatan.
   - definition: Definisi jelas lingkup pekerjaan/tanggung jawab yang diukur.
   - measurementFormula: Formula perhitungan atau bukti verifikasi deliverable.
   - unit: Satuan ukuran (% kepatuhan, SLA jam/hari, frekuensi, dokumen, rasio).
   - target: Target spesifik level staf/officer.
   - kpiType: Salah satu dari ['Shareholders', 'Customer', 'Internal Process', 'Learning & Growth'].
   - cascadedFromDivisionKpi: Nama KPI Divisi asal penurunan.
   - rationale: Alasan dan hubungan logis penurunan KPI, serta referensi kode standar gas transmisi terkait.
   - gasStandardRef: Acuan standar teknis jika relevan.
   - weightEstimate: Estimasi bobot (angka integer 5 - 35, total sekitar 100%).
3. Hasilkan 4 sampai 7 KPI Officer yang mencakup tugas teknis, operasional, HSSE, dan pengembangan kompetensi.
4. Format output harus strictly JSON array sesuai schema.`;

    const userContent = `Berikut adalah data masukan:

=== KPI DIVISI (FINAL / INDUK) ===
${JSON.stringify(divisionKPIs, null, 2)}

=== PROFIL JABATAN / OFFICER ===
Nama Jabatan: ${officerProfile.positionName}
Deskripsi Singkat Jabatan: ${officerProfile.positionDescription || '-'}
Job Desc: ${officerProfile.jobDesc || '-'}
Performance Measures / Key Deliverables: ${officerProfile.performanceMeasures || '-'}

Silakan buat usulan Matriks KPI Turunan Jabatan (Officer) yang operasional dan presisi.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userContent,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.3,
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

    return res.json({ success: true, data: officerKpis });
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
