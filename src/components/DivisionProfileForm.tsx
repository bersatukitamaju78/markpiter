import React, { useState } from 'react';
import { 
  Building2, 
  FileText, 
  Target, 
  Sparkles, 
  ArrowLeft, 
  RotateCcw, 
  Upload, 
  Layers, 
  CheckCircle,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { DivisionProfile } from '../types';
import { PRESET_DIVISIONS, PresetDivision } from '../data/pipelineStandards';

interface DivisionProfileFormProps {
  profile: DivisionProfile;
  onChange: (updated: DivisionProfile) => void;
  onGenerate: () => void;
  onBack: () => void;
  onReset: () => void;
  isLoading: boolean;
  selectedCorpKpiCount: number;
}

export const DivisionProfileForm: React.FC<DivisionProfileFormProps> = ({
  profile,
  onChange,
  onGenerate,
  onBack,
  onReset,
  isLoading,
  selectedCorpKpiCount,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleApplyPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const preset = PRESET_DIVISIONS.find(p => p.id === presetId);
    if (preset) {
      onChange({
        divisionName: preset.name,
        divisionDescription: preset.description,
        jobDesc: preset.jobDesc,
        keyDeliverables: preset.keyDeliverables,
        targetYear: profile.targetYear || '2026'
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus(`Membaca file: ${file.name}...`);
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        // If text/csv/txt, populate or append to job desc
        onChange({
          ...profile,
          jobDesc: (profile.jobDesc ? profile.jobDesc + '\n\n' : '') + `[Lampiran dari ${file.name}]:\n` + content.slice(0, 3000),
        });
        setUploadStatus(`File ${file.name} berhasil diuraikan.`);
        setTimeout(() => setUploadStatus(null), 4000);
      }
    };

    reader.onerror = () => {
      setUploadStatus('Gagal membaca isi file.');
      setTimeout(() => setUploadStatus(null), 4000);
    };

    reader.readAsText(file);
  };

  const isFormValid = profile.divisionName.trim().length > 2;

  return (
    <div className="space-y-6">
      
      {/* Step Header */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                Tahap 2 dari 3
              </span>
              <span className="text-xs text-slate-500 font-medium">Input Profil Divisi</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Lengkapi Profil & Tanggung Jawab Divisi
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Masukkan uraian tugas dan key deliverables divisi. AI MARKPITER akan memprosesnya dengan standar kode transmisi gas terkini (ASME B31.8S, API 1160, PHMSA, ISO 55001).
            </p>
          </div>

          {/* Quick Preset Selector for Gas Transmission */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 w-full sm:w-80">
            <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              Template Divisi Pipa Gas:
            </label>
            <select
              value={selectedPresetId}
              onChange={(e) => handleApplyPreset(e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-md p-2 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden cursor-pointer"
            >
              <option value="">-- Pilih Contoh Template --</option>
              {PRESET_DIVISIONS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Input Form */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
        
        {/* Input 1: Nama Divisi */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-1.5">
            1. Nama Divisi <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Contoh: Divisi Pipeline Integrity & Asset Management"
            value={profile.divisionName}
            onChange={(e) => onChange({ ...profile, divisionName: e.target.value })}
            className="w-full text-sm px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-hidden font-medium text-slate-900 shadow-2xs"
          />
        </div>

        {/* Input 2: Deskripsi Singkat Tugas dan Tanggung Jawab */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-bold text-slate-800">
              2. Deskripsi Singkat Tugas & Tanggung Jawab Divisi
            </label>
            <span className="text-xs text-slate-400">Ikhtisar mandat divisi</span>
          </div>
          <textarea
            rows={3}
            placeholder="Jelaskan peran utama divisi dalam rantai transmisi gas alam, pengelolaan integritas aset pipa, keandalan operasi stasiun kompresor, keselamatan kerja, atau kepatuhan regulasi..."
            value={profile.divisionDescription}
            onChange={(e) => onChange({ ...profile, divisionDescription: e.target.value })}
            className="w-full text-sm p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-hidden text-slate-800 shadow-2xs leading-relaxed"
          />
        </div>

        {/* Input 3: Job Desc */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-bold text-slate-800">
              3. Uraian Pekerjaan (Job Desc Divisi)
            </label>
            
            {/* Document Upload Quick Button */}
            <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 cursor-pointer transition">
              <Upload className="w-3.5 h-3.5" />
              <span>Unggah Dokumen Job Desc</span>
              <input
                type="file"
                accept=".txt,.csv,.json,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {uploadStatus && (
            <div className="mb-2 p-2 text-xs rounded-md bg-blue-50 border border-blue-200 text-blue-800 flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              {uploadStatus}
            </div>
          )}

          <textarea
            rows={5}
            placeholder="Daftar rincian fungsi pekerjaan divisi, misalnya:
1. Pelaksanaan In-Line Inspection (ILI Smart Pigging) berkala.
2. Monitoring dan mitigasi stabilitas tanah geohazard pada jalur pipa.
3. Pengujian sistem proteksi katodik (CIPS/DCVG) sesuai NACE SP0169.
4. Kepatuhan MAOP dan investigasi audit temuan inspeksi teknis."
            value={profile.jobDesc}
            onChange={(e) => onChange({ ...profile, jobDesc: e.target.value })}
            className="w-full text-sm p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-hidden font-mono text-xs sm:text-sm text-slate-800 shadow-2xs leading-relaxed"
          />
        </div>

        {/* Input 4: Key Deliverables / Output Pekerjaan / Performance Measures */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-bold text-slate-800">
              4. Key Deliverables / Output Pekerjaan / Performance Measures
            </label>
            <span className="text-xs text-slate-400">Sesuai dokumen Job Desc resmi</span>
          </div>
          <textarea
            rows={4}
            placeholder="Target hasil akhir atau ukuran kinerja divisi, misalnya:
- Laporan ILI Smart Pigging 100% on schedule.
- Zero kegagalan pipa / Zero Loss of Containment.
- Realisasi 100% program mitigasi geohazard.
- Tingkat ketaatan -850 mV proteksi katodik >= 98%."
            value={profile.keyDeliverables}
            onChange={(e) => onChange({ ...profile, keyDeliverables: e.target.value })}
            className="w-full text-sm p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-hidden text-slate-800 shadow-2xs leading-relaxed"
          />
        </div>

      </div>

      {/* Action Buttons Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={onBack}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali (Pilih KPI Korporat)</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
            title="Kosongkan form profil divisi"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Form</span>
          </button>
        </div>

        {/* Generate Button */}
        <button
          type="button"
          onClick={onGenerate}
          disabled={!isFormValid || isLoading}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3 rounded-lg text-sm font-bold text-white transition shadow-sm cursor-pointer ${
            isFormValid && !isLoading
              ? 'bg-blue-700 hover:bg-blue-800 active:scale-98 shadow-blue-700/20'
              : 'bg-slate-400 cursor-not-allowed opacity-75'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Memproses dengan AI & Standar ASME/API/ISO...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate KPI Divisi</span>
            </>
          )}
        </button>

      </div>

    </div>
  );
};
