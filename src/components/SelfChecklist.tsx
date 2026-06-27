import React, { useMemo } from 'react';
import { CheckSquare, Square, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { CounselingReport } from '../types';

interface SelfChecklistProps {
  report: CounselingReport;
}

export default function SelfChecklist({ report }: SelfChecklistProps) {
  // Automated analysis of report compliance
  const diagnostic = useMemo(() => {
    // Check 1: Info checklist
    const hasBasicNumbers = 
      report.unemploymentPeriod >= 0 && 
      !!report.desiredJob && 
      !!report.healthStatus && 
      !!report.economicHardship;

    // Check 2: PHQ-9 change
    const hasPhqMetrics = report.phqPrevious !== undefined && report.phqCurrent !== undefined;

    // Check 3: Self-Efficacy change
    const hasEfficacyMetrics = report.efficacyPrevious >= 1 && report.efficacyCurrent >= 1;

    // Check 4: Concrete next plans
    const plan = report.nextActionPlan;
    const hasConcretePlan = 
      plan.mockInterviews > 0 && 
      plan.targetCompanies > 0 && 
      !!plan.additionalPlan && 
      plan.additionalPlan.length > 10;

    // Check 5: Forbidden vague expressions check
    const forbiddenPhrases = [
      '지속적으로 모니터링', '추후 관찰', '지속적인 관찰', 
      '상태 파악함', '특성 확인함', '적성 확인학', '희망직종 파악함'
    ];
    
    // Join all texts to search
    const fullTextSearch = [
      report.complaintsJob,
      report.complaintsEmotional,
      report.psychotherapyNotes,
      report.jobCapacityNotes,
      report.motivationNotes,
      report.previousSessionChanges,
      plan.additionalPlan,
      report.counselorOpinion
    ].join(' ');

    const foundForbidden: string[] = [];
    forbiddenPhrases.forEach(phrase => {
      if (fullTextSearch.includes(phrase)) {
        foundForbidden.push(phrase);
      }
    });

    const hasNoForbidden = foundForbidden.length === 0;

    // Check 6: Referral items set
    const hasReferrals = report.referrals.length > 0;

    return {
      hasBasicNumbers,
      hasPhqMetrics,
      hasEfficacyMetrics,
      hasConcretePlan,
      hasNoForbidden,
      foundForbidden,
      hasReferrals,
      score: [
        hasBasicNumbers,
        hasPhqMetrics,
        hasEfficacyMetrics,
        hasConcretePlan,
        hasNoForbidden,
        hasReferrals
      ].filter(Boolean).length
    };
  }, [report]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4" id="self-checklist">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-sky-600" />
          <h3 className="font-bold text-slate-800 text-sm">보고서 품질 자가진단 (MoEL 평가기준)</h3>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
          diagnostic.score === 6 
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
            : 'bg-amber-50 text-amber-700 border border-amber-200'
        }`}>
          기준 충족도: {diagnostic.score}/6 ({(diagnostic.score / 6 * 100).toFixed(0)}%)
        </span>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed">
        고용센터 평가표 적격 기준에 맞춰 작성된 내용인지 실시간으로 검출 및 모니터링합니다. 불합격 표현이 발견되면 보고서를 수정하세요.
      </p>

      <div className="space-y-3">
        {/* 점검항목 1 */}
        <div className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors">
          <div className="mt-0.5">
            {diagnostic.hasBasicNumbers ? (
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-500" />
            )}
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-800">1. 개별특성 수치 및 데이터 기재 여부</span>
            <span className="block text-[11px] text-slate-500 mt-0.5">
              실업기간(약 {report.unemploymentPeriod}개월), 희망직종({report.desiredJob || '미지정'}), 건강상태 및 경제상황[{report.economicHardship}]이 구체적으로 입력되었습니다.
            </span>
          </div>
        </div>

        {/* 점검항목 2 */}
        <div className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors">
          <div className="mt-0.5">
            {diagnostic.hasPhqMetrics ? (
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-slate-300" />
            )}
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-800">2. PHQ-9 이전 → 금회 수치 변화 기록</span>
            <span className="block text-[11px] text-slate-500 mt-0.5">
              우울 선별검사 {report.phqPrevious}점 → {report.phqCurrent}점의 명확한 수치 대조가 표현에 명기되었습니다.
            </span>
          </div>
        </div>

        {/* 점검항목 3 */}
        <div className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors">
          <div className="mt-0.5">
            {diagnostic.hasEfficacyMetrics ? (
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-slate-300" />
            )}
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-800">3. 자기효능감 10점 척도 수치 변화</span>
            <span className="block text-[11px] text-slate-500 mt-0.5">
              구직 효능감 지수 {report.efficacyPrevious}점 → {report.efficacyCurrent}점이 객관적 데이터로 표시됩니다.
            </span>
          </div>
        </div>

        {/* 점검항목 4 */}
        <div className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors">
          <div className="mt-0.5">
            {diagnostic.hasConcretePlan ? (
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-500" />
            )}
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-800">4. 차기 계획 모의면접 및 목표기업 구체화</span>
            <span className="block text-[11px] text-slate-500 mt-0.5">
              모의면접({report.nextActionPlan.mockInterviews}회), 목표기업({report.nextActionPlan.targetCompanies}개소) 수치 및 상세 실행계획({report.nextActionPlan.additionalPlan ? '확인됨' : '부족'})이 수립되었습니다.
            </span>
          </div>
        </div>

        {/* 점검항목 5 */}
        <div className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors">
          <div className="mt-0.5">
            {diagnostic.hasNoForbidden ? (
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-500" />
            )}
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-800">5. "지속 관찰", "파악함" 등 모호한 표현 미사용 여부</span>
            {diagnostic.hasNoForbidden ? (
              <span className="block text-[11px] text-emerald-600 mt-0.5">
                ✓ 안전함: 평가 통과에 감점이 되는 추상적이거나 불성실한 표현이 검출되지 않았습니다.
              </span>
            ) : (
              <div className="mt-1 p-2 bg-rose-50 border border-rose-100 rounded text-[10.5px] text-rose-700">
                <p className="font-bold">⚠️ 감점 경고: 아래 표현들이 보고서 내에 잔재합니다:</p>
                <p className="mt-0.5 font-mono">{diagnostic.foundForbidden.map(f => `"${f}"`).join(', ')}</p>
                <p className="mt-1 text-slate-500">대신 구체적인 행동 용어(예: 모의면접 실시, 기업 매칭, PHQ 측정)를 활용하여 보강하십시오.</p>
              </div>
            )}
          </div>
        </div>

        {/* 점검항목 6 */}
        <div className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors">
          <div className="mt-0.5">
            {diagnostic.hasReferrals ? (
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-slate-300" />
            )}
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-800">6. 취업지원 연계서비스 체크리스트 수립</span>
            <span className="block text-[11px] text-slate-500 mt-0.5">
              실제 내담자에게 적용된 취업지원 연계서비스 {report.referrals.length}건이 ☑ 표시 상태입니다.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
