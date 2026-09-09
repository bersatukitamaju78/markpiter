import React from 'react';
import { 
  Building2, 
  UserCheck, 
  BookOpen, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  Flame,
  ShieldCheck
} from 'lucide-react';
import { MainMenu } from '../types';

interface HeaderProps {
  activeMenu: MainMenu;
  onSelectMenu: (menu: MainMenu) => void;
  onOpenStandards: () => void;
  onSaveDraft: () => void;
  onReset: () => void;
  draftSavedTime: string | null;
  divisionKpisCount: number;
  officerKpisCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeMenu,
  onSelectMenu,
  onOpenStandards,
  onSaveDraft,
  onReset,
  draftSavedTime,
  divisionKpisCount,
  officerKpisCount,
}) => {
  return (
    <header className="bg-gradient-to-r from-slate-950 via-[#0c2340] to-[#064e3b] border-b border-emerald-800/40 sticky top-0 z-30 shadow-md text-white">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-inner border border-white/20">
              <Flame className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  MARKPITER
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-xs">
                    v2.6 Enterprise
                  </span>
                </h1>
                <span className="hidden sm:inline-block text-xs font-medium text-slate-400">|</span>
                <span className="hidden sm:inline-block text-xs font-medium text-slate-200">
                  MATRIKS KPI Terintegrasi
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline shrink-0" />
                Gas Transmission Pipeline Standards (ASME B31.8S • API 1160 • PHMSA 192 • ISO 55001)
              </p>
            </div>
          </div>

          {/* Top Quick Actions */}
          <div className="flex items-center gap-2 self-end md:self-center">
            <button
              onClick={onOpenStandards}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-white/10 hover:bg-white/20 text-slate-100 transition border border-white/15 cursor-pointer backdrop-blur-xs"
              title="Lihat Referensi Standar ASME / API / PHMSA / ISO"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-300" />
              <span className="hidden sm:inline">Referensi</span> Standar Pipa Gas
            </button>

            <button
              onClick={onSaveDraft}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-emerald-500/25 hover:bg-emerald-500/35 text-emerald-100 transition border border-emerald-400/40 cursor-pointer backdrop-blur-xs"
              title="Simpan draft pengerjaan ke browser storage"
            >
              <Save className="w-3.5 h-3.5 text-emerald-300" />
              <span>Simpan Draft</span>
              {draftSavedTime && (
                <span className="text-[10px] text-emerald-300/80 hidden lg:inline">({draftSavedTime})</span>
              )}
            </button>

            <button
              onClick={onReset}
              type="button"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md bg-white/10 hover:bg-rose-500/30 hover:text-rose-200 text-slate-200 transition border border-white/15 hover:border-rose-400/40 cursor-pointer"
              title="Reset data formulir"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Primary Navigation Tabs: 2 Main Menus */}
        <div className="flex items-center justify-between pt-2">
          <nav className="flex space-x-2 sm:space-x-4" aria-label="Main Navigation">
            <button
              type="button"
              onClick={() => onSelectMenu('division')}
              className={`flex items-center gap-2 py-2.5 px-4 font-semibold text-sm border-b-2 transition cursor-pointer ${
                activeMenu === 'division'
                  ? 'border-emerald-400 text-white bg-white/15 rounded-t-md shadow-xs'
                  : 'border-transparent text-slate-300 hover:text-white hover:border-emerald-500/50 hover:bg-white/5'
              }`}
            >
              <Building2 className={`w-4 h-4 ${activeMenu === 'division' ? 'text-emerald-300' : 'text-slate-400'}`} />
              <span>Menu 1: KPI Divisi</span>
              {divisionKpisCount > 0 && (
                <span className="ml-1 text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                  {divisionKpisCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => onSelectMenu('officer')}
              className={`flex items-center gap-2 py-2.5 px-4 font-semibold text-sm border-b-2 transition cursor-pointer ${
                activeMenu === 'officer'
                  ? 'border-teal-300 text-white bg-white/15 rounded-t-md shadow-xs'
                  : 'border-transparent text-slate-300 hover:text-white hover:border-teal-400/50 hover:bg-white/5'
              }`}
            >
              <UserCheck className={`w-4 h-4 ${activeMenu === 'officer' ? 'text-teal-300' : 'text-slate-400'}`} />
              <span>Menu 2: KPI Officer</span>
              {officerKpisCount > 0 && (
                <span className="ml-1 text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-teal-500/30 text-teal-200 border border-teal-400/30">
                  {officerKpisCount}
                </span>
              )}
            </button>
          </nav>

          <div className="hidden md:flex items-center gap-2 text-xs text-slate-200 pb-2">
            <span className="flex items-center gap-1.5 font-medium px-2.5 py-1 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-200 shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              17 KPI Korporat Terverifikasi
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
