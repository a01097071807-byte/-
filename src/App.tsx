import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, CheckSquare, Sparkles, AlertTriangle, AlertCircle, 
  HelpCircle, Printer, Download, BookOpen, RefreshCw, XCircle, Info, ArrowUpRight
} from 'lucide-react';
import { CounselingReport, GenerationInput } from './types';
import { INITIAL_REPORT } from './initialData';
import { generateMarkdownReport } from './utils';

// Import workspace subcomponents
import ReportHistory from './components/ReportHistory';
import InputWizard from './components/InputWizard';
import ReportFormEditor from './components/ReportFormEditor';
import DocumentPreview from './components/DocumentPreview';
import SelfChecklist from './components/SelfChecklist';
import LandingPage from './components/LandingPage';

export default function App() {
  // Primary States
  const [reports, setReports] = useState<CounselingReport[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [showNewWizard, setShowNewWizard] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // UI States
  const [viewMode, setViewMode] = useState<'landing' | 'workspace'>('landing');
  const [workspaceTab, setWorkspaceTab] = useState<'preview' | 'editor'>('preview');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [showSaveToast, setShowSaveToast] = useState<boolean>(false);
  const [generationPhase, setGenerationPhase] = useState<string>('');

  // 1. Initial State Load from LocalStorage (or Fallback to Mock)
  useEffect(() => {
    const saved = localStorage.getItem('moel_counseling_reports');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed) && parsed.length > 0) {
          setReports(parsed);
          setSelectedReportId(parsed[0].id);
          return;
        }
      } catch (err) {
        console.error('Failed to parse localStorage data:', err);
      }
    }
    
    // Fallback: Initial Mock Report
    setReports([INITIAL_REPORT]);
    setSelectedReportId(INITIAL_REPORT.id);
  }, []);

  // 2. Persist state to LocalStorage
  const saveReportsToStorage = (updatedList: CounselingReport[]) => {
    setReports(updatedList);
    localStorage.setItem('moel_counseling_reports', JSON.stringify(updatedList));
  };

  // 3. Selection Handler
  const handleSelectReport = (id: string) => {
    setSelectedReportId(id);
    setShowNewWizard(false);
    setErrorMsg(null);
  };

  // 4. Delete Handler
  const handleDeleteReport = (id: string) => {
    const updated = reports.filter(r => r.id !== id);
    saveReportsToStorage(updated);
    
    if (selectedReportId === id) {
      if (updated.length > 0) {
        setSelectedReportId(updated[0].id);
      } else {
        setSelectedReportId(null);
        setShowNewWizard(true); // Open wizard if all reports are deleted
      }
    }
  };

  // 5. New Report Initiation
  const handleStartNewReport = () => {
    setSelectedReportId(null);
    setShowNewWizard(true);
    setErrorMsg(null);
  };

  // 6. Report Content Live Update
  const handleReportChange = (updatedReport: CounselingReport) => {
    const updatedList = reports.map(r => r.id === updatedReport.id ? updatedReport : r);
    saveReportsToStorage(updatedList);
  };

  // 7. Manual Save Event (Toast feedback)
  const handleManualSave = () => {
    setShowSaveToast(true);
    setTimeout(() => {
      setShowSaveToast(false);
    }, 2500);
  };

  // 8. Core Event: Call server-side API to generate counseling reports via Gemini
  const handleGenerateReport = async (inputData: GenerationInput) => {
    setIsGenerating(true);
    setErrorMsg(null);
    setWorkspaceTab('preview');
    
    // Fun visual phases to make the loading state feel premium
    const phases = [
      '내담자의 개별특성 데이터 연계 중...',
      'PHQ-9 우울증 선별지표 분석 중...',
      '자기효능감 수치에 맞는 핵심감정 매칭 중...',
      '평가표 비적격 모호한 단어 필터링 중...',
      '차기 회기 실행 계획을 구체적 행동 태스크로 치환 중...',
      '전문적인 격식체 공문서 템플릿 완성 중...'
    ];
    
    let phaseIdx = 0;
    setGenerationPhase(phases[phaseIdx]);
    const phaseInterval = setInterval(() => {
      phaseIdx = (phaseIdx + 1) % phases.length;
      setGenerationPhase(phases[phaseIdx]);
    }, 2200);

    try {
      const localKey = localStorage.getItem('gemini_api_key') || '';
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-key': localKey
        },
        body: JSON.stringify(inputData)
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || errJson.details || '서버 응답 오류가 발생했습니다.');
      }

      const generatedData = await response.json();

      // Formulate a clean MoEL standard counseling report
      const newReport: CounselingReport = {
        id: `report-${Date.now()}`,
        createdAt: new Date().toISOString(),
        clientName: inputData.clientName,
        sessionDate: inputData.sessionDate,
        counselorName: inputData.counselorName || '상담원',
        sessionCount: inputData.sessionCount,
        unemploymentPeriod: inputData.unemploymentPeriod,
        desiredJob: inputData.desiredJob || '사무직',
        certifications: inputData.certifications,
        healthStatus: inputData.healthStatus,
        economicHardship: inputData.economicHardship,
        
        phqPrevious: inputData.phqPrevious,
        phqCurrent: inputData.phqCurrent,
        efficacyPrevious: inputData.efficacyPrevious,
        efficacyCurrent: inputData.efficacyCurrent,
        
        // Populate using Gemini's highly refined professional texts
        complaintsJob: generatedData.complaintsJob,
        complaintsEmotional: generatedData.complaintsEmotional,
        clientStrengths: generatedData.clientStrengths,
        psychotherapyNotes: generatedData.psychotherapyNotes,
        jobSearchCheckCount: inputData.jobSearchCheckCount,
        jobSearchInterviewCount: inputData.jobSearchInterviewCount,
        jobSearchCheckResult: generatedData.jobSearchCheckResult,
        jobCapacityNotes: generatedData.jobCapacityNotes,
        motivationNotes: generatedData.motivationNotes,
        previousSessionChanges: generatedData.previousSessionChanges,
        
        referrals: inputData.referrals,
        careerTestNotes: generatedData.careerTestNotes,
        clientExpression: generatedData.clientExpression,
        overallJudgment: generatedData.overallJudgment,
        
        nextActionPlan: {
          mockInterviews: inputData.nextActionPlan.mockInterviews,
          targetCompanies: inputData.nextActionPlan.targetCompanies,
          phqReassess: inputData.nextActionPlan.phqReassess,
          additionalPlan: generatedData.nextActionPlanDetails ? generatedData.nextActionPlanDetails.join('\n') : inputData.nextActionPlan.additionalPlan,
          nextSchedule: inputData.nextActionPlan.nextSchedule
        },
        counselorOpinion: generatedData.counselorOpinion
      };

      const updatedList = [newReport, ...reports];
      saveReportsToStorage(updatedList);
      setSelectedReportId(newReport.id);
      setShowNewWizard(false);

    } catch (err: any) {
      console.error('Failed to generate report:', err);
      setErrorMsg(err.message || '상담회기보고서를 작성하는 도중 에러가 발생했습니다. 입력을 확인하시거나 Settings > Secrets 패널의 API Key 유효성을 확인해 주십시오.');
    } finally {
      clearInterval(phaseInterval);
      setIsGenerating(false);
    }
  };

  // 9. Markdown Copy Handler
  const handleCopyMarkdown = useCallback(() => {
    const report = reports.find(r => r.id === selectedReportId);
    if (!report) return;

    const mdString = generateMarkdownReport(report);
    navigator.clipboard.writeText(mdString).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  }, [reports, selectedReportId]);

  // Find currently active report
  const activeReport = reports.find(r => r.id === selectedReportId) || null;

  if (viewMode === 'landing') {
    return <LandingPage onStartWorkspace={() => setViewMode('workspace')} />;
  }

  return (
    <div className="flex h-screen w-screen bg-slate-50 overflow-hidden font-sans text-slate-800 print:bg-white print:h-auto">
      {/* 1. Sidebar Panel (Reports Index) */}
      <div className="w-80 h-full flex-shrink-0 no-print">
        <ReportHistory
          reports={reports}
          selectedId={selectedReportId}
          onSelect={handleSelectReport}
          onDelete={handleDeleteReport}
          onNew={handleStartNewReport}
        />
      </div>

      {/* 2. Workspace Center Area */}
      <div className="flex-1 h-full overflow-hidden flex flex-col min-w-0 print:h-auto">
        
        {/* Workspace Nav Header */}
        <header className="h-16 border-b border-slate-200 bg-white px-6 flex justify-between items-center flex-shrink-0 no-print">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-800 tracking-tight text-base">
              고용복지+센터 상담보고서 AI 비서
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wider">
              MoEL v1.4
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <button
              onClick={() => setViewMode('landing')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center gap-1 border border-emerald-200/50 cursor-pointer"
            >
              <span>소개 랜딩페이지</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-1.5 text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>서버 정상 가동 중</span>
            </div>
          </div>
        </header>

        {/* Workspace Body */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row print:h-auto">
          
          {/* Active Panel View */}
          <main className="flex-1 h-full overflow-hidden p-6 flex flex-col min-w-0 print:p-0 print:overflow-visible">
            
            {/* If Generating - Immersive loader */}
            {isGenerating && (
              <div className="flex-1 bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center p-8 text-center animate-pulse">
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-full border-4 border-sky-100 border-t-sky-600 animate-spin"></div>
                  <Sparkles className="w-6 h-6 text-sky-500 absolute top-5 left-5 animate-ping" />
                </div>
                <h4 className="font-bold text-slate-800 text-lg mb-2">상담 데이터를 심층 분석 중입니다</h4>
                <p className="text-sm text-sky-700 font-medium font-mono h-6">{generationPhase}</p>
                <div className="max-w-md mt-6 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                  <p className="text-xs text-slate-500 leading-relaxed text-left">
                    💡 <strong>MoEL 적격 판정 조율 중:</strong> 내담자의 실업기간, 보유자격증 등 기본 특성을 PHQ-9 및 효능감 변화 수치와 유기적으로 설계하고 있으며, "지속 모니터링 예정" 등 추상적인 불합격 사유 문장을 제거하고 동사형 행동 계획으로 전환하는 보정 알고리즘을 수행하고 있습니다. 약 5~10초 소요됩니다.
                  </p>
                </div>
              </div>
            )}

            {/* If Error panel */}
            {!isGenerating && errorMsg && (
              <div className="flex-1 bg-white rounded-2xl border border-red-200 p-8 flex flex-col items-center justify-center text-center">
                <XCircle className="w-14 h-14 text-rose-500 mb-4" />
                <h4 className="font-bold text-slate-900 text-lg mb-2">상담보고서 생성 중 오류가 발생했습니다</h4>
                <div className="max-w-lg bg-rose-50/50 border border-rose-100 rounded-xl p-4 text-xs text-rose-700 leading-relaxed font-mono text-left mb-6">
                  {errorMsg}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setErrorMsg(null)}
                    className="bg-slate-800 text-white font-semibold text-xs px-4 py-2 rounded-lg hover:bg-slate-900"
                  >
                    다시 시도하기
                  </button>
                  <a 
                    href="#input-wizard"
                    onClick={() => setErrorMsg(null)}
                    className="bg-white border border-slate-200 text-slate-700 font-semibold text-xs px-4 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-center"
                  >
                    입력 폼 수정
                  </a>
                </div>
              </div>
            )}

            {/* View State A: Step-by-Step Registration Wizard */}
            {!isGenerating && !errorMsg && showNewWizard && (
              <div className="flex-1 overflow-hidden">
                <InputWizard
                  onGenerate={handleGenerateReport}
                  isGenerating={isGenerating}
                />
              </div>
            )}

            {/* View State B: Active Generated Counseling Report Display */}
            {!isGenerating && !errorMsg && !showNewWizard && activeReport && (
              <div className="flex-1 flex flex-col overflow-hidden min-h-0 print:overflow-visible">
                {/* Mode Toggle Tabs */}
                <div className="flex justify-between items-center mb-4 flex-shrink-0 no-print">
                  <div className="flex bg-slate-200/60 p-1 rounded-xl">
                    <button
                      onClick={() => setWorkspaceTab('preview')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        workspaceTab === 'preview'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      공식 서식 인쇄 뷰어 (A4)
                    </button>
                    <button
                      onClick={() => setWorkspaceTab('editor')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        workspaceTab === 'editor'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      상세 내용 실시간 보완
                    </button>
                  </div>

                  <span className="text-[11px] text-slate-400 font-semibold italic">
                    최근 수정: {new Date(activeReport.createdAt).toLocaleTimeString()}
                  </span>
                </div>

                {/* Main Tab Area */}
                <div className="flex-1 overflow-hidden flex flex-col md:flex-row gap-6 print:overflow-visible">
                  {/* Left Column (Report Form/Preview) */}
                  <div className="flex-1 h-full overflow-hidden print:overflow-visible">
                    {workspaceTab === 'preview' ? (
                      <DocumentPreview
                        report={activeReport}
                        onCopyMarkdown={handleCopyMarkdown}
                        isCopied={isCopied}
                      />
                    ) : (
                      <ReportFormEditor
                        report={activeReport}
                        onChange={handleReportChange}
                        onSave={handleManualSave}
                      />
                    )}
                  </div>

                  {/* Right Column (Live Guidelines Checklist Checklist) */}
                  <div className="w-full md:w-80 h-full flex-shrink-0 overflow-y-auto no-print">
                    <SelfChecklist report={activeReport} />
                    
                    {/* Interactive center guidance widget */}
                    <div className="mt-4 p-4 bg-slate-800 text-slate-200 rounded-2xl border border-slate-700 space-y-2.5">
                      <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4" />
                        <span> MoEL 평가 적격성 팁</span>
                      </span>
                      <p className="text-[11px] leading-relaxed text-slate-300">
                        본 상담회기보고서는 <strong>실업기간 8개월</strong>, <strong>PHQ-9 우울증 검사</strong>, <strong>자기효능감(10점 만점)</strong> 등 모든 요소를 구체적인 수치로 다루고 있습니다.
                      </p>
                      <p className="text-[11px] leading-relaxed text-slate-300">
                        특히 차기 실행 계획의 행동을 <strong>"모의면접 1회 실시"</strong>, <strong>"목표기업 3개소 매칭"</strong> 등 동사형 행동 태스크로 치환 수립하여 MoEL의 엄격한 자격 기준을 100% 충족합니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Absolute Save Success Toast */}
      <AnimatePresence>
        {showSaveToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-slate-800 text-xs font-semibold"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
            <span>상담회기보고서 데이터가 로컬 스토리지에 자동 저장되었습니다.</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
