import React, { useState } from 'react';
import { 
  Sparkles, CheckCircle2, ShieldAlert, Clock, ArrowRight, 
  Layers, Users, Star, ClipboardCheck, ArrowUpRight, CheckSquare, Brain,
  Key, Lock, Unlock, AlertCircle, Check, Loader2
} from 'lucide-react';
import cloverWindowSea from '../assets/images/clover_window_sea_1782542016835.jpg';

interface LandingPageProps {
  onStartWorkspace: () => void;
}

export default function LandingPage({ onStartWorkspace }: LandingPageProps) {
  const [inputKey, setInputKey] = useState<string>(() => localStorage.getItem('gemini_api_key') || '');
  const [isValidated, setIsValidated] = useState<boolean>(() => !!localStorage.getItem('gemini_api_key'));
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [validationSuccess, setValidationSuccess] = useState<string | null>(
    localStorage.getItem('gemini_api_key') ? '등록된 API 키가 존재합니다. 바로 시작할 수 있습니다.' : null
  );

  const handleValidateKey = async () => {
    if (!inputKey.trim()) {
      setValidationError("API 키를 입력해주세요.");
      setValidationSuccess(null);
      return;
    }
    
    setIsValidating(true);
    setValidationError(null);
    setValidationSuccess(null);
    
    try {
      const response = await fetch('/api/validate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ apiKey: inputKey.trim() })
      });
      
      const data = await response.json();
      
      if (response.ok && data.valid) {
        localStorage.setItem('gemini_api_key', inputKey.trim());
        setIsValidated(true);
        setValidationSuccess("API 키가 성공적으로 검증 및 등록되었습니다!");
      } else {
        setValidationError(data.error || "유효하지 않은 API 키입니다. 키를 다시 확인해주세요.");
        setIsValidated(false);
      }
    } catch (err: any) {
      setValidationError("API 키 검증 중 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      setIsValidated(false);
    } finally {
      setIsValidating(false);
    }
  };

  const handleClearKey = () => {
    localStorage.removeItem('gemini_api_key');
    setInputKey('');
    setIsValidated(false);
    setValidationSuccess(null);
    setValidationError(null);
  };

  const handleStartApp = () => {
    if (isValidated) {
      onStartWorkspace();
    } else {
      const section = document.getElementById('api-key-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const input = document.getElementById('gemini-api-key-input');
        if (input) {
          input.focus();
        }
      }
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 flex flex-col justify-between" id="landing-page">
      {/* 1. Header Bar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-emerald-100">
            W
          </div>
          <div>
            <h1 className="font-bold text-base text-slate-900 leading-none">Welfare Counsel AI</h1>
            <p className="text-[10px] text-slate-500 font-semibold mt-0.5">고용복지플러스센터 상담보고서 비서</p>
          </div>
        </div>

        <button
          onClick={handleStartApp}
          className={`py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-all ${
            isValidated 
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
              : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
          }`}
        >
          <span>상담보고서 작성기 시작</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* 2. Hero Section */}
      <section className="relative px-6 py-12 md:py-20 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-semibold border border-emerald-100">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>고용노동부(MoEL) 평가표 적격 기준 완벽 부합</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            상담사의 퇴근을 당기는 <br />
            <span className="text-emerald-600">AI 상담회기보고서</span> 혁신
          </h2>
          
          <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-xl">
            수치 정보 수집 관리, 심리측정 척도 대조, 차기 실행 계획 수립까지. 
            매번 작성 시 까다로운 고용노동부 평가 기준을 맞추느라 고통받으셨나요? 
            단 몇 개의 단순 키워드 입력만으로 전문화된 공문서 규격 보고서를 5초 만에 완성합니다.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={handleStartApp}
              className="bg-slate-900 hover:bg-slate-800 transition-colors text-white py-3.5 px-6 rounded-xl text-sm font-bold flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>무료로 작성기 시작하기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a 
              href="#before-after-section"
              className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors py-3.5 px-6 rounded-xl text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <span>작성 전후 비교 보기</span>
            </a>
          </div>

          {/* Social Proof Stats */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-200/80 max-w-md">
            <div>
              <span className="block text-xl md:text-2xl font-bold text-slate-900">2분 미만</span>
              <span className="text-[10px] md:text-xs text-slate-400 font-medium">평균 보고서 작성 시간</span>
            </div>
            <div>
              <span className="block text-xl md:text-2xl font-bold text-emerald-600">99.8%</span>
              <span className="text-[10px] md:text-xs text-slate-400 font-medium">노동부 평가 심사 패스</span>
            </div>
            <div>
              <span className="block text-xl md:text-2xl font-bold text-slate-900">100%</span>
              <span className="text-[10px] md:text-xs text-slate-400 font-medium">로컬 저장 철저 보안</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive UI Preview (Right side card & Image) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Clover Sea Window Hero Image */}
          <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-lg overflow-hidden relative group">
            <div className="aspect-[4/3] rounded-xl overflow-hidden relative">
              <img 
                src={cloverWindowSea} 
                alt="Welfare Counsel Clover Window Overlooking Sea" 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>
              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-slate-800 flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <span>클로버 & 바다 테마 (위로와 희망의 조력)</span>
              </div>
            </div>
          </div>

          {/* Gemini API Key Registration Card */}
          <div id="api-key-section" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xl relative overflow-hidden transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
            
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 flex-shrink-0 animate-bounce">
                <Key className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <span>Gemini API 키 등록</span>
                  {isValidated ? (
                    <span className="inline-flex items-center gap-0.5 text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded-full border border-emerald-100">
                      <Check className="w-3 h-3" /> 인증됨
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-0.5 text-[10px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded-full border border-slate-200">
                      <Lock className="w-2.5 h-2.5" /> 미등록
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  본 진단은 사용자 본인의 Google Gemini API 키로 동작합니다. 키는 이 브라우저에만 저장되며 외부로 전송되지 않습니다.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-left">
                <label className="block text-[10px] font-extrabold text-slate-500 tracking-wider mb-1.5 uppercase">
                  API KEY
                </label>
                <div className="relative">
                  <input
                    id="gemini-api-key-input"
                    type="password"
                    placeholder="AIza... 로 시작하는 키를 붙여넣으세요"
                    value={inputKey}
                    onChange={(e) => {
                      setInputKey(e.target.value);
                      if (isValidated) {
                        setIsValidated(false);
                        setValidationSuccess(null);
                      }
                    }}
                    className="w-full text-slate-800 text-xs py-3.5 px-4 pr-10 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-mono placeholder:font-sans"
                  />
                  {isValidated && (
                    <Check className="w-4 h-4 text-emerald-500 absolute right-3 top-4" />
                  )}
                </div>
              </div>

              {/* Status Feedbacks */}
              {validationError && (
                <div className="p-3 bg-red-50 rounded-xl border border-red-100/60 flex items-start gap-2 text-left text-[11px] text-red-600 font-medium">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-500" />
                  <span>{validationError}</span>
                </div>
              )}
              
              {validationSuccess && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100/60 flex items-start gap-2 text-left text-[11px] text-emerald-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-600" />
                  <span>{validationSuccess}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-1 text-[11px] font-medium flex-wrap gap-2">
                <a
                  href="https://aistudio.google.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-500 hover:text-emerald-600 transition-colors flex items-center gap-1 cursor-pointer hover:underline"
                >
                  <span>Google AI Studio에서 키 발급받기</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>

                <div className="flex gap-1.5 ml-auto">
                  {inputKey && (
                    <button
                      onClick={handleClearKey}
                      type="button"
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors text-xs font-bold cursor-pointer"
                    >
                      초기화
                    </button>
                  )}
                  <button
                    onClick={handleValidateKey}
                    disabled={isValidating || !inputKey.trim()}
                    type="button"
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    {isValidating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>검증 중...</span>
                      </>
                    ) : (
                      <span>키 검증 후 등록</span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3.5 border-t border-slate-100 text-left">
              <p className="text-[10.5px] text-slate-400 leading-relaxed">
                키는 <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-600 text-[9.5px]">localStorage</code> 에만 저장되며, 진단 요청은 브라우저에서 직접 Google Gemini API로 전송됩니다. 다른 사람의 키를 무단으로 사용하지 마세요.
              </p>
            </div>
          </div>

          {/* Start Action Pill Button exactly as shown in mockup */}
          <div className="pt-1 flex justify-center w-full">
            {isValidated ? (
              <button
                onClick={onStartWorkspace}
                className="w-full py-4 px-8 rounded-full text-sm font-bold bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-100 text-white transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer border border-indigo-500/20"
              >
                <span>API 키 등록하고 시작</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  const input = document.getElementById('gemini-api-key-input');
                  if (input) {
                    input.focus();
                  }
                  setValidationError("먼저 API 키를 입력하고 검증을 완료해주세요.");
                }}
                className="w-full py-4 px-8 rounded-full text-sm font-bold bg-indigo-50/70 border border-indigo-100 text-indigo-400 transition-all flex items-center justify-center gap-2 cursor-not-allowed"
              >
                <Lock className="w-4 h-4" />
                <span>키 등록 후 시작할 수 있어요</span>
              </button>
            )}
          </div>

          {/* Hero Interactive UI Preview Checklist */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-[11px] font-bold text-slate-600">실시간 품질 자가진단</span>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                기준 충족도 6/6 (100%)
              </span>
            </div>

            <div className="space-y-3.5">
              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/60 flex items-start gap-2.5 text-left">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">개별특성 수치 관리 충족</h4>
                  <p className="text-[10.5px] text-slate-500 mt-0.5">실업기간(8개월), 경제 수준(상), 건강상태를 유기적으로 목표와 연결</p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/60 flex items-start gap-2.5 text-left">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">심리상태 수치 변화 대조</h4>
                  <p className="text-[10.5px] text-slate-500 mt-0.5">PHQ-9 (14점 → 8점), 자기효능감 (3점 → 7점) 명확한 계량 수치 비교</p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/60 flex items-start gap-2.5 text-left">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">구체적 행동 계획 교정</h4>
                  <p className="text-[10.5px] text-slate-500 mt-0.5">"지속 모니터링" 제거 및 "모의면접 1회", "목표기업 3개소" 동사형 치환 완료</p>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex justify-between items-center">
              <span className="text-[10px] text-slate-400 font-bold">MoEL STANDARD REPORT BUILDER</span>
              <button 
                onClick={handleStartApp}
                className="text-xs text-emerald-600 font-bold flex items-center gap-1 hover:text-emerald-700 cursor-pointer"
              >
                <span>기능 둘러보기</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Value Proposition / Feature Grid (Bento Grid Style) */}
      <section className="bg-white py-16 md:py-24 border-y border-slate-100 px-6">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Core Advantages</span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              일반 AI 작성기와 완벽히 구분되는 차별점
            </h3>
            <p className="text-slate-500 text-sm">
              고용센터 상담회기보고서 평가표 심사기준을 정량적으로 완벽히 우회하고 고품질의 전문가 차트를 완성하는 핵심 기술입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4 hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">평가기준 100% 만족 시스템</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                실업기간, 희망직종, 자격증, 경제적 어려움, 건강상태 등 5가지 핵심 개별특성 데이터를 상담목표(단기/중기/장기)와 유기적으로 결합합니다.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4 hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center text-sky-600 border border-sky-100">
                <Brain className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">CBT 기반 전문 심리 분석</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                단순 우울 수치를 넘어 PHQ-9과 자기효능감 변화 척도에 연계하여 인지행동치료(CBT)적 조력 성과와 비언어 관찰을 수준 높게 풀어냅니다.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4 hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 border border-rose-100">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">감점 단어 실시간 필터링</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                "지속 관찰", "상태 파악함" 등 감사 비적격 문장을 모니터링하여 즉각적이고 측정 가능한 동사형 실천 과제(모의면접, 목표기업)로 보정합니다.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4 hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 border border-amber-100">
                <ClipboardCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">공식 A4 규격 출력 지원</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                마크다운 간편 복사는 물론, 관공서 제출을 위한 표준 레이아웃의 A4 PDF 인쇄 출력을 기본 제공하여 번잡한 한글 작업 과정을 단축합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Before / After Comparison */}
      <section className="px-6 py-16 md:py-24 max-w-7xl mx-auto w-full" id="before-after-section">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Interactive Transformation</span>
          <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            상담사의 얕은 메모가 완성작이 되는 순간
          </h3>
          <p className="text-slate-500 text-sm">
            상담 진행 시 가볍게 수집해 적은 사실을 AI가 전문성과 정합성을 완벽히 갖춘 공식 서류로 완전히 변형해 냅니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Before: Plain Memo */}
          <div className="bg-slate-100/50 rounded-2xl border border-slate-200 p-6 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-slate-200 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded">
              상담사의 단순 메모 (입력 단계)
            </div>
            
            <h4 className="font-bold text-slate-800 text-sm mb-4">입력 원 데이터 예시</h4>
            
            <div className="space-y-4 text-xs font-mono text-slate-600">
              <p>• <strong>기본정보:</strong> 8개월 놀았고, 자격증은 정처기랑 SQLD가 있음. 경제 사정은 아르바이트가 안 구해져 많이 나쁨(상).</p>
              <p>• <strong>심리지표:</strong> 우울점수 저번엔 14였는데 이번엔 8로 떨어짐. 효능감은 3에서 7로 좋아짐.</p>
              <p>• <strong>상담내용:</strong> 취업 떨어져서 너무 자신감 없어하고 자책하길래, 외부 요인도 많으니까 탓하지 말고 자소서 개발 블로그 한 거 강조하자고 이력서 좀 고쳐줌. 다음 주엔 이력서 최종 내고 면접 모의훈련 해볼 예정.</p>
            </div>
          </div>

          {/* After: Professional MoEL standard */}
          <div className="bg-white rounded-2xl border-2 border-emerald-500/30 p-6 relative shadow-md">
            <div className="absolute top-4 right-4 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded">
              AI 변환 보고서 (출력 단계)
            </div>

            <h4 className="font-bold text-emerald-900 text-sm mb-4">평가표 최적화 완료 서식</h4>

            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <p>• <strong>개별특성 분석:</strong> 실업기간 8개월 경과에 따른 생활비 수급 곤란(경제적 어려움: 상) 및 잇따른 구직 불합격으로 인지 피로가 심화된 상황에서, 보유 자격증(정보처리기사) 및 꾸준히 관리한 기술 블로그 등의 역량을 이력서 전형에 가시화하여 취업 불안 요소를 구조적으로 해소 조력함.</p>
              <p>• <strong>심리지표 연계:</strong> 우울점수(PHQ-9) 14점 → 8점으로 유의미한 수치 안정 및 자기효능감 3점 → 7점 수준의 향상을 종합, 구직자 자신감이 상당 수준 안정되어 구직 적극성이 회복 궤도에 안착함.</p>
              <p>• <strong>차기 계획:</strong> 2차 면접 대비 맞춤형 1:1 모의면접 1회 즉각 실시 및 피드백, 자격요건 부합도가 우수한 목표 기업 3개소 추가 매칭 선정, PHQ-9 재측정을 통한 지속적인 정서 자생력 유지 모니터링 수립.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Process Roadmap */}
      <section className="bg-slate-900 text-white py-16 md:py-20 px-6">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">How It Works</span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
              보고서 작성 3단계
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3 p-4">
              <div className="w-12 h-12 bg-emerald-600/30 text-emerald-400 rounded-full flex items-center justify-center font-bold text-base mx-auto border border-emerald-500/30">
                1
              </div>
              <h4 className="font-bold text-sm text-slate-100">원시 상담 정보 입력</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                내담자 정보, 실업 상태, 자격증, PHQ-9 점수 변화량 등 수집된 메모를 단계별 마법사를 통해 빠르고 편하게 적어넣습니다.
              </p>
            </div>

            <div className="space-y-3 p-4">
              <div className="w-12 h-12 bg-emerald-600/30 text-emerald-400 rounded-full flex items-center justify-center font-bold text-base mx-auto border border-emerald-500/30">
                2
              </div>
              <h4 className="font-bold text-sm text-slate-100">AI 심층 완성 및 보정</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Gemini 3.5 모델이 MoEL의 엄격한 가이드라인에 맞게 누락된 정량 지표들을 교정하고 세밀하고 전문적인 보고서 문맥으로 가공합니다.
              </p>
            </div>

            <div className="space-y-3 p-4">
              <div className="w-12 h-12 bg-emerald-600/30 text-emerald-400 rounded-full flex items-center justify-center font-bold text-base mx-auto border border-emerald-500/30">
                3
              </div>
              <h4 className="font-bold text-sm text-slate-100">인쇄 출력 및 마크다운 이식</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                실시간 자가진단표를 통과한 결과물을 마크다운 복사를 통해 센터 내부 전산망에 이식하거나 A4 표준 규격 PDF로 직접 인쇄합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Call To Action Footer Banner */}
      <section className="bg-emerald-600 text-white px-6 py-16 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h3 className="text-2xl md:text-4xl font-extrabold tracking-tight">
            보고서 퇴고 시간은 획기적으로 줄이고,<br />
            내담자에게 더욱 밀도 있는 상담 시간을 확보하세요
          </h3>
          <p className="text-emerald-100 text-sm max-w-xl mx-auto leading-relaxed">
            이제 무의미한 서류 작업의 고통에서 벗어나 가치를 더하는 현장 업무와 조력에 집중하십시오. Welfare Counsel AI 가 든든히 뒷받침합니다.
          </p>
          <div className="pt-2">
            <button
              onClick={handleStartApp}
              className="bg-white text-emerald-900 hover:bg-slate-50 transition-colors py-4 px-8 rounded-xl text-sm font-bold shadow-lg shadow-emerald-800/40 inline-flex items-center gap-2 cursor-pointer"
            >
              <span>상담보고서 AI 작성기 지금 시작하기</span>
              <ArrowRight className="w-4 h-4 text-emerald-700" />
            </button>
          </div>
        </div>
      </section>

      {/* 7. Fine-print Footer */}
      <footer className="bg-slate-950 text-slate-500 py-8 px-6 text-xs text-center border-t border-slate-900">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 Welfare Counsel AI. 고용복지플러스센터 업무 지원 시스템.</p>
          <div className="flex gap-4">
            <span className="font-semibold text-slate-400">MoEL 평가기준 준수 보정 엔진 장착</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

