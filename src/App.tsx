import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CorporateKpiSelector } from './components/CorporateKpiSelector';
import { DivisionProfileForm } from './components/DivisionProfileForm';
import { DivisionKpiList } from './components/DivisionKpiList';
import { OfficerCascadeView } from './components/OfficerCascadeView';
import { GasStandardsModal } from './components/GasStandardsModal';
import { KpiEditModal } from './components/KpiEditModal';
import { ExportModal } from './components/ExportModal';
import { 
  MainMenu, 
  DivisionStep, 
  OfficerStep, 
  DivisionProfile, 
  OfficerProfile, 
  DivisionKPI, 
  OfficerKPI, 
  BSCCategory 
} from './types';
import { CORPORATE_KPIS } from './data/corporateKPIs';
import { PRESET_DIVISIONS } from './data/pipelineStandards';
import { generateOfflineDivisionKPIs, generateOfflineOfficerKPIs } from './data/domainEngine';
import { AlertTriangle, CheckCircle, Flame } from 'lucide-react';

const STORAGE_KEY = 'markpiter_state_v1';

export function App() {
  // Navigation State
  const [activeMenu, setActiveMenu] = useState<MainMenu>('division');
  const [divisionStep, setDivisionStep] = useState<DivisionStep>('select_corporate');
  const [officerStep, setOfficerStep] = useState<OfficerStep>('select_division_kpi');

  // Corporate KPI Selection (Default selected: Safety, GeoHazard, UAG, Gas Delivered, ILI, Cost, Training)
  const [selectedCorpKpiIds, setSelectedCorpKpiIds] = useState<string[]>([
    'corp-1', // Total Gas Delivered
    'corp-4', // EBITDA
    'corp-5', // Customer Satisfaction
    'corp-7', // Zero Incident / TRIR
    'corp-9', // GeoHazard Management
    'corp-11', // Unaccounted for Gas (UAG)
    'corp-15', // Mandatory Training
  ]);

  // Division State
  const [divisionProfile, setDivisionProfile] = useState<DivisionProfile>({
    divisionName: '',
    divisionDescription: '',
    jobDesc: '',
    keyDeliverables: '',
    targetYear: '2026',
  });
  const [divisionKpis, setDivisionKpis] = useState<DivisionKPI[]>([]);

  // Officer State
  const [selectedDivisionKpiIds, setSelectedDivisionKpiIds] = useState<string[]>([]);
  const [officerProfile, setOfficerProfile] = useState<OfficerProfile>({
    positionName: PRESET_DIVISIONS[0].officerPositions[0].title,
    positionDescription: PRESET_DIVISIONS[0].officerPositions[0].description,
    jobDesc: PRESET_DIVISIONS[0].officerPositions[0].jobDesc,
    performanceMeasures: PRESET_DIVISIONS[0].officerPositions[0].performanceMeasures,
    divisionName: PRESET_DIVISIONS[0].name,
  });
  const [officerKpis, setOfficerKpis] = useState<OfficerKPI[]>([]);

  // UI Modals & Loading
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [draftSavedTime, setDraftSavedTime] = useState<string | null>(null);
  const [isStandardsModalOpen, setIsStandardsModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [exportType, setExportType] = useState<'division' | 'officer' | 'both'>('division');
  
  // Edit & Manual Add Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editModalType, setEditModalType] = useState<'division' | 'officer'>('division');
  const [editingKpi, setEditingKpi] = useState<DivisionKPI | OfficerKPI | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.selectedCorpKpiIds) setSelectedCorpKpiIds(parsed.selectedCorpKpiIds);
        if (parsed.divisionProfile) setDivisionProfile(parsed.divisionProfile);
        if (parsed.divisionKpis && parsed.divisionKpis.length > 0) setDivisionKpis(parsed.divisionKpis);
        if (parsed.selectedDivisionKpiIds) setSelectedDivisionKpiIds(parsed.selectedDivisionKpiIds);
        if (parsed.officerProfile) setOfficerProfile(parsed.officerProfile);
        if (parsed.officerKpis && parsed.officerKpis.length > 0) setOfficerKpis(parsed.officerKpis);
        if (parsed.draftSavedTime) setDraftSavedTime(parsed.draftSavedTime);
      }
    } catch (e) {
      console.warn('Failed to load local storage draft:', e);
    }
  }, []);

  // Save draft helper
  const handleSaveDraft = () => {
    try {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const stateToSave = {
        selectedCorpKpiIds,
        divisionProfile,
        divisionKpis,
        selectedDivisionKpiIds,
        officerProfile,
        officerKpis,
        draftSavedTime: timeStr,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
      setDraftSavedTime(timeStr);
      showNotification('success', `Draft berhasil disimpan pada ${timeStr}`);
    } catch (e) {
      showNotification('error', 'Gagal menyimpan draft ke browser.');
    }
  };

  const handleReset = () => {
    if (window.confirm('Apakah Anda yakin ingin mereset seluruh data form dan pilihan KPI?')) {
      setSelectedCorpKpiIds([
        'corp-1', 'corp-4', 'corp-5', 'corp-7', 'corp-9', 'corp-11', 'corp-15'
      ]);
      setDivisionProfile({
        divisionName: '',
        divisionDescription: '',
        jobDesc: '',
        keyDeliverables: '',
        targetYear: '2026',
      });
      setDivisionKpis([]);
      setSelectedDivisionKpiIds([]);
      setOfficerProfile({
        positionName: PRESET_DIVISIONS[0].officerPositions[0].title,
        positionDescription: PRESET_DIVISIONS[0].officerPositions[0].description,
        jobDesc: PRESET_DIVISIONS[0].officerPositions[0].jobDesc,
        performanceMeasures: PRESET_DIVISIONS[0].officerPositions[0].performanceMeasures,
        divisionName: PRESET_DIVISIONS[0].name,
      });
      setOfficerKpis([]);
      setDivisionStep('select_corporate');
      setOfficerStep('select_division_kpi');
      localStorage.removeItem(STORAGE_KEY);
      setDraftSavedTime(null);
      showNotification('success', 'Formulir telah direset ke setelan awal.');
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // --- Corporate KPI Handlers ---
  const handleToggleSelectCorp = (id: string) => {
    setSelectedCorpKpiIds(prev => 
      prev.includes(id) ? prev.filter(k => k !== id) : [...prev, id]
    );
  };

  const handleSelectAllCorp = () => {
    setSelectedCorpKpiIds(CORPORATE_KPIS.map(k => k.id));
  };

  const handleDeselectAllCorp = () => {
    setSelectedCorpKpiIds([]);
  };

  const handleSelectCorpByCategory = (category: BSCCategory) => {
    const idsInCat = CORPORATE_KPIS.filter(k => k.category === category).map(k => k.id);
    const allSelected = idsInCat.every(id => selectedCorpKpiIds.includes(id));
    if (allSelected) {
      setSelectedCorpKpiIds(prev => prev.filter(id => !idsInCat.includes(id)));
    } else {
      setSelectedCorpKpiIds(prev => Array.from(new Set([...prev, ...idsInCat])));
    }
  };

  // --- Division KPI Generation via API with Domain Fallback ---
  const handleGenerateDivisionKPIs = async () => {
    setIsLoading(true);
    const selectedCorps = CORPORATE_KPIS.filter(k => selectedCorpKpiIds.includes(k.id));

    try {
      const response = await fetch('/api/generate-division-kpis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          divisionProfile,
          selectedCorporateKpis: selectedCorps,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const generatedList = data.kpis || data.data;
      if (generatedList && Array.isArray(generatedList) && generatedList.length > 0) {
        setDivisionKpis(generatedList);
        // Automatically select all for Officer cascading
        setSelectedDivisionKpiIds(generatedList.map((k: DivisionKPI) => k.id));
        setDivisionStep('division_kpi_results');
        showNotification('success', `Berhasil membuat ${generatedList.length} KPI Divisi (termasuk penerjemahan Key Deliverables & standar ASME/API).`);
      } else {
        throw new Error('Format data KPI tidak sesuai');
      }
    } catch (err: any) {
      console.warn('API call failed or key absent, using specialized domain engine fallback:', err);
      const fallbackKpis = generateOfflineDivisionKPIs(divisionProfile, selectedCorps);
      setDivisionKpis(fallbackKpis);
      setSelectedDivisionKpiIds(fallbackKpis.map(k => k.id));
      setDivisionStep('division_kpi_results');
      showNotification('success', `Menghasilkan ${fallbackKpis.length} KPI Divisi selaras standar transmisi gas alam.`);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Officer KPI Generation via API with Domain Fallback ---
  const handleGenerateOfficerKPIs = async () => {
    setIsLoading(true);
    const selectedDivKpis = divisionKpis.filter(k => selectedDivisionKpiIds.includes(k.id));

    try {
      const response = await fetch('/api/generate-officer-kpis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          officerProfile: {
            ...officerProfile,
            divisionName: divisionProfile.divisionName,
          },
          selectedDivisionKpis: selectedDivKpis.length > 0 ? selectedDivKpis : divisionKpis,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const generatedList = data.kpis || data.data;
      if (generatedList && Array.isArray(generatedList) && generatedList.length > 0) {
        setOfficerKpis(generatedList);
        setOfficerStep('officer_kpi_results');
        showNotification('success', `Berhasil menghasilkan ${generatedList.length} KPI Turunan untuk posisi ${officerProfile.positionName} (termasuk dari Performance Measures).`);
      } else {
        throw new Error('Format KPI officer tidak valid');
      }
    } catch (err: any) {
      console.warn('API call failed, using specialized domain engine fallback:', err);
      const fallbackKpis = generateOfflineOfficerKPIs(
        officerProfile,
        selectedDivKpis.length > 0 ? selectedDivKpis : divisionKpis
      );
      setOfficerKpis(fallbackKpis);
      setOfficerStep('officer_kpi_results');
      showNotification('success', `Menghasilkan ${fallbackKpis.length} KPI Turunan untuk posisi ${officerProfile.positionName}.`);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Division KPI Management Handlers ---
  const handleToggleSelectDivisionKpi = (id: string) => {
    setDivisionKpis(prev =>
      prev.map(k => (k.id === id ? { ...k, isSelected: !k.isSelected } : k))
    );
  };

  const handleSelectAllDivisionKpis = () => {
    setDivisionKpis(prev => prev.map(k => ({ ...k, isSelected: true })));
  };

  const handleDeselectAllDivisionKpis = () => {
    setDivisionKpis(prev => prev.map(k => ({ ...k, isSelected: false })));
  };

  const handleDeleteDivisionKpi = (id: string) => {
    setDivisionKpis(prev => prev.filter(k => k.id !== id));
    setSelectedDivisionKpiIds(prev => prev.filter(kId => kId !== id));
    showNotification('success', 'KPI Divisi berhasil dihapus.');
  };

  const handleMoveUpDivisionKpi = (index: number) => {
    if (index === 0) return;
    setDivisionKpis(prev => {
      const next = [...prev];
      const temp = next[index - 1];
      next[index - 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  const handleMoveDownDivisionKpi = (index: number) => {
    if (index >= divisionKpis.length - 1) return;
    setDivisionKpis(prev => {
      const next = [...prev];
      const temp = next[index + 1];
      next[index + 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  // --- Officer KPI Management Handlers ---
  const handleToggleSelectOfficerKpi = (id: string) => {
    setOfficerKpis(prev =>
      prev.map(k => (k.id === id ? { ...k, isSelected: !k.isSelected } : k))
    );
  };

  const handleDeleteOfficerKpi = (id: string) => {
    setOfficerKpis(prev => prev.filter(k => k.id !== id));
    showNotification('success', 'KPI Officer berhasil dihapus.');
  };

  const handleMoveUpOfficerKpi = (index: number) => {
    if (index === 0) return;
    setOfficerKpis(prev => {
      const next = [...prev];
      const temp = next[index - 1];
      next[index - 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  const handleMoveDownOfficerKpi = (index: number) => {
    if (index >= officerKpis.length - 1) return;
    setOfficerKpis(prev => {
      const next = [...prev];
      const temp = next[index + 1];
      next[index + 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  // --- Modal Openers ---
  const handleOpenEditDivisionKpi = (kpi: DivisionKPI) => {
    setEditingKpi(kpi);
    setEditModalType('division');
    setIsEditModalOpen(true);
  };

  const handleOpenAddManualDivisionKpi = () => {
    setEditingKpi(null);
    setEditModalType('division');
    setIsEditModalOpen(true);
  };

  const handleOpenEditOfficerKpi = (kpi: OfficerKPI) => {
    setEditingKpi(kpi);
    setEditModalType('officer');
    setIsEditModalOpen(true);
  };

  const handleOpenAddManualOfficerKpi = () => {
    setEditingKpi(null);
    setEditModalType('officer');
    setIsEditModalOpen(true);
  };

  const handleSaveDivisionKpiModal = (kpi: DivisionKPI) => {
    setDivisionKpis(prev => {
      const idx = prev.findIndex(item => item.id === kpi.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = kpi;
        return next;
      }
      return [...prev, kpi];
    });
    showNotification('success', 'KPI Divisi berhasil disimpan.');
  };

  const handleSaveOfficerKpiModal = (kpi: OfficerKPI) => {
    setOfficerKpis(prev => {
      const idx = prev.findIndex(item => item.id === kpi.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = kpi;
        return next;
      }
      return [...prev, kpi];
    });
    showNotification('success', 'KPI Officer berhasil disimpan.');
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased">
      
      {/* Top Application Header */}
      <Header
        activeMenu={activeMenu}
        onSelectMenu={setActiveMenu}
        onOpenStandards={() => setIsStandardsModalOpen(true)}
        onSaveDraft={handleSaveDraft}
        onReset={handleReset}
        draftSavedTime={draftSavedTime}
        divisionKpisCount={divisionKpis.length}
        officerKpisCount={officerKpis.length}
      />

      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 animate-in slide-in-from-top-3 duration-200">
          <div
            className={`p-3.5 rounded-lg shadow-lg border flex items-center gap-2.5 text-xs font-semibold ${
              notification.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* MENU 1: KPI DIVISI */}
        {activeMenu === 'division' && (
          <div className="space-y-6">
            
            {/* Step 1: Input & Select 17 Corporate KPIs */}
            {divisionStep === 'select_corporate' && (
              <CorporateKpiSelector
                selectedIds={selectedCorpKpiIds}
                onToggleSelect={handleToggleSelectCorp}
                onSelectAll={handleSelectAllCorp}
                onDeselectAll={handleDeselectAllCorp}
                onSelectByCategory={handleSelectCorpByCategory}
                onNext={() => setDivisionStep('division_profile')}
              />
            )}

            {/* Step 2: Input Division Profile & Job Desc */}
            {divisionStep === 'division_profile' && (
              <DivisionProfileForm
                profile={divisionProfile}
                onChange={setDivisionProfile}
                onGenerate={handleGenerateDivisionKPIs}
                onBack={() => setDivisionStep('select_corporate')}
                onReset={() => {
                  setDivisionProfile({
                    divisionName: '',
                    divisionDescription: '',
                    jobDesc: '',
                    keyDeliverables: '',
                    targetYear: '2026',
                  });
                }}
                isLoading={isLoading}
                selectedCorpKpiCount={selectedCorpKpiIds.length}
              />
            )}

            {/* Step 3: Division KPI Table / Card Results */}
            {divisionStep === 'division_kpi_results' && (
              <DivisionKpiList
                kpis={divisionKpis}
                profile={divisionProfile}
                onToggleSelectKpi={handleToggleSelectDivisionKpi}
                onSelectAllKpis={handleSelectAllDivisionKpis}
                onDeselectAllKpis={handleDeselectAllDivisionKpis}
                onEditKpi={handleOpenEditDivisionKpi}
                onDeleteKpi={handleDeleteDivisionKpi}
                onAddManualKpi={handleOpenAddManualDivisionKpi}
                onMoveUp={handleMoveUpDivisionKpi}
                onMoveDown={handleMoveDownDivisionKpi}
                onExport={() => {
                  setExportType('division');
                  setIsExportModalOpen(true);
                }}
                onBackToProfile={() => setDivisionStep('division_profile')}
                onProceedToOfficer={() => {
                  setActiveMenu('officer');
                  setOfficerStep('select_division_kpi');
                }}
              />
            )}

          </div>
        )}

        {/* MENU 2: KPI OFFICER */}
        {activeMenu === 'officer' && (
          <OfficerCascadeView
            availableDivisionKpis={divisionKpis}
            selectedDivisionKpiIds={selectedDivisionKpiIds}
            onToggleSelectDivisionKpi={(id) => {
              setSelectedDivisionKpiIds(prev =>
                prev.includes(id) ? prev.filter(k => k !== id) : [...prev, id]
              );
            }}
            onSelectAllDivisionKpis={() => {
              setSelectedDivisionKpiIds(divisionKpis.map(k => k.id));
            }}
            officerProfile={officerProfile}
            onChangeOfficerProfile={setOfficerProfile}
            officerKpis={officerKpis}
            onGenerateOfficerKpis={handleGenerateOfficerKPIs}
            isLoading={isLoading}
            onToggleSelectOfficerKpi={handleToggleSelectOfficerKpi}
            onEditOfficerKpi={handleOpenEditOfficerKpi}
            onDeleteOfficerKpi={handleDeleteOfficerKpi}
            onAddManualOfficerKpi={handleOpenAddManualOfficerKpi}
            onMoveUpOfficerKpi={handleMoveUpOfficerKpi}
            onMoveDownOfficerKpi={handleMoveDownOfficerKpi}
            onExportOfficerKpis={() => {
              setExportType('officer');
              setIsExportModalOpen(true);
            }}
            onResetOfficer={() => {
              setOfficerProfile({
                positionName: '',
                positionDescription: '',
                jobDesc: '',
                performanceMeasures: '',
                divisionName: divisionProfile.divisionName,
              });
              setOfficerKpis([]);
            }}
            currentStep={officerStep}
            onChangeStep={setOfficerStep}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-slate-800">MARKPITER</span>
            <span>— Matriks KPI Terintegrasi Sektor Transmisi Gas Alam</span>
          </div>
          <div className="text-slate-400">
            Kepatuhan Regulasi & Standar: ASME B31.8 / B31.8S • API 1160 • PHMSA 192 • ISO 55001 • ISO 9001
          </div>
        </div>
      </footer>

      {/* Gas Transmission Standards Modal */}
      <GasStandardsModal
        isOpen={isStandardsModalOpen}
        onClose={() => setIsStandardsModalOpen(false)}
      />

      {/* Edit / Manual Add KPI Modal */}
      <KpiEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        type={editModalType}
        initialData={editingKpi}
        onSaveDivisionKpi={handleSaveDivisionKpiModal}
        onSaveOfficerKpi={handleSaveOfficerKpiModal}
        divisionName={divisionProfile.divisionName}
        availableDivisionKpis={divisionKpis}
      />

      {/* Export Dialog */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        type={exportType}
        divisionProfile={divisionProfile}
        divisionKpis={divisionKpis}
        officerProfile={officerProfile}
        officerKpis={officerKpis}
      />

    </div>
  );
}
export default App;
