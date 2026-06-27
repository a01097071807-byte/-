import React, { useState } from 'react';
import { 
  User, Calendar, Clock, Award, Activity, AlertTriangle, 
  ChevronRight, ChevronLeft, BrainCircuit, Sparkles, RefreshCw, FileText
} from 'lucide-react';
import { GenerationInput, EconomicHardshipLevel } from '../types';
import { AVAILABLE_REFERRALS } from '../initialData';

interface InputWizardProps {
  onGenerate: (data: GenerationInput) => void;
  isGenerating: boolean;
}

export default function InputWizard({ onGenerate, isGenerating }: InputWizardProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<GenerationInput>({
    sessionDate: new Date().toISOString().split('T')[0],
    counselorName: '',
    clientName: '',
    sessionCount: 1,
    unemploymentPeriod: 3,
    desiredJob: '',
    certifications: '',
    healthStatus: '특이사항 없음 (정상 상태)',
    economicHardship: '중',
    
    phqPrevious: 10,
    phqCurrent: 8,
    efficacyPrevious: 5,
    efficacyCurrent: 6,
    
    complaintsJob: '',
    complaintsEmotional: '',
    clientStrengths: '',
    
    psychotherapyNotes: '',
    jobSearchCheckCount: 0,
    jobSearchInterviewCount: 0,
    jobSearchCheckResult: '구직 서류 접수 후 결과 대기 중임',
    jobCapacityNotes: '',
    motivationNotes: '',
    previousSessionChanges: '',
    
    referrals: [],
    careerTestNotes: '',
    clientExpression: '',
    overallJudgment: '',
    
    nextActionPlan: {
      mockInterviews: 1,
      targetCompanies: 3,
      phqReassess: true,
      additionalPlan: '',
      nextSchedule: ''
    },
    counselorOpinion: ''
  });

  const updateField = (key: keyof GenerationInput, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updatePlanField = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      nextActionPlan: {
        ...prev.nextActionPlan,
        [key]: value
      }
    }));
  };

  const toggleReferral = (item: string) => {
    setFormData(prev => {
      const referrals = prev.referrals.includes(item)
        ? prev.referrals.filter(r => r !== item)
        : [...prev.referrals, item];
      return { ...prev, referrals };
    });
  };

  // Quick fill demo draft for the user to try the app immediately
  const fillSampleDraft = () => {
    setFormData({
      sessionDate: new Date().toISOString().split('T')[0],
      counselorName: '박하은',
      clientName: '홍길동',
      sessionCount: 3,
      unemploymentPeriod: 5,
      desiredJob: '사무행정원 및 회계사무원',
      certifications: '컴퓨터활용능력 2급, 전산회계 1급',
      healthStatus: '가벼운 거북목 증후군 외 정밀 신체 활동 지장 없음',
      economicHardship: '상',
      
      phqPrevious: 15,
      phqCurrent: 10,
      efficacyPrevious: 4,
      efficacyCurrent: 6,
      
      complaintsJob: '서류 심사에서 몇 차례 불합격 통보를 받은 뒤 이력서 작성에 극심한 불안감을 보이며 자신감을 잃음. 적합한 일자리가 없을 것 같다는 불안감을 지속 호소함.',
      complaintsEmotional: '지속적인 불합격 경험으로 인한 스트레스성 불면증 및 불안 상태가 인지됨. 외부 활동을 줄이고 방 안에만 머물며 자존감이 낮아짐.',
      clientStrengths: '전산회계 및 컴퓨터 자격증을 성실히 준비하여 기술 기초 능력을 갖춤. 이전 직장 2년 근속 경험으로 비즈니스 매너 우수함.',
      
      psychotherapyNotes: '우울감 극복을 위해 자신의 성과와 과거 근속 노하우를 명확히 객관화하도록 도움. 구직 실패에 과도한 감정 몰입을 경계하고 인지적 탈융합(Defusion) 기법 적용.',
      jobSearchCheckCount: 3,
      jobSearchInterviewCount: 0,
      jobSearchCheckResult: '지난주 기업 3개처 지원했으나 모두 서류 단계 불합격 통보받음.',
      jobCapacityNotes: '이력서의 직무 성과와 소통 능력을 강조할 수 있도록 자기소개서 내용 재작성 코칭함. 행정 업무 특화 강점을 가시화함.',
      motivationNotes: '성취한 자격증 목록과 2년 실무 경력을 직접 작성하며 자기 격려를 실행하도록 하고, 가벼운 아침 산책 실천 과제를 유도함.',
      previousSessionChanges: '이전 과제였던 구직 사이트 프로필 갱신 완료함. 일상생활 리듬이 미세하게 복원되어 수면 질이 나아졌다고 함.',
      
      referrals: ['국민취업지원제도', '심리안정지원프로그램'],
      careerTestNotes: '직업선호도검사 S형 결과와 매칭 분석 진행하여 꼼꼼한 사무 관리 능력을 강점으로 도출함.',
      clientExpression: '상담 초반 시선을 아래로 향했으나, 경력 가시화 작업 후 상담자와의 눈 맞춤이 늘어나고 어조가 점차 힘 있게 변화함.',
      overallJudgment: '중등도 우울에서 경계선 우울 수준으로 심리상태 점차 개선 중이며, 취업 역량 강화를 위한 구체적인 이력서 서술 보강 후 구직 자신감 상승 여부 관찰 필요.',
      
      nextActionPlan: {
        mockInterviews: 1,
        targetCompanies: 4,
        phqReassess: true,
        additionalPlan: '1. 맞춤형 자기소개서 완성본 제출\n2. 지원 가능한 사무직 구인공고 4개처 탐색 및 공유\n3. 이력서 서류 제출 실천하기',
        nextSchedule: '2026-07-01 10:00'
      },
      counselorOpinion: '실업 5개월로 자금 압박과 거듭된 불합격에 따른 심적 우울감이 높았던 내담자임. 3회기 이력서 완성도 제고와 강점 강화 기법으로 심리 수치(PHQ 15점->10점)가 개선되고, 구직 행동력이 점차 증가함. 차기에는 행정 직무 4개 타겟 처를 추려 입사지원을 밀착 서포트하겠음.'
    });
    setCurrentStep(1);
  };

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName) {
      alert('내담자명을 입력해 주세요.');
      setCurrentStep(1);
      return;
    }
    onGenerate(formData);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full" id="input-wizard">
      {/* Wizard Header */}
      <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex flex-wrap justify-between items-center gap-3">
        <div>
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-sky-600" />
            <span>신규 상담 기초 정보 등록</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            원시 정보와 간단한 메모를 입력하시면 AI가 평가 기준에 맞춰 전문가 수준으로 작성합니다.
          </p>
        </div>
        
        <button
          type="button"
          onClick={fillSampleDraft}
          className="text-xs bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 border border-sky-100 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>샘플 임시안 채우기</span>
        </button>
      </div>

      {/* Step Indicators */}
      <div className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between">
        {[1, 2, 3, 4, 5].map((step) => (
          <button
            key={step}
            onClick={() => setCurrentStep(step)}
            className={`flex items-center gap-2 text-sm font-medium transition-all ${
              currentStep === step 
                ? 'text-sky-600 font-bold border-b-2 border-sky-600 pb-1.5' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
              currentStep === step ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              {step}
            </span>
            <span className="hidden md:inline">
              {step === 1 && '기본 정보'}
              {step === 2 && '심리 지표'}
              {step === 3 && '호소문제·강점'}
              {step === 4 && '상담 내용'}
              {step === 5 && '연계 및 계획'}
            </span>
          </button>
        ))}
      </div>

      {/* Wizard Forms */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col justify-between">
        <div className="space-y-6 flex-1">
          {/* STEP 1: 기본 정보 및 개별 특성 */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" /> 내담자명 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => updateField('clientName', e.target.value)}
                    placeholder="예: 홍길동"
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> 상담일자
                  </label>
                  <input
                    type="date"
                    value={formData.sessionDate}
                    onChange={(e) => updateField('sessionDate', e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">상담자명</label>
                  <input
                    type="text"
                    value={formData.counselorName}
                    onChange={(e) => updateField('counselorName', e.target.value)}
                    placeholder="예: 이지연"
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">상담회차</label>
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                    <input
                      type="number"
                      min="1"
                      value={formData.sessionCount}
                      onChange={(e) => updateField('sessionCount', parseInt(e.target.value) || 1)}
                      className="w-full text-sm px-3 py-2 focus:outline-none"
                    />
                    <span className="bg-slate-50 text-slate-500 text-xs px-3 border-l border-slate-200 py-2.5">회기</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">실업기간</label>
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                    <input
                      type="number"
                      min="0"
                      value={formData.unemploymentPeriod}
                      onChange={(e) => updateField('unemploymentPeriod', parseInt(e.target.value) || 0)}
                      className="w-full text-sm px-3 py-2 focus:outline-none"
                    />
                    <span className="bg-slate-50 text-slate-500 text-xs px-3 border-l border-slate-200 py-2.5">개월</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-slate-400" /> 희망직종
                  </label>
                  <input
                    type="text"
                    value={formData.desiredJob}
                    onChange={(e) => updateField('desiredJob', e.target.value)}
                    placeholder="예: IT 웹 개발자, 사무행정"
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">보유자격증</label>
                  <input
                    type="text"
                    value={formData.certifications}
                    onChange={(e) => updateField('certifications', e.target.value)}
                    placeholder="예: 정보처리기사, 컴퓨터활용능력 (콤마로 구분)"
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-slate-400" /> 건강상태
                  </label>
                  <input
                    type="text"
                    value={formData.healthStatus}
                    onChange={(e) => updateField('healthStatus', e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-slate-400" /> 경제적 어려움 수준
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['상', '중', '하'] as EconomicHardshipLevel[]).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => updateField('economicHardship', level)}
                        className={`py-2 text-sm font-medium rounded-lg border transition-all cursor-pointer ${
                          formData.economicHardship === level
                            ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {level === '상' && '상 (생활비 매우 어려움)'}
                        {level === '중' && '중 (중등도 압박)'}
                        {level === '하' && '하 (비교적 정상)'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: 심리 측정 변화 수치 */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 bg-sky-50 border border-sky-100 rounded-xl">
                <p className="text-xs text-sky-800 font-medium">
                  💡 평가 기준 안내: PHQ-9(우울증 검사) 및 자기효능감 점수는 상담 회차 전후의 수치 데이터를 구체적으로 비교해야 합니다.
                </p>
              </div>

              {/* PHQ-9 */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-slate-800 flex items-center gap-1.5">
                  <span className="w-1.5 h-4 bg-sky-600 rounded"></span>
                  <span>PHQ-9 우울 선별검사 (0~27점)</span>
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-slate-600">이전 회기 PHQ-9</span>
                      <span className="text-sm font-bold text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                        {formData.phqPrevious}점
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="27"
                      value={formData.phqPrevious}
                      onChange={(e) => updateField('phqPrevious', parseInt(e.target.value))}
                      className="w-full accent-sky-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>0 (안정)</span>
                      <span>10 (경도)</span>
                      <span>20 (중도)</span>
                      <span>27 (심각)</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-slate-600">금회기 PHQ-9</span>
                      <span className="text-sm font-bold text-sky-700 bg-white border border-sky-200 px-2 py-0.5 rounded-md">
                        {formData.phqCurrent}점
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="27"
                      value={formData.phqCurrent}
                      onChange={(e) => updateField('phqCurrent', parseInt(e.target.value))}
                      className="w-full accent-sky-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>0 (안정)</span>
                      <span>10 (경도)</span>
                      <span>20 (중도)</span>
                      <span>27 (심각)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Self-Efficacy */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-slate-800 flex items-center gap-1.5">
                  <span className="w-1.5 h-4 bg-sky-600 rounded"></span>
                  <span>자기효능감 (10점 만점 척도)</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-slate-600">이전 회기 자기효능감</span>
                      <span className="text-sm font-bold text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                        {formData.efficacyPrevious}점
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={formData.efficacyPrevious}
                      onChange={(e) => updateField('efficacyPrevious', parseInt(e.target.value))}
                      className="w-full accent-sky-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>1 (매우 낮음)</span>
                      <span>5 (보통)</span>
                      <span>10 (매우 높음)</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-slate-600">금회기 자기효능감</span>
                      <span className="text-sm font-bold text-sky-700 bg-white border border-sky-200 px-2 py-0.5 rounded-md">
                        {formData.efficacyCurrent}점
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={formData.efficacyCurrent}
                      onChange={(e) => updateField('efficacyCurrent', parseInt(e.target.value))}
                      className="w-full accent-sky-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>1 (매우 낮음)</span>
                      <span>5 (보통)</span>
                      <span>10 (매우 높음)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: 호소문제 및 내담자 강점 */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  취업 영역 주요 호소문제 (간단히 작성 가능)
                </label>
                <textarea
                  value={formData.complaintsJob}
                  onChange={(e) => updateField('complaintsJob', e.target.value)}
                  placeholder="예: 반복적인 서류 탈락으로 구직 스트레스와 이력서 작성에 장벽을 느낌"
                  rows={3}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  정서 영역 주요 호소문제 (간단히 작성 가능)
                </label>
                <textarea
                  value={formData.complaintsEmotional}
                  onChange={(e) => updateField('complaintsEmotional', e.target.value)}
                  placeholder="예: 미래 불안과 자신감 결여로 가벼운 대인 기피와 불면 호소"
                  rows={3}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  내담자 강점 분석
                </label>
                <textarea
                  value={formData.clientStrengths}
                  onChange={(e) => updateField('clientStrengths', e.target.value)}
                  placeholder="예: 실무 전공 자격증 다수 소지, 기술 블로그를 꾸준하게 기입해 옴"
                  rows={3}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          )}

          {/* STEP 4: 상담내용 및 실천과제 */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">심리·정서적 조력 내용</label>
                  <textarea
                    value={formData.psychotherapyNotes}
                    onChange={(e) => updateField('psychotherapyNotes', e.target.value)}
                    placeholder="예: 인지왜곡 탐색하여 불안 자책감을 낮춤"
                    rows={3}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">취업역량 강화 조력 내용</label>
                  <textarea
                    value={formData.jobCapacityNotes}
                    onChange={(e) => updateField('jobCapacityNotes', e.target.value)}
                    placeholder="예: 이력서 포트폴리오 첨삭, 자기소개서 동기 수정 피드백"
                    rows={3}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="border border-slate-100 rounded-xl p-4 bg-slate-50">
                <span className="block text-xs font-semibold text-slate-700 mb-3">구직활동 및 지원 점검</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">입사지원 건수</label>
                    <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden">
                      <input
                        type="number"
                        min="0"
                        value={formData.jobSearchCheckCount}
                        onChange={(e) => updateField('jobSearchCheckCount', parseInt(e.target.value) || 0)}
                        className="w-full text-sm px-3 py-1.5 focus:outline-none"
                      />
                      <span className="bg-slate-50 text-slate-500 text-xs px-2 py-2 border-l border-slate-200">건</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">면접 참여 건수</label>
                    <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden">
                      <input
                        type="number"
                        min="0"
                        value={formData.jobSearchInterviewCount}
                        onChange={(e) => updateField('jobSearchInterviewCount', parseInt(e.target.value) || 0)}
                        className="w-full text-sm px-3 py-1.5 focus:outline-none"
                      />
                      <span className="bg-slate-50 text-slate-500 text-xs px-2 py-2 border-l border-slate-200">건</span>
                    </div>
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-[11px] text-slate-600 mb-1">면접 결과 및 조율 상황</label>
                    <input
                      type="text"
                      value={formData.jobSearchCheckResult}
                      onChange={(e) => updateField('jobSearchCheckResult', e.target.value)}
                      placeholder="예: 1차 기술면접 통과, 최종 조율 중"
                      className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">이전 회기 대비 변화점 및 실천과제 결과</label>
                  <textarea
                    value={formData.previousSessionChanges}
                    onChange={(e) => updateField('previousSessionChanges', e.target.value)}
                    placeholder="예: 지난 회기 행동과제인 블로그 포스팅 2건 작성 완료함"
                    rows={3}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">구직 의욕 고취 및 동기강화 상담내용</label>
                  <textarea
                    value={formData.motivationNotes}
                    onChange={(e) => updateField('motivationNotes', e.target.value)}
                    placeholder="예: 실패 과몰입 극복 훈련 및 직무 소화력 장점 상기"
                    rows={3}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: 연계, 검사 및 차기 계획 */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-fade-in overflow-y-visible">
              {/* Referrals (Checkboxes) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  취업지원 연계서비스 항목 (실제 제공 항목만 체크 ☑)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {AVAILABLE_REFERRALS.map((referral) => {
                    const isChecked = formData.referrals.includes(referral);
                    return (
                      <button
                        key={referral}
                        type="button"
                        onClick={() => toggleReferral(referral)}
                        className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 border cursor-pointer ${
                          isChecked 
                            ? 'bg-sky-50 border-sky-200 text-sky-800 font-semibold' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] ${
                          isChecked ? 'bg-sky-600 border-sky-600 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isChecked && '✓'}
                        </span>
                        <span>{referral}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Career test notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">진로심리검사 활용 및 피드백 내용</label>
                  <textarea
                    value={formData.careerTestNotes}
                    onChange={(e) => updateField('careerTestNotes', e.target.value)}
                    placeholder="예: 직업선호도검사 L형 결과 기반 탐구형 유형을 자격요건과 분석 매칭함"
                    rows={2.5}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">표정 및 언어표현 관찰 기록</label>
                  <textarea
                    value={formData.clientExpression}
                    onChange={(e) => updateField('clientExpression', e.target.value)}
                    placeholder="예: 입실 시 표정이 가벼웠으며 목소리가 밝아지고 대화 시 시선 교환 증가함"
                    rows={2.5}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Next session plans (Numbers & Actions) */}
              <div className="border border-slate-100 rounded-xl p-4 bg-slate-50 space-y-3">
                <span className="block text-xs font-semibold text-slate-700">차기 회기 계획 구성 (수치 기반 구체적 수립)</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">모의면접 실시</label>
                    <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden">
                      <input
                        type="number"
                        min="0"
                        value={formData.nextActionPlan.mockInterviews}
                        onChange={(e) => updatePlanField('mockInterviews', parseInt(e.target.value) || 0)}
                        className="w-full text-sm px-3 py-1.5 focus:outline-none"
                      />
                      <span className="bg-slate-50 text-slate-500 text-xs px-2 py-2 border-l border-slate-200">회</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">목표기업 추가 매칭</label>
                    <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden">
                      <input
                        type="number"
                        min="0"
                        value={formData.nextActionPlan.targetCompanies}
                        onChange={(e) => updatePlanField('targetCompanies', parseInt(e.target.value) || 0)}
                        className="w-full text-sm px-3 py-1.5 focus:outline-none"
                      />
                      <span className="bg-slate-50 text-slate-500 text-xs px-2 py-2 border-l border-slate-200">개소</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">PHQ-9 재측정 여부</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => updatePlanField('phqReassess', true)}
                        className={`py-1.5 text-xs font-semibold rounded-lg border cursor-pointer ${
                          formData.nextActionPlan.phqReassess
                            ? 'bg-sky-600 text-white border-sky-600'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        측정함
                      </button>
                      <button
                        type="button"
                        onClick={() => updatePlanField('phqReassess', false)}
                        className={`py-1.5 text-xs font-semibold rounded-lg border cursor-pointer ${
                          !formData.nextActionPlan.phqReassess
                            ? 'bg-sky-600 text-white border-sky-600'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        생략
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">차기 추가 행동계획 (구체적 실천 과제)</label>
                    <input
                      type="text"
                      value={formData.nextActionPlan.additionalPlan}
                      onChange={(e) => updatePlanField('additionalPlan', e.target.value)}
                      placeholder="예: 2차 면접 기출 분석 1회, 이력서 완성본 제출"
                      className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">차기 상담 일정</label>
                    <input
                      type="text"
                      value={formData.nextActionPlan.nextSchedule}
                      onChange={(e) => updatePlanField('nextSchedule', e.target.value)}
                      placeholder="예: 2026-07-03 14:00 (또는 미정)"
                      className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">내담자 종합 판단 및 상담자 종합 의견</label>
                <textarea
                  value={formData.overallJudgment}
                  onChange={(e) => {
                    updateField('overallJudgment', e.target.value);
                    updateField('counselorOpinion', e.target.value); // Sync opinions as a starting draft
                  }}
                  placeholder="예: 우울감 하락과 면접 1차 합격으로 효능감이 올라왔으며 최종 관문 돌파를 위한 밀착 모의 스피치 지원이 필요함."
                  rows={2}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer controls */}
        <div className="flex justify-between items-center pt-6 border-t border-slate-100 bg-white mt-6 no-print">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className={`px-4 py-2 text-sm font-medium border border-slate-200 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors ${
              currentStep === 1 
                ? 'opacity-40 cursor-not-allowed bg-slate-50' 
                : 'bg-white hover:bg-slate-50'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>이전 단계</span>
          </button>

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 text-sm font-medium bg-slate-800 hover:bg-slate-900 text-white rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>다음 단계</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isGenerating}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>AI 보고서 작성 중...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>평가기준 준수 AI 보고서 생성</span>
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
