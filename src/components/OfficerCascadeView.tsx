import React, { useState } from 'react';
import { 
  UserCheck, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  RotateCcw, 
  Plus, 
  Edit3, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Download, 
  Check, 
  Layers, 
  Upload, 
  Link as LinkIcon, 
  FileSpreadsheet, 
  Table as TableIcon, 
  LayoutGrid, 
  ShieldCheck, 
  CheckCircle,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { OfficerProfile, OfficerKPI, DivisionKPI, BSCCategory, OfficerStep } from '../types';
import { BSC_PERSPECTIVE_META } from '../data/corporateKPIs';
import { PRESET_DIVISIONS } from '../data/pipelineStandards';

interface OfficerCascadeViewProps {
  availableDivisionKpis: DivisionKPI[];
  selectedDivisionKpiIds: string[];
  onToggleSelectDivisionKpi: (id: string) => void;
  onSelectAllDivisionKpis: () => void;
  officerProfile: OfficerProfile;
  onChangeOfficerProfile: (profile: OfficerProfile) => void;
  officerKpis: OfficerKPI[];
  onGenerateOfficerKpis: () => void;
  isLoading: boolean;
  onToggleSelectOfficerKpi: (id: string) => void;
  onEditOfficerKpi: (kpi: OfficerKPI) => void;
  onDeleteOfficerKpi: (id: string) => void;
  onAddManualOfficerKpi: () => void;
  onMoveUpOfficerKpi: (index: number) => void;
  onMoveDownOfficerKpi: (index: number) => void;
  onExportOfficerKpis: () => void;
  onResetOfficer: () => void;
  currentStep: OfficerStep;
  onChangeStep: (step: OfficerStep) => void;
}

export const OfficerCascadeView: React.FC<OfficerCascadeViewProps> = ({
  availableDivisionKpis,
  selectedDivisionKpiIds,
  onToggleSelectDivisionKpi,
  onSelectAllDivisionKpis,
  officerProfile,
  onChangeOfficerProfile,
  officerKpis,
  onGenerateOfficerKpis,
  isLoading,
  onToggleSelectOfficerKpi,
  onEditOfficerKpi,
  onDeleteOfficerKpi,
  onAddManualOfficerKpi,
  onMoveUpOfficerKpi,
  onMoveDownOfficerKpi,
  onExportOfficerKpis,
  onResetOfficer,
  currentStep,
  onChangeStep,
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [googleSheetLink, setGoogleSheetLink] = useState('');
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [selectedPresetPos, setSelectedPresetPos] = useState('');

  const activeDivisionKpis = availableDivisionKpis.filter(k => selectedDivisionKpiIds.includes(k.id));
  const activeOfficerKpis = officerKpis.filter(k => k.isSelected !== false);

  // Extract all officer presets across divisions
  const allOfficerPresets = PRESET_DIVISIONS.flatMap(d => 
    d.officerPositions.map(op => ({
      ...op,
      divisionName: d.name
    }))
  );

  const handleApplyPreset = (positionTitle: string) => {
    setSelectedPresetPos(positionTitle);
    const found = allOfficerPresets.find(p => p.title === positionTitle);
    if (found) {
      onChangeOfficerProfile({
        positionName: found.title,
        positionDescription: found.description,
        jobDesc: found.jobDesc,
        performanceMeasures: found.performanceMeasures,
        divisionName: found.divisionName
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
        onChangeOfficerProfile({
          ...officerProfile,
          jobDesc: (officerProfile.jobDesc ? officerProfile.jobDesc + '\n\n' : '') + `[Dokumen ${file.name}]:\n` + content.slice(0, 3000)
        });
        setUploadStatus(`File ${file.name} berhasil diunggah.`);
        setTimeout(() => setUploadStatus(null), 4000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      
      {/* Officer Wizard Breadcrumb / Step Indicator */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-700 text-white flex items-center justify-center font-bold text-sm">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Menu 2: KPI Officer / Cascading</h3>
              <p className="text-xs text-slate-500">Penyusunan KPI Turunan Level Jabatan & Staf</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => onChangeStep('select_division_kpi')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition cursor-pointer ${
                currentStep === 'select_division_kpi'
                  ? 'bg-indigo-700 text-white border-indigo-700 shadow-xs'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              1. Pilih KPI Divisi Induk
            </button>

            <span className="text-slate-300">→</span>

            <button
              type="button"
              onClick={() => onChangeStep('officer_profile')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition cursor-pointer ${
                currentStep === 'officer_profile'
                  ? 'bg-indigo-700 text-white border-indigo-700 shadow-xs'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              2. Profil Jabatan
            </button>

            <span className="text-slate-300">→</span>

            <button
              type="button"
              onClick={() => onChangeStep('officer_kpi_results')}
              disabled={officerKpis.length === 0}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition cursor-pointer ${
                currentStep === 'officer_kpi_results'
                  ? 'bg-indigo-700 text-white border-indigo-700 shadow-xs'
                  : officerKpis.length > 0
                  ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  : 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
              }`}
            >
              3. Hasil KPI Turunan ({officerKpis.length})
            </button>
          </div>
        </div>
      </div>

      {/* STEP 1: SELECT / INPUT DIVISION KPIS */}
      {currentStep === 'select_division_kpi' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                  Tahap 1: Input KPI Divisi Final
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
                  Pilih KPI Divisi yang Akan Diturunkan (Cascading)
                </h2>
                <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  Pilih satu atau lebih KPI Divisi final yang akan menjadi dasar acuan penurunan target kerja untuk posisi/jabatan Officer.
                </p>
              </div>

              {/* Import external file / Google sheet link */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 w-full sm:w-80 space-y-2">
                <label className="text-xs font-bold text-slate-700 block flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-indigo-600" />
                  Lampirkan File / Link Google Sheet:
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    value={googleSheetLink}
                    onChange={(e) => setGoogleSheetLink(e.target.value)}
                    className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded-md focus:outline-hidden"
                  />
                  <label className="p-1.5 bg-white border border-slate-300 rounded-md text-slate-700 hover:bg-slate-100 cursor-pointer shrink-0" title="Upload PDF/Excel">
                    <Upload className="w-3.5 h-3.5" />
                    <input type="file" accept=".pdf,.xlsx,.csv,.txt" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
                {uploadStatus && <span className="text-[11px] text-emerald-600 block">{uploadStatus}</span>}
              </div>
            </div>
          </div>

          {/* Division KPI Cards List */}
          {availableDivisionKpis.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-700">
                  {selectedDivisionKpiIds.length} dari {availableDivisionKpis.length} KPI Divisi Dipilih untuk Cascading
                </span>
                <button
                  type="button"
                  onClick={onSelectAllDivisionKpis}
                  className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 cursor-pointer"
                >
                  Pilih Semua KPI Divisi
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {availableDivisionKpis.map((kpi, idx) => {
                  const isSelected = selectedDivisionKpiIds.includes(kpi.id);
                  const meta = BSC_PERSPECTIVE_META[kpi.kpiType];

                  return (
                    <div
                      key={kpi.id}
                      onClick={() => onToggleSelectDivisionKpi(kpi.id)}
                      className={`p-4 rounded-xl border-2 transition cursor-pointer select-none flex flex-col justify-between ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                              isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                            }`}>
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                            <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
                          </div>

                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${meta?.bgBadge || 'bg-slate-100 text-slate-700'}`}>
                            {kpi.kpiType}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 leading-snug mb-1">
                          {kpi.divisionKpi}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-2 mb-2">
                          {kpi.definition}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                        <span className="text-slate-500">Satuan: <strong>{kpi.unit}</strong></span>
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Target: {kpi.target}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Belum Ada KPI Divisi Tersimpan</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Anda dapat menyusun KPI Divisi terlebih dahulu pada Menu 1, atau mengisi profil jabatan di tahap berikutnya.
              </p>
            </div>
          )}

          {/* Step 1 Footer */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex justify-end">
            <button
              type="button"
              onClick={() => onChangeStep('officer_profile')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-indigo-700 hover:bg-indigo-800 transition cursor-pointer"
            >
              <span>Lanjut ke Input Profil Jabatan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: INPUT OFFICER PROFILE */}
      {currentStep === 'officer_profile' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                  Tahap 2: Input Profil Jabatan
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
                  Lengkapi Data Pekerjaan & Performance Measures Jabatan
                </h2>
                <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  Masukkan nama jabatan, uraian tugas, dan ukuran kinerja jabatan. AI akan menghasilkan usulan KPI Turunan yang terhubung langsung dengan KPI Divisi.
                </p>
              </div>

              {/* Preset Selector */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 w-full sm:w-80">
                <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                  Template Posisi Pipa Gas:
                </label>
                <select
                  value={selectedPresetPos}
                  onChange={(e) => handleApplyPreset(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-300 rounded-md p-2 text-slate-800 focus:outline-hidden cursor-pointer"
                >
                  <option value="">-- Pilih Contoh Posisi --</option>
                  {allOfficerPresets.map((op, idx) => (
                    <option key={idx} value={op.title}>
                      {op.title} ({op.divisionName.replace('Divisi ', '')})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
            
            {/* Input 1: Nama Jabatan */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1.5">
                1. Nama Jabatan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Pipeline Integrity Engineer / Cathodic Protection Specialist / Gas Dispatcher"
                value={officerProfile.positionName}
                onChange={(e) => onChangeOfficerProfile({ ...officerProfile, positionName: e.target.value })}
                className="w-full text-sm px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium text-slate-900"
              />
            </div>

            {/* Input 2: Deskripsi Singkat Pekerjaan / Tanggung Jawab Jabatan */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1.5">
                2. Deskripsi Singkat Pekerjaan / Tanggung Jawab Jabatan
              </label>
              <textarea
                rows={3}
                placeholder="Jelaskan fokus utama peran jabatan ini dalam operasional perpipaan, investigasi anomali, monitoring SCADA, atau keselamatan kerja..."
                value={officerProfile.positionDescription}
                onChange={(e) => onChangeOfficerProfile({ ...officerProfile, positionDescription: e.target.value })}
                className="w-full text-sm p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden text-slate-800 leading-relaxed"
              />
            </div>

            {/* Input 3: Job Desc */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-bold text-slate-800">
                  3. Uraian Tugas Pekerjaan (Job Desc)
                </label>
                
                <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200 cursor-pointer transition">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Unggah File Job Desc</span>
                  <input type="file" accept=".txt,.csv,.json,.doc,.docx" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
              <textarea
                rows={4}
                placeholder="Daftar rincian tugas spesifik jabatan:
1. Analisis data laporan ILI Smart Pigging.
2. Perhitungan sisa umur pipa dan MAOP re-rating.
3. Supervisi verifikasi penggalian anomali korosi di lapangan."
                value={officerProfile.jobDesc}
                onChange={(e) => onChangeOfficerProfile({ ...officerProfile, jobDesc: e.target.value })}
                className="w-full text-sm p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-mono text-xs sm:text-sm text-slate-800 leading-relaxed"
              />
            </div>

            {/* Input 4: Performance Measures */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1.5">
                4. Performance Measures / Key Deliverables Jabatan
              </label>
              <textarea
                rows={3}
                placeholder="Ukuran keberhasilan staf/officer:
- Ketepatan waktu analisis ILI (< 30 hari).
- 100% verifikasi anomali pipa kritis diselesaikan.
- Nol insiden kecelakaan kerja selama bertugas di lapangan."
                value={officerProfile.performanceMeasures}
                onChange={(e) => onChangeOfficerProfile({ ...officerProfile, performanceMeasures: e.target.value })}
                className="w-full text-sm p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden text-slate-800 leading-relaxed"
              />
            </div>

          </div>

          {/* Action Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => onChangeStep('select_division_kpi')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali (Pilih KPI Divisi)</span>
            </button>

            <button
              type="button"
              onClick={onGenerateOfficerKpis}
              disabled={!officerProfile.positionName.trim() || isLoading}
              className={`inline-flex items-center gap-2 px-7 py-3 rounded-lg text-sm font-bold text-white transition shadow-sm cursor-pointer ${
                officerProfile.positionName.trim() && !isLoading
                  ? 'bg-indigo-700 hover:bg-indigo-800 active:scale-98'
                  : 'bg-slate-400 cursor-not-allowed opacity-75'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Menurunkan KPI dengan AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate KPI Turunan</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: OFFICER KPI RESULTS & MANAGEMENT */}
      {currentStep === 'officer_kpi_results' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                  Tahap 3: Hasil KPI Turunan Officer
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
                  Matriks KPI Turunan Jabatan: {officerProfile.positionName}
                </h2>
                <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  Berikut usulan KPI tingkat staf/officer yang telah diselaraskan dengan KPI Divisi dan standar teknis transmisi gas bumi.
                </p>
              </div>

              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 self-start sm:self-center shrink-0">
                <div className="text-center px-2">
                  <span className="text-xs text-slate-500 block font-medium">KPI Digunakan</span>
                  <span className="text-lg font-bold text-indigo-700">
                    {activeOfficerKpis.length} <span className="text-xs font-normal text-slate-400">/ {officerKpis.length}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">
                {activeOfficerKpis.length} KPI Terpilih untuk Jabatan Ini
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 justify-end">
              <div className="inline-flex rounded-lg border border-slate-300 bg-slate-100 p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition flex items-center gap-1 cursor-pointer ${
                    viewMode === 'table' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  Tabel
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('cards')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition flex items-center gap-1 cursor-pointer ${
                    viewMode === 'cards' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  Kartu
                </button>
              </div>

              <button
                type="button"
                onClick={onAddManualOfficerKpi}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Tambah KPI Manual</span>
              </button>

              <button
                type="button"
                onClick={onExportOfficerKpis}
                disabled={activeOfficerKpis.length === 0}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-800 hover:bg-slate-900 text-white transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export KPI Officer</span>
              </button>
            </div>
          </div>

          {/* Table View */}
          {viewMode === 'table' ? (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider border-b border-slate-200">
                      <th className="py-3.5 px-3 w-12 text-center">Gunakan</th>
                      <th className="py-3.5 px-2 w-10 text-center">No</th>
                      <th className="py-3.5 px-4 min-w-[220px]">Officer KPI & Definisi</th>
                      <th className="py-3.5 px-3 min-w-[130px]">KPI Type</th>
                      <th className="py-3.5 px-4 min-w-[180px]">Measurement / Formula & Unit</th>
                      <th className="py-3.5 px-3 min-w-[120px]">Target</th>
                      <th className="py-3.5 px-4 min-w-[200px]">Diturunkan Dari KPI Divisi</th>
                      <th className="py-3.5 px-4 min-w-[200px]">Rationale & Standar</th>
                      <th className="py-3.5 px-3 w-24 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {officerKpis.map((kpi, idx) => {
                      const isSelected = kpi.isSelected !== false;
                      const meta = BSC_PERSPECTIVE_META[kpi.kpiType];

                      return (
                        <tr
                          key={kpi.id}
                          className={`hover:bg-slate-50/80 transition ${!isSelected ? 'opacity-50 bg-slate-50/40' : ''}`}
                        >
                          <td className="py-4 px-3 text-center align-top">
                            <button
                              type="button"
                              onClick={() => onToggleSelectOfficerKpi(kpi.id)}
                              className={`w-5 h-5 rounded-md inline-flex items-center justify-center border transition cursor-pointer ${
                                isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                              }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </button>
                          </td>

                          <td className="py-4 px-2 text-center text-xs font-bold text-slate-400 align-top">
                            {idx + 1}
                          </td>

                          <td className="py-4 px-4 align-top">
                            <div className="font-bold text-slate-900 leading-snug mb-1">
                              {kpi.officerKpi}
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {kpi.definition}
                            </p>
                          </td>

                          <td className="py-4 px-3 align-top">
                            <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-md border ${meta?.bgBadge || 'bg-slate-100 text-slate-700'}`}>
                              {kpi.kpiType}
                            </span>
                          </td>

                          <td className="py-4 px-4 align-top">
                            <div className="font-mono text-xs text-slate-800 bg-slate-50 p-2 rounded-md border border-slate-200 leading-relaxed mb-1">
                              {kpi.measurementFormula}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              Satuan: <strong className="text-slate-700">{kpi.unit}</strong>
                            </div>
                          </td>

                          <td className="py-4 px-3 align-top">
                            <span className="inline-block px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200">
                              {kpi.target}
                            </span>
                          </td>

                          <td className="py-4 px-4 align-top text-xs text-slate-700 leading-relaxed">
                            <div className="p-2 rounded-md bg-indigo-50/60 border border-indigo-100 text-indigo-900 font-medium">
                              {kpi.cascadedFromDivisionKpi}
                            </div>
                          </td>

                          <td className="py-4 px-4 align-top text-xs text-slate-600 leading-relaxed">
                            <p className="mb-1.5">{kpi.rationale}</p>
                            {kpi.gasStandardRef && (
                              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-blue-50 text-blue-800 text-[10px] font-bold border border-blue-200">
                                <ShieldCheck className="w-3 h-3 text-blue-600" />
                                {kpi.gasStandardRef}
                              </div>
                            )}
                          </td>

                          <td className="py-4 px-3 align-top">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => onMoveUpOfficerKpi(idx)}
                                disabled={idx === 0}
                                className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => onMoveDownOfficerKpi(idx)}
                                disabled={idx === officerKpis.length - 1}
                                className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => onEditOfficerKpi(kpi)}
                                className="p-1 text-indigo-600 hover:text-indigo-800 cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => onDeleteOfficerKpi(kpi.id)}
                                className="p-1 text-rose-500 hover:text-rose-700 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {officerKpis.map((kpi, idx) => {
                const isSelected = kpi.isSelected !== false;
                const meta = BSC_PERSPECTIVE_META[kpi.kpiType];

                return (
                  <div
                    key={kpi.id}
                    className={`bg-white rounded-xl border-2 p-5 shadow-xs transition flex flex-col justify-between ${
                      isSelected ? 'border-indigo-600' : 'border-slate-200 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onToggleSelectOfficerKpi(kpi.id)}
                            className={`w-5 h-5 rounded-md inline-flex items-center justify-center border transition cursor-pointer ${
                              isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </button>
                          <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
                        </div>

                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${meta?.bgBadge}`}>
                          {kpi.kpiType}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900 leading-snug mb-1">
                        {kpi.officerKpi}
                      </h4>
                      <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                        {kpi.definition}
                      </p>

                      <div className="p-2.5 rounded-md bg-indigo-50 border border-indigo-100 text-xs mb-3">
                        <span className="text-indigo-700 font-semibold block text-[11px] mb-0.5">Diturunkan Dari KPI Divisi:</span>
                        <span className="text-indigo-950 font-medium">{kpi.cascadedFromDivisionKpi}</span>
                      </div>

                      <div className="space-y-2 mb-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                        <div>
                          <span className="text-slate-500 font-semibold block mb-0.5">Formula Pengukuran:</span>
                          <code className="font-mono text-slate-800 block text-[11px] bg-white p-1.5 rounded border border-slate-200">
                            {kpi.measurementFormula}
                          </code>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-slate-500">Satuan: <strong className="text-slate-800">{kpi.unit}</strong></span>
                          <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Target: {kpi.target}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-600 mb-2 leading-relaxed">
                        <strong className="text-slate-700">Rationale:</strong> {kpi.rationale}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-1 text-xs">
                      <button
                        type="button"
                        onClick={() => onMoveUpOfficerKpi(idx)}
                        disabled={idx === 0}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onMoveDownOfficerKpi(idx)}
                        disabled={idx === officerKpis.length - 1}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEditOfficerKpi(kpi)}
                        className="p-1.5 rounded-md text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteOfficerKpi(kpi.id)}
                        className="p-1.5 rounded-md text-rose-500 hover:text-rose-700 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Hapus
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Navigation Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-4 z-20">
            <button
              type="button"
              onClick={() => onChangeStep('officer_profile')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Edit Profil Jabatan</span>
            </button>

            <button
              type="button"
              onClick={onExportOfficerKpis}
              disabled={activeOfficerKpis.length === 0}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-indigo-700 hover:bg-indigo-800 transition shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export KPI Officer ({activeOfficerKpis.length})</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
