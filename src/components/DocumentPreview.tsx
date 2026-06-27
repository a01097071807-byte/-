import React, { useRef } from 'react';
import { Printer, Copy, CheckCircle, RefreshCw } from 'lucide-react';
import { CounselingReport } from '../types';

interface DocumentPreviewProps {
  report: CounselingReport;
  onCopyMarkdown: () => void;
  isCopied: boolean;
}

export default function DocumentPreview({ report, onCopyMarkdown, isCopied }: DocumentPreviewProps) {
  const printAreaRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const phqDelta = report.phqPrevious - report.phqCurrent;
  const efficacyDelta = report.efficacyCurrent - report.efficacyPrevious;

  return (
    <div className="flex flex-col h-full bg-slate-100 border border-slate-200 rounded-2xl shadow-inner overflow-hidden" id="document-preview">
      {/* Top Controls Action Bar */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 flex justify-between items-center no-print">
        <div className="flex items-center gap-1.5">
          <CheckCircle className="w-4 h-4 text-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-slate-700">A4 규격 공식 제안서 인쇄/저장 가능</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onCopyMarkdown}
            className={`text-xs px-3.5 py-2 rounded-lg font-medium transition-all flex items-center gap-1.5 border cursor-pointer ${
              isCopied 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{isCopied ? '복사 완료!' : '마크다운 복사'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="text-xs bg-slate-800 hover:bg-slate-900 transition-colors text-white px-3.5 py-2 rounded-lg font-medium flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>인쇄 / PDF 저장</span>
          </button>
        </div>
      </div>

      {/* Main Document Body (Styled A4 Sheet) */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center bg-slate-100/50 print:bg-white print:p-0">
        <div 
          ref={printAreaRef}
          className="print-container w-full max-w-[210mm] min-h-[297mm] bg-white border border-slate-300 shadow-lg p-10 md:p-14 text-slate-800 font-sans print:shadow-none print:border-none print:p-0 relative"
        >
          {/* Official center header decorative double line */}
          <div className="border-t-[3px] border-slate-800 border-b border-slate-800/30 py-4 mb-8 text-center">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 font-sans">
              고용복지플러스센터 상담회기보고서
            </h1>
            <p className="text-xs text-slate-500 font-semibold tracking-wider mt-1.5 uppercase">
              Employment & Welfare Plus Center - Counseling Session Report (제 {report.sessionCount} 회차)
            </p>
          </div>

          {/* 기본 정보 및 개별특성 수집 현황 */}
          <div className="mb-6">
            <h2 className="text-sm font-bold text-slate-900 border-l-[3px] border-slate-800 pl-2 mb-3">
              기본 정보 및 개별특성 수집 현황
            </h2>
            
            <table className="w-full border-collapse border border-slate-300 text-xs">
              <tbody>
                <tr className="border-b border-slate-300">
                  <td className="w-1/6 bg-slate-100 p-2.5 font-bold text-slate-700 text-center border-r border-slate-300">상담일자</td>
                  <td className="w-2/6 p-2.5 border-r border-slate-300">{report.sessionDate}</td>
                  <td className="w-1/6 bg-slate-100 p-2.5 font-bold text-slate-700 text-center border-r border-slate-300">상담자</td>
                  <td className="w-2/6 p-2.5">{report.counselorName} 상담사</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="bg-slate-100 p-2.5 font-bold text-slate-700 text-center border-r border-slate-300">실업기간</td>
                  <td className="p-2.5 border-r border-slate-300">약 {report.unemploymentPeriod}개월</td>
                  <td className="bg-slate-100 p-2.5 font-bold text-slate-700 text-center border-r border-slate-300">희망직종</td>
                  <td className="p-2.5 font-semibold text-slate-900">{report.desiredJob}</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="bg-slate-100 p-2.5 font-bold text-slate-700 text-center border-r border-slate-300">보유자격증</td>
                  <td className="p-2.5 border-r border-slate-300">{report.certifications || '없음'}</td>
                  <td className="bg-slate-100 p-2.5 font-bold text-slate-700 text-center border-r border-slate-300">건강상태</td>
                  <td className="p-2.5">{report.healthStatus}</td>
                </tr>
                <tr>
                  <td className="bg-slate-100 p-2.5 font-bold text-slate-700 text-center border-r border-slate-300">경제적 어려움</td>
                  <td className="p-2.5 border-r border-slate-300">수준 [{report.economicHardship}]</td>
                  <td className="bg-slate-100 p-2.5 font-bold text-slate-700 text-center border-r border-slate-300">PHQ-9 변화</td>
                  <td className="p-2.5 font-bold text-sky-700">
                    이전 {report.phqPrevious}점 → 금회 {report.phqCurrent}점
                    {phqDelta > 0 && <span className="text-emerald-600 ml-1.5">({phqDelta}점 감소)</span>}
                    {phqDelta < 0 && <span className="text-rose-600 ml-1.5">({Math.abs(phqDelta)}점 증가)</span>}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 1. 호소문제 */}
          <div className="mb-6">
            <h2 className="text-sm font-bold text-slate-900 border-l-[3px] border-slate-800 pl-2 mb-3">
              1. 호소문제
            </h2>

            <table className="w-full border-collapse border border-slate-300 text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300">
                  <th className="w-1/3 p-2 font-bold text-slate-700 border-r border-slate-300 text-center">취업영역 주요 호소문제</th>
                  <th className="w-1/3 p-2 font-bold text-slate-700 border-r border-slate-300 text-center">정서영역 주요 호소문제</th>
                  <th className="w-1/3 p-2 font-bold text-slate-700 text-center">내담자 강점영역</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border-r border-slate-300 align-top leading-relaxed text-slate-700 whitespace-pre-wrap">
                    {report.complaintsJob}
                  </td>
                  <td className="p-3 border-r border-slate-300 align-top leading-relaxed text-slate-700 whitespace-pre-wrap">
                    {report.complaintsEmotional}
                  </td>
                  <td className="p-3 align-top leading-relaxed text-slate-700 whitespace-pre-wrap">
                    {report.clientStrengths}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 2. 상담전략 및 상담내용 */}
          <div className="mb-6">
            <h2 className="text-sm font-bold text-slate-900 border-l-[3px] border-slate-800 pl-2 mb-3">
              2. 상담전략 및 상담내용
            </h2>

            {/* 2-1. 핵심감정 분석 */}
            <div className="mb-4">
              <h3 className="text-xs font-bold text-slate-800 bg-slate-50 border-b border-slate-200 px-2 py-1.5 mb-2 rounded flex justify-between">
                <span>2-1. 핵심감정 분석</span>
                <span className="text-[10px] text-slate-500 font-semibold font-mono">PHQ-9 / Self-Efficacy Core Emotion Analysis</span>
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed px-1">
                - PHQ-9(우울 점수)는 이전 회기 <span className="font-semibold text-slate-900">{report.phqPrevious}점</span>에서 금회기 <span className="font-bold text-sky-700">{report.phqCurrent}점</span>으로 <span className="font-semibold text-sky-700">{Math.abs(phqDelta)}점 {phqDelta >= 0 ? '감소' : '증가'}</span>하였음.
              </p>
              <p className="text-xs text-slate-700 leading-relaxed px-1 mt-1">
                - 자기효능감(10점 만점)은 이전 <span className="font-semibold text-slate-900">{report.efficacyPrevious}점</span>에서 금회 <span className="font-bold text-sky-700">{report.efficacyCurrent}점</span>으로 <span className="font-semibold text-sky-700">{efficacyDelta >= 0 ? `${efficacyDelta}점 향상` : `${Math.abs(efficacyDelta)}점 하락`}</span>되었음.
              </p>
              <p className="text-xs text-slate-700 leading-relaxed px-1 mt-2 border-t border-slate-100 pt-1.5 whitespace-pre-wrap">
                {report.overallJudgment ? `- ${report.overallJudgment}` : '- 수치 변화에 의거해 내담자가 구직에 관해 점진적 안정 및 감정 환기 추세를 보이고 있음을 확인하였음.'}
              </p>
            </div>

            {/* 2-2. 개별특성 분석 */}
            <div className="mb-4">
              <h3 className="text-xs font-bold text-slate-800 bg-slate-50 border-b border-slate-200 px-2 py-1.5 mb-2 rounded">
                2-2. 개별특성 분석 및 상담 목표
              </h3>
              <div className="border border-slate-300 rounded p-3 text-xs space-y-1 bg-slate-50/20">
                <p className="leading-relaxed">
                  • <strong>종합 특성:</strong> 실업기간 <u>{report.unemploymentPeriod}개월</u>인 상태로 희망직종은 <u>[{report.desiredJob}]</u>이며, 보유자격증은 <u>[{report.certifications || '없음'}]</u>인 내담자임. 현재 건강상태 <u>{report.healthStatus}</u>와 생활비 <u>경제적 어려움 수준 [{report.economicHardship}]</u>의 복합 요인을 안고 있음.
                </p>
                <p className="leading-relaxed">
                  • <strong>심리 지표 연계:</strong> 이전 우울수치 <u>{report.phqPrevious}점</u> → 현재 <u>{report.phqCurrent}점</u> 및 자기효능감 <u>{report.efficacyPrevious}점</u> → <u>{report.efficacyCurrent}점</u>의 상태 변화에 근거하여 단기/중기/장기 목표를 유기적으로 연결 관리함.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-2 border-t border-slate-200 text-[11px] mt-2">
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="block font-bold text-sky-700 mb-0.5">단기 목표 (1~2주)</span>
                    <span className="text-slate-600 block text-[10.5px]">CBT 치료를 토대로 불안 극복, 인지 오류 교정 및 우울 완화</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="block font-bold text-sky-700 mb-0.5">중기 목표 (1개월)</span>
                    <span className="text-slate-600 block text-[10.5px]">{report.desiredJob} 직무 자격요건 분석 및 최적화 이력서 갱신</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="block font-bold text-sky-700 mb-0.5">장기 목표 (최종)</span>
                    <span className="text-slate-600 block text-[10.5px]">{report.desiredJob} 구인 기업 매칭 및 최종 합격·안정적 적응</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2-3. 상담내용 */}
            <div className="mb-4">
              <h3 className="text-xs font-bold text-slate-800 bg-slate-50 border-b border-slate-200 px-2 py-1.5 mb-2 rounded">
                2-3. 상담내용
              </h3>

              <table className="w-full border-collapse border border-slate-300 text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300">
                    <th className="w-1/5 p-2 font-bold text-slate-700 border-r border-slate-300 text-center">상담 영역</th>
                    <th className="w-4/5 p-2 font-bold text-slate-700 text-center">주요 내용 및 상담자 개입 조력 사항</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-300">
                    <td className="bg-slate-50 p-2.5 font-bold text-slate-700 text-center border-r border-slate-300">심리·정서</td>
                    <td className="p-2.5 whitespace-pre-wrap leading-relaxed text-slate-700">{report.psychotherapyNotes}</td>
                  </tr>
                  <tr className="border-b border-slate-300">
                    <td className="bg-slate-50 p-2.5 font-bold text-slate-700 text-center border-r border-slate-300 font-semibold">구직활동 점검</td>
                    <td className="p-2.5 leading-relaxed text-slate-700">
                      <strong>구직 점검 수치:</strong> 입사지원 {report.jobSearchCheckCount}건 / 면접 참여 {report.jobSearchInterviewCount}건 <br />
                      <strong>점검 세부결과:</strong> {report.jobSearchCheckResult}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-300">
                    <td className="bg-slate-50 p-2.5 font-bold text-slate-700 text-center border-r border-slate-300">취업역량 강화</td>
                    <td className="p-2.5 whitespace-pre-wrap leading-relaxed text-slate-700">{report.jobCapacityNotes}</td>
                  </tr>
                  <tr className="border-b border-slate-300">
                    <td className="bg-slate-50 p-2.5 font-bold text-slate-700 text-center border-r border-slate-300">동기강화</td>
                    <td className="p-2.5 whitespace-pre-wrap leading-relaxed text-slate-700">{report.motivationNotes}</td>
                  </tr>
                  <tr>
                    <td className="bg-slate-50 p-2.5 font-bold text-slate-700 text-center border-r border-slate-300">이전 회기 변화점</td>
                    <td className="p-2.5 whitespace-pre-wrap leading-relaxed text-slate-700">{report.previousSessionChanges}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 2-4. 취업지원 연계 및 진로심리검사 */}
            <div>
              <h3 className="text-xs font-bold text-slate-800 bg-slate-50 border-b border-slate-200 px-2 py-1.5 mb-2 rounded">
                2-4. 취업지원 연계 및 진로심리검사
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="border border-slate-300 rounded p-3">
                  <span className="block font-bold text-slate-700 mb-2">☑ 실제 연계서비스 제공 항목</span>
                  <div className="space-y-1">
                    {report.referrals.length === 0 ? (
                      <span className="text-slate-400 text-[11px] block">- 연계된 서비스가 없습니다.</span>
                    ) : (
                      report.referrals.map((r, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-sky-800 font-semibold">
                          <span className="text-sky-600">☑</span>
                          <span>{r}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="border border-slate-300 rounded p-3 leading-relaxed">
                  <span className="block font-bold text-slate-700 mb-1">진로심리검사 및 측정 활용</span>
                  <p className="text-slate-600 text-[11px] whitespace-pre-wrap">
                    {report.careerTestNotes || '진로 적합성 확보를 위한 직업선호도검사 L형 분석 결과를 참고하여 진로 설계 및 이력서에 가치 반영 완료하였음.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. 내담자 상태 파악 */}
          <div className="mb-6">
            <h2 className="text-sm font-bold text-slate-900 border-l-[3px] border-slate-800 pl-2 mb-3">
              3. 내담자 상태 파악 (관찰 및 종합 판단)
            </h2>

            <table className="w-full border-collapse border border-slate-300 text-xs">
              <tbody>
                <tr className="border-b border-slate-300">
                  <td className="w-1/5 bg-slate-100 p-2.5 font-bold text-slate-700 text-center border-r border-slate-300">표정·언어표현</td>
                  <td className="w-4/5 p-2.5 leading-relaxed text-slate-700">{report.clientExpression}</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="bg-slate-100 p-2.5 font-bold text-slate-700 text-center border-r border-slate-300">수치적 변화치</td>
                  <td className="p-2.5">
                    <strong>PHQ-9 우울지수:</strong> 이전 {report.phqPrevious}점 → 금회 {report.phqCurrent}점 ({phqDelta > 0 ? `${phqDelta}점 감소` : `${Math.abs(phqDelta)}점 증가`}) / 
                    <strong className="ml-3">자기효능감:</strong> 이전 {report.efficacyPrevious}점 → 금회 {report.efficacyCurrent}점 ({efficacyDelta >= 0 ? `${efficacyDelta}점 상승` : `${Math.abs(efficacyDelta)}점 하락`})
                  </td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="bg-slate-100 p-2.5 font-bold text-slate-700 text-center border-r border-slate-300">구직활동 참여도</td>
                  <td className="p-2.5">
                    최근 입사지원 <strong>{report.jobSearchCheckCount}건</strong> 및 면접 참여 <strong>{report.jobSearchInterviewCount}건</strong>이 객관적으로 확인되며, 이전 회기 과제를 적극적이고 완전하게 이수하였음.
                  </td>
                </tr>
                <tr>
                  <td className="bg-slate-100 p-2.5 font-bold text-slate-700 text-center border-r border-slate-300">종합 판단</td>
                  <td className="p-2.5 leading-relaxed text-slate-700 font-semibold whitespace-pre-wrap">{report.overallJudgment}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 4. 차기 회기 계획 */}
          <div className="mb-6">
            <h2 className="text-sm font-bold text-slate-900 border-l-[3px] border-slate-800 pl-2 mb-3">
              4. 차기 회기 계획 (구체적 동사형 과제 지향)
            </h2>

            <table className="w-full border-collapse border border-slate-300 text-xs">
              <tbody>
                <tr className="border-b border-slate-300">
                  <td className="w-1/4 bg-slate-100 p-2.5 font-bold text-slate-700 text-center border-r border-slate-300">실질 모의 면접</td>
                  <td className="w-3/4 p-2.5">차기 모의 면접 <strong>{report.nextActionPlan.mockInterviews}회</strong> 실시 및 구직 스피치 일대일 심층 피드백 제공 예정임.</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="bg-slate-100 p-2.5 font-bold text-slate-700 text-center border-r border-slate-300">이력서 완성 & 매칭</td>
                  <td className="p-2.5">피드백이 수용된 이력서 완성 및 직무 정합도 우수 목표기업 <strong>{report.nextActionPlan.targetCompanies}개소</strong> 추가 매칭 선정 완료.</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="bg-slate-100 p-2.5 font-bold text-slate-700 text-center border-r border-slate-300">정서 모니터링</td>
                  <td className="p-2.5">PHQ-9 {report.nextActionPlan.phqReassess ? '재측정 및 정밀 심리상태 재평가 실행 예정임.' : '측정 생략(체크리스트 기반 일상 정서 가볍게 점검 예정)'}</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="bg-slate-100 p-2.5 font-bold text-slate-700 text-center border-r border-slate-300">추가 구체적 실행계획</td>
                  <td className="p-2.5 leading-relaxed text-slate-700 font-medium whitespace-pre-wrap">{report.nextActionPlan.additionalPlan || '1. 이력서 클리닉 보완 과제 제출\n2. 주 2회 취업공고 탐색 실천'}</td>
                </tr>
                <tr>
                  <td className="bg-slate-100 p-2.5 font-bold text-slate-700 text-center border-r border-slate-300">차기 상담 일정</td>
                  <td className="p-2.5 font-bold text-slate-900">{report.nextActionPlan.nextSchedule || '차기 회기 중 개별 문자 조율 예정'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 5. 상담자 종합의견 */}
          <div className="mb-10">
            <h2 className="text-sm font-bold text-slate-900 border-l-[3px] border-slate-800 pl-2 mb-3">
              5. 상담자 종합의견
            </h2>
            <div className="border border-slate-300 rounded p-4 text-xs leading-relaxed text-slate-700 whitespace-pre-wrap bg-slate-50/10">
              {report.counselorOpinion}
            </div>
          </div>

          {/* Signatures Row */}
          <div className="border-t border-slate-400 pt-6 flex justify-between text-xs font-bold text-slate-700 mt-12 px-2">
            <span>내담자 확인: ________________________ (서명 또는 인)</span>
            <span>상담자 확인: ________________________ (서명 또는 인)</span>
          </div>

          {/* Official Stamp representation */}
          <div className="absolute bottom-10 right-14 opacity-25 text-red-500 font-serif border-[3px] border-red-500 rounded-full w-20 h-20 flex items-center justify-center font-bold text-xs rotate-12 select-none pointer-events-none uppercase tracking-widest no-print">
            고용노동부
          </div>
        </div>
      </div>
    </div>
  );
}
