import { CounselingReport } from './types';

export function generateMarkdownReport(report: CounselingReport): string {
  const phqDelta = report.phqPrevious - report.phqCurrent;
  const efficacyDelta = report.efficacyCurrent - report.efficacyPrevious;

  // Build referrals checkboxes ☑
  const allReferrals = [
    '국민취업지원제도',
    '심리안정지원프로그램',
    '직업훈련(내일배움카드)',
    '취업알선 및 기업매칭',
    '집단상담프로그램',
    '청년도전지원사업',
    '중장년일자리희망센터 연계',
    '긴급복지지원제도 (생계비 지원)'
  ];

  const checkedReferralsString = allReferrals
    .map(ref => report.referrals.includes(ref) ? `☑ ${ref}` : `☐ ${ref}`)
    .join(', ');

  return `# 고용복지플러스센터 상담회기보고서 (제 ${report.sessionCount} 회차)

## 기본 정보 및 개별특성 수집 현황

| 항목 | 내용 | 항목 | 내용 |
|------|------|------|------|
| 상담일자 | ${report.sessionDate} | 상담자 | ${report.counselorName} |
| 실업기간 | 약 ${report.unemploymentPeriod}개월 | 희망직종 | ${report.desiredJob} |
| 보유자격증 | ${report.certifications || '없음'} | 건강상태 | ${report.healthStatus} |
| 경제적 어려움 | ${report.economicHardship} | PHQ-9 변화 | 이전 ${report.phqPrevious}점 → 금회 ${report.phqCurrent}점 |

---

## 1. 호소문제

| 취업영역 | 정서영역 | 강점영역 |
|----------|----------|----------|
| ${report.complaintsJob.replace(/\n/g, '<br>')} | ${report.complaintsEmotional.replace(/\n/g, '<br>')} | ${report.clientStrengths.replace(/\n/g, '<br>')} |

---

## 2. 상담전략 및 상담내용

### 2-1. 핵심감정 분석
- PHQ-9(우울수치) 변화: 이전 회기 ${report.phqPrevious}점 → 금회기 ${report.phqCurrent}점 (${phqDelta >= 0 ? `${phqDelta}점 감소` : `${Math.abs(phqDelta)}점 증가`})를 인지행동 심리학적으로 연계 분석함.
- 자기효능감(10점 만점 척도) 변화: 이전 회기 ${report.efficacyPrevious}점 → 금회기 ${report.efficacyCurrent}점 (${efficacyDelta >= 0 ? `${efficacyDelta}점 향상` : `${Math.abs(efficacyDelta)}점 하락`})에 따라 내담자의 구직 활성 의지 개선을 관찰함.
- 핵심감정 분석: ${report.overallJudgment || '구직 거절 경험으로 저하되었던 심리 지표가 심리 상담 및 포트폴리오 첨삭을 계기로 주도적인 방향으로 복원되기 시작함.'}

### 2-2. 개별특성 분석
- 실업기간 ${report.unemploymentPeriod}개월, 희망직종 ${report.desiredJob}, 보유자격증 ${report.certifications || '없음'}
- 경제적 어려움 ${report.economicHardship}, 건강상태 ${report.healthStatus}
- PHQ-9: 이전 ${report.phqPrevious}점 → 금회 ${report.phqCurrent}점 / 자기효능감: 이전 ${report.efficacyPrevious}점 → 금회 ${report.efficacyCurrent}점
- 상담목표: 
  * 단기: 인지왜곡 교정을 통한 불안 극복 및 자아존중감 회복
  * 중기: 이력서·포트폴리오 고도화 및 구직 필수 역량 완비
  * 장기: 맞춤형 구인 공고 기업 매칭 제안 및 최종 합격 달성

### 2-3. 상담내용

| 영역 | 주요 내용 |
|------|-----------|
| 심리·정서 | ${report.psychotherapyNotes.replace(/\n/g, '<br>')} |
| 구직활동 점검 | 입사지원 ${report.jobSearchCheckCount}건 / 면접 ${report.jobSearchInterviewCount}건 / 결과: ${report.jobSearchCheckResult} |
| 취업역량 강화 | ${report.jobCapacityNotes.replace(/\n/g, '<br>')} |
| 동기강화 | ${report.motivationNotes.replace(/\n/g, '<br>')} |
| 이전 회기 변화점 | 실천과제 이수 완료 / PHQ-9 ${report.phqPrevious}점 → ${report.phqCurrent}점 변화에 따른 행동 복귀 관찰 |

### 2-4. 취업지원 연계 및 진로심리검사

**연계서비스:** ${report.referrals.map(r => `☑ ${r}`).join(', ') || '제공 항목 없음'}

**진로심리검사 활용:**
- PHQ-9 기준 ${Math.abs(phqDelta)}점 ${phqDelta >= 0 ? '감소' : '증가'} 확인에 따른 정서적 준비도 갱신.
- 직업선호도검사 기반 취업흥미·적성 재확인 및 ${report.desiredJob} 직무 진로설계 반영 완료.

---

## 3. 내담자 상태 파악

- 표정·언어표현: ${report.clientExpression}
- PHQ-9: 이전 ${report.phqPrevious}점 → 금회 ${report.phqCurrent}점 (${phqDelta >= 0 ? `${phqDelta}점 감소` : `${Math.abs(phqDelta)}점 증가`})
- 자기효능감: 이전 ${report.efficacyPrevious}점 → 금회 ${report.efficacyCurrent}점 향상
- 구직활동 참여도: 입사지원 ${report.jobSearchCheckCount}건 / 이전 대비 증가
- 종합 판단: ${report.overallJudgment}

---

## 4. 차기 회기 계획

- 모의면접 ${report.nextActionPlan.mockInterviews}회 실시 및 피드백 제공 예정
- 이력서 최종본 완성 및 목표기업 ${report.nextActionPlan.targetCompanies}개소 선정 완료
- PHQ-9 재측정 및 심리상태 지속 재평가 실행 예정
- 실행계획: ${report.nextActionPlan.additionalPlan.replace(/\n/g, ', ')}
- 차기 상담 일정: ${report.nextActionPlan.nextSchedule || '일정 조율 중'}

---

## 5. 상담자 종합의견

- ${report.counselorOpinion}

---

내담자 확인: _______________(서명) / 상담자 확인: _______________(서명)
`;
}
