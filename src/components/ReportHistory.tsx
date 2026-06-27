import React, { useState } from 'react';
import { 
  Search, ClipboardPlus, Calendar, Award, Trash2, 
  ChevronRight, BrainCircuit, AlertCircle, TrendingDown, TrendingUp
} from 'lucide-react';
import { CounselingReport } from '../types';

interface ReportHistoryProps {
  reports: CounselingReport[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}

export default function ReportHistory({ 
  reports, selectedId, onSelect, onDelete, onNew 
}: ReportHistoryProps) {
  const [search, setSearch] = useState<string>('');

  const filteredReports = reports.filter(r => {
    const query = search.toLowerCase();
    return (
      r.clientName.toLowerCase().includes(query) ||
      (r.desiredJob || '').toLowerCase().includes(query) ||
      r.counselorName.toLowerCase().includes(query)
    );
  });

  // Calculate some quick stats for the workspace header or side panel
  const totalClientsCount = new Set(reports.map(r => r.clientName)).size;
  const avgPhqReduction = reports.reduce((acc, r) => {
    const diff = r.phqPrevious - r.phqCurrent;
    return acc + (diff > 0 ? diff : 0);
  }, 0) / (reports.length || 1);

  const getPhqStatusBadge = (phq: number) => {
    if (phq >= 20) return { label: '심각(고위험)', color: 'bg-rose-50 text-rose-700 border-rose-200' };
    if (phq >= 10) return { label: '중등도', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { label: '경미/양호', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 border-r border-slate-800 rounded-2xl overflow-hidden shadow-xl" id="report-history">
      {/* Sidebar Header */}
      <div className="p-5 border-b border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold">
            W
          </div>
          <div>
            <h2 className="font-bold text-sm text-slate-100 leading-none">Welfare Counsel AI</h2>
            <p className="text-[10px] text-slate-400 mt-1">상담회기보고서 관리 시스템</p>
          </div>
        </div>

        <button
          onClick={onNew}
          className="w-full bg-sky-600 hover:bg-sky-500 transition-colors text-white py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm shadow-sky-900/50 cursor-pointer"
        >
          <ClipboardPlus className="w-4 h-4" />
          <span>새 상담회기 등록 (AI 작성)</span>
        </button>
      </div>

      {/* Mini Stat Summary widget inside Sidebar */}
      <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-950/20 grid grid-cols-2 gap-3 text-center">
        <div className="p-2 rounded-lg bg-slate-800/40 border border-slate-800/60">
          <span className="block text-[10px] text-slate-400 font-medium">관리 내담자 수</span>
          <span className="text-sm font-bold text-slate-200">{totalClientsCount}명</span>
        </div>
        <div className="p-2 rounded-lg bg-slate-800/40 border border-slate-800/60">
          <span className="block text-[10px] text-slate-400 font-medium font-semibold flex justify-center items-center gap-0.5">
            우울감 개선 <TrendingDown className="w-3 h-3 text-emerald-400" />
          </span>
          <span className="text-sm font-bold text-emerald-400">평균 -{avgPhqReduction.toFixed(1)}점</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/10">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="내담자명, 희망직종 검색..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-9 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
          />
        </div>
      </div>

      {/* Report History List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <span className="block text-[10px] font-bold text-slate-500 px-2 uppercase tracking-wider mb-2">상담 회차 이력</span>
        
        {filteredReports.length === 0 ? (
          <div className="text-center py-8 px-4 text-slate-500">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-xs">기록된 상담 보고서가 없습니다.</p>
          </div>
        ) : (
          filteredReports.map((report) => {
            const isSelected = report.id === selectedId;
            const badge = getPhqStatusBadge(report.phqCurrent);
            const phqDelta = report.phqPrevious - report.phqCurrent;

            return (
              <div
                key={report.id}
                onClick={() => onSelect(report.id)}
                className={`group relative p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                  isSelected
                    ? 'bg-slate-800/80 border-sky-500/50 shadow-md shadow-sky-950/20'
                    : 'bg-slate-800/20 border-slate-800/40 hover:bg-slate-800/40 hover:border-slate-800'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-slate-200 text-sm">{report.clientName} 내담자</span>
                      <span className="text-[10px] bg-slate-700 text-slate-300 font-medium px-1.5 py-0.5 rounded">
                        {report.sessionCount}회차
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mt-1">
                      <Award className="w-3.5 h-3.5 text-slate-500" />
                      <span className="truncate max-w-[120px]">{report.desiredJob || '직종 미지정'}</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`${report.clientName}님의 ${report.sessionCount}회차 상담 보고서를 삭제하시겠습니까?`)) {
                        onDelete(report.id);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-700/60 text-slate-400 hover:text-red-400 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Score Indicators inside List Item */}
                <div className="flex items-center justify-between text-[11px] border-t border-slate-800/60 pt-2 flex-wrap gap-2">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-slate-600" />
                    <span>{report.sessionDate}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold border ${badge.color}`}>
                      PHQ {report.phqCurrent}점
                    </span>
                    {phqDelta > 0 && (
                      <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-0.5">
                        <TrendingDown className="w-3 h-3" />
                        <span>{phqDelta}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
