import React from 'react';
import { 
  FileEdit, Heart, Briefcase, PlusCircle, CheckSquare, 
  MapPin, HelpCircle, Save, TrendingUp, Sparkles, Compass
} from 'lucide-react';
import { CounselingReport, EconomicHardshipLevel } from '../types';
import { AVAILABLE_REFERRALS } from '../initialData';

interface ReportFormEditorProps {
  report: CounselingReport;
  onChange: (updated: CounselingReport) => void;
  onSave: () => void;
}

export default function ReportFormEditor({ report, onChange, onSave }: ReportFormEditorProps) {
  const updateField = (key: keyof CounselingReport, value: any) => {
    onChange({
      ...report,
      [key]: value
    });
  };

  const updatePlanField = (key: string, value: any) => {
    onChange({
      ...report,
      nextActionPlan: {
        ...report.nextActionPlan,
        [key]: value
      }
    });
  };

  const toggleReferral = (item: string) => {
    const referrals = report.referrals.includes(item)
      ? report.referrals.filter(r => r !== item)
      : [...report.referrals, item];
    updateField('referrals', referrals);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full" id="report-form-editor">
      {/* Editor Header */}
      <div className="px-6 py-4.5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <FileEdit className="w-4.5 h-4.5 text-sky-600" />
            <span>생성된 상담회기보고서 실시간 편집</span>
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            AI가 완성한 내용을 보완하거나 서명하기 전 내용을 가다듬을 수 있습니다.
          </p>
        </div>

        <button
          onClick={onSave}
          className="bg-sky-600 hover:bg-sky-700 transition-colors text-white py-2 px-3.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>보고서 저장</span>
        </button>
      </div>

      {/* Editor Main Forms */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* 1. 기본 정보 신속 수정 */}
        <div className="space-y-4">
          <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <span>[기본 정보 및 개별특성 수치]</span>
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-100 rounded-xl">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">내담자명</label>
              <input
                type="text"
                value={report.clientName}
                onChange={(e) => updateField('clientName', e.target.value)}
                className="w-full text-xs font-medium bg-white border border-slate-200 rounded-lg px-2.5 py-1.5"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">회차</label>
              <input
                type="number"
                value={report.sessionCount}
                onChange={(e) => updateField('sessionCount', parseInt(e.target.value) || 1)}
                className="w-full text-xs font-medium bg-white border border-slate-200 rounded-lg px-2.5 py-1.5"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">실업기간 (개월)</label>
              <input
                type="number"
                value={report.unemploymentPeriod}
                onChange={(e) => updateField('unemploymentPeriod', parseInt(e.target.value) || 0)}
                className="w-full text-xs font-medium bg-white border border-slate-200 rounded-lg px-2.5 py-1.5"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">희망직종</label>
              <input
                type="text"
                value={report.desiredJob}
                onChange={(e) => updateField('desiredJob', e.target.value)}
                className="w-full text-xs font-medium bg-white border border-slate-200 rounded-lg px-2.5 py-1.5"
              />
            </div>
          </div>
        </div>

        {/* 2. 호소문제 분석 영역 */}
        <div className="space-y-4">
          <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <span>[1. 호소문제 영역]</span>
          </h4>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" /> 취업영역 호소문제
              </label>
              <textarea
                value={report.complaintsJob}
                onChange={(e) => updateField('complaintsJob', e.target.value)}
                rows={3}
                className="w-full text-xs border border-slate-200 rounded-lg p-3 focus:outline-none focus:border-sky-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-slate-400" /> 정서영역 호소문제
              </label>
              <textarea
                value={report.complaintsEmotional}
                onChange={(e) => updateField('complaintsEmotional', e.target.value)}
                rows={3}
                className="w-full text-xs border border-slate-200 rounded-lg p-3 focus:outline-none focus:border-sky-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-slate-400" /> 강점 영역
              </label>
              <textarea
                value={report.clientStrengths}
                onChange={(e) => updateField('clientStrengths', e.target.value)}
                rows={3}
                className="w-full text-xs border border-slate-200 rounded-lg p-3 focus:outline-none focus:border-sky-500 font-medium"
              />
            </div>
          </div>
        </div>

        {/* 3. 상담내용 상세 영역 */}
        <div className="space-y-4">
          <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <span>[2. 상담내용 및 상세전략]</span>
          </h4>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                심리·정서 상담 세부 내용
              </label>
              <textarea
                value={report.psychotherapyNotes}
                onChange={(e) => updateField('psychotherapyNotes', e.target.value)}
                rows={4}
                className="w-full text-xs border border-slate-200 rounded-lg p-3 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  구직활동 점검 및 분석 내용
                </label>
                <textarea
                  value={report.jobSearchCheckResult}
                  onChange={(e) => updateField('jobSearchCheckResult', e.target.value)}
                  rows={3.5}
                  className="w-full text-xs border border-slate-200 rounded-lg p-3 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  취업역량 강화 세부내용 (클리닉/지도)
                </label>
                <textarea
                  value={report.jobCapacityNotes}
                  onChange={(e) => updateField('jobCapacityNotes', e.target.value)}
                  rows={3.5}
                  className="w-full text-xs border border-slate-200 rounded-lg p-3 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  구직동기 강화 상담내용
                </label>
                <textarea
                  value={report.motivationNotes}
                  onChange={(e) => updateField('motivationNotes', e.target.value)}
                  rows={3}
                  className="w-full text-xs border border-slate-200 rounded-lg p-3 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  이전 회기 변화점 및 과제 피드백
                </label>
                <textarea
                  value={report.previousSessionChanges}
                  onChange={(e) => updateField('previousSessionChanges', e.target.value)}
                  rows={3}
                  className="w-full text-xs border border-slate-200 rounded-lg p-3 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 4. 연계 서비스 및 피드백 */}
        <div className="space-y-4">
          <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider">
            <span>[3. 연계 및 검사 활용]</span>
          </h4>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                취업지원 연계서비스 체크 항목
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                {AVAILABLE_REFERRALS.map((referral) => {
                  const isChecked = report.referrals.includes(referral);
                  return (
                    <button
                      key={referral}
                      type="button"
                      onClick={() => toggleReferral(referral)}
                      className={`text-left px-2 py-1.5 rounded-lg text-[10px] font-semibold transition-all flex items-center gap-1.5 border cursor-pointer ${
                        isChecked 
                          ? 'bg-sky-50 border-sky-200 text-sky-800' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[9px] ${
                        isChecked ? 'bg-sky-600 border-sky-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isChecked && '✓'}
                      </span>
                      <span className="truncate">{referral}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                진로심리검사 활용 및 피드백 기록
              </label>
              <textarea
                value={report.careerTestNotes}
                onChange={(e) => updateField('careerTestNotes', e.target.value)}
                rows={2.5}
                className="w-full text-xs border border-slate-200 rounded-lg p-3"
              />
            </div>
          </div>
        </div>

        {/* 5. 비언어적 관찰 및 종합 판단 */}
        <div className="space-y-4">
          <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider">
            <span>[4. 내담자 관찰 상태 파악]</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                표정 및 언어표현 등 비언어 관찰 상세
              </label>
              <textarea
                value={report.clientExpression}
                onChange={(e) => updateField('clientExpression', e.target.value)}
                rows={3}
                className="w-full text-xs border border-slate-200 rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                위기수준 및 적응성 종합 판단
              </label>
              <textarea
                value={report.overallJudgment}
                onChange={(e) => updateField('overallJudgment', e.target.value)}
                rows={3}
                className="w-full text-xs border border-slate-200 rounded-lg p-3"
              />
            </div>
          </div>
        </div>

        {/* 6. 차기 회기 계획 세부 수정 */}
        <div className="space-y-4">
          <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <span>[5. 차기 회기 구체적 실행 과제]</span>
          </h4>

          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">모의면접 예정 (회)</label>
                <input
                  type="number"
                  value={report.nextActionPlan.mockInterviews}
                  onChange={(e) => updatePlanField('mockInterviews', parseInt(e.target.value) || 0)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">추천기업 매칭 (개소)</label>
                <input
                  type="number"
                  value={report.nextActionPlan.targetCompanies}
                  onChange={(e) => updatePlanField('targetCompanies', parseInt(e.target.value) || 0)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">차기 상담일정 지정</label>
                <input
                  type="text"
                  value={report.nextActionPlan.nextSchedule}
                  onChange={(e) => updatePlanField('nextSchedule', e.target.value)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-slate-500 mb-1">동사형 행동 실행계획 상세서술 (불합격 사유 방지용 필수 작성)</label>
              <textarea
                value={report.nextActionPlan.additionalPlan}
                onChange={(e) => updatePlanField('additionalPlan', e.target.value)}
                rows={3}
                className="w-full text-xs bg-white border border-slate-200 rounded-lg p-3 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 7. 상담사 종합 의견 */}
        <div className="space-y-4">
          <h4 className="font-bold text-xs text-rose-500 uppercase tracking-wider flex items-center gap-1">
            <span>[6. 상담사 최종 종합 의견]</span>
          </h4>
          <textarea
            value={report.counselorOpinion}
            onChange={(e) => updateField('counselorOpinion', e.target.value)}
            rows={5}
            className="w-full text-xs border border-rose-100 bg-rose-50/10 rounded-lg p-3 focus:outline-none focus:border-rose-300"
          />
        </div>

      </div>
    </div>
  );
}
