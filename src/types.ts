export type EconomicHardshipLevel = '상' | '중' | '하';

export interface NextActionPlan {
  mockInterviews: number; // 모의면접 횟수
  targetCompanies: number; // 목표기업 개수
  phqReassess: boolean; // PHQ-9 재측정 여부
  additionalPlan: string; // 추가 실행 계획
  nextSchedule: string; // 차기 상담 일정 (날짜 및 시간)
}

export interface CounselingReport {
  id: string;
  createdAt: string;
  
  // 1단계: 기본 정보
  sessionDate: string;
  counselorName: string;
  clientName: string; // 추가로 내담자 식별을 위해 이름 추가
  sessionCount: number; // 회차
  unemploymentPeriod: number; // 실업기간 (개월)
  desiredJob: string; // 희망직종
  certifications: string; // 보유자격증
  healthStatus: string; // 건강상태
  economicHardship: EconomicHardshipLevel; // 경제적 어려움
  
  // 2단계: 심리 측정 수치
  phqPrevious: number;
  phqCurrent: number;
  efficacyPrevious: number; // 10점 만점
  efficacyCurrent: number; // 10점 만점
  
  // 3단계: 호소문제
  complaintsJob: string; // 취업영역 호소문제
  complaintsEmotional: string; // 정서영역 호소문제
  clientStrengths: string; // 내담자 강점
  
  // 4단계: 상담내용
  psychotherapyNotes: string; // 심리·정서 상담 내용
  jobSearchCheckCount: number; // 입사지원 건수
  jobSearchInterviewCount: number; // 면접 건수
  jobSearchCheckResult: string; // 면접 결과 등 구직활동 점검 내용
  jobCapacityNotes: string; // 취업역량 강화 내용 (이력서 첨삭 등)
  motivationNotes: string; // 동기강화 상담내용
  previousSessionChanges: string; // 이전 회기 대비 변화점
  
  // 5단계: 연계 및 계획
  referrals: string[]; // 취업지원 연계서비스 항목 (☑ 표시할 대상 리스트)
  careerTestNotes: string; // 진로심리검사 활용 내용
  nextActionPlan: NextActionPlan; // 차기 회기 계획
  counselorOpinion: string; // 상담자 종합의견
  
  // 3. 내담자 상태 파악 (관찰 기록)
  clientExpression: string; // 표정 및 언어표현 관찰 내용
  overallJudgment: string; // 종합 판단
}

export interface GenerationInput {
  // 사용자가 각 단계별로 입력한 원본 텍스트/데이터
  sessionDate: string;
  counselorName: string;
  clientName: string;
  sessionCount: number;
  unemploymentPeriod: number;
  desiredJob: string;
  certifications: string;
  healthStatus: string;
  economicHardship: EconomicHardshipLevel;
  
  phqPrevious: number;
  phqCurrent: number;
  efficacyPrevious: number;
  efficacyCurrent: number;
  
  complaintsJob: string;
  complaintsEmotional: string;
  clientStrengths: string;
  
  psychotherapyNotes: string;
  jobSearchCheckCount: number;
  jobSearchInterviewCount: number;
  jobSearchCheckResult: string;
  jobCapacityNotes: string;
  motivationNotes: string;
  previousSessionChanges: string;
  
  referrals: string[];
  careerTestNotes: string;
  nextActionPlan: NextActionPlan;
  counselorOpinion: string;
  clientExpression: string;
  overallJudgment: string;
}
