import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// JSON parser
app.use(express.json());

// Initialize Gemini client (server-side only)
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Health check API
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is healthy." });
});

// API Key Validation API
app.post("/api/validate-key", async (req, res) => {
  try {
    const { apiKey: keyToCheck } = req.body;
    if (!keyToCheck) {
      return res.status(400).json({ valid: false, error: "API 키를 입력해주세요." });
    }

    const testAi = new GoogleGenAI({
      apiKey: keyToCheck,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    // Make a simple, fast call to validate the key
    await testAi.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "API Key Validation Ping.",
    });

    return res.json({ valid: true, message: "API 키가 성공적으로 검증되었습니다." });
  } catch (error: any) {
    console.error("API Key Validation Error:", error);
    return res.status(400).json({ 
      valid: false, 
      error: "유효하지 않은 API 키입니다. 키를 다시 확인해주세요.",
      details: error.message || error 
    });
  }
});

// AI Report Generation API
app.post("/api/generate", async (req, res) => {
  try {
    const userApiKey = (req.headers["x-gemini-key"] as string) || apiKey;
    if (!userApiKey) {
      return res.status(400).json({ 
        error: "Gemini API 키가 설정되지 않았습니다. 소개 랜딩페이지에서 API 키를 등록하거나 환경 변수를 확인해주세요." 
      });
    }

    const dynamicAi = new GoogleGenAI({
      apiKey: userApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const inputData = req.body;

    // Build a structured, highly restrictive instruction prompt for Gemini
    const systemInstruction = `
당신은 대한민국 고용복지플러스센터에서 근무하는 전문 직업상담사 및 상담심리전문가입니다.
내담자의 상담 내용 데이터를 바탕으로, 고용노동부 평가표 기준(개별특성 수집·관리, 심리상태 변화 기록)을 완벽하게 충족하는 가장 전문적이고 완성도 높은 "상담회기보고서"의 텍스트 필드를 생성해야 합니다.

[중요 평가 기준 및 작성 원칙]
1. 개별특성 수집·관리 기준:
   - 보고서 전반에 내담자의 실업기간, 희망직종, 자격증, 건강상태, 경제적 어려움 등의 구체적인 데이터를 유기적으로 녹여내야 합니다.
   - 단순히 "희망직종 파악함", "자격증 확인함"과 같은 불충분한 기재는 절대 금지됩니다. 
   - 개별특성 정보를 근거로 삼아 상담 목표(단기/중기/장기) 및 연계 계획과 설득력 있게 연결하십시오.
2. 심리상태 변화 기록 및 향후 방향 기준:
   - PHQ-9(우울증 검사) 수치 변화(이전 회기 → 금회기)와 자기효능감(10점 만점 척도)의 수치 변화(이전 회기 → 금회기)를 반드시 구체적인 숫자로 언급하고, 이에 따른 심리상태의 변화 원인을 전문적으로 분석하십시오.
   - 차기 회기 계획은 지극히 구체적인 실행 계획으로 기술하십시오. "지속적으로 모니터링할 예정임", "추후 상태 파악함" 등 추상적인 표현은 불합격 사유이므로 절대 금지합니다.
   - "모의면접 n회 실시", "이력서 최종본 피드백 및 목표기업 n개소 선정", "PHQ-9 재측정" 등 즉각 확인 가능한 구체적 태스크 위주로 기재하십시오.
3. 전문적 서술 체계:
   - 모든 항목은 공공기관에 제출하는 공문서 및 전문 상담 차트 수준으로 정제되고 객관적인 어조('~임', '~함', '~함에 따라 ... 분석됨' 등 종결어미 사용)를 사용하십시오.
   - 추상적이거나 반복적인 표현을 배제하고 사실과 관찰, 계량화된 정보에 입각해 작성하십시오.
`;

    const promptText = `
내담자의 상담 정보 원본은 다음과 같습니다:
- 내담자명: ${inputData.clientName || "미입력"}
- 상담일자: ${inputData.sessionDate || "미입력"}
- 상담자명: ${inputData.counselorName || "미입력"}
- 상담회차: ${inputData.sessionCount || 1}회차
- 실업기간: 약 ${inputData.unemploymentPeriod || 0}개월
- 희망직종: ${inputData.desiredJob || "미입력"}
- 보유자격증: ${inputData.certifications || "없음"}
- 건강상태: ${inputData.healthStatus || "특이사항 없음"}
- 경제적 어려움 수준: ${inputData.economicHardship || "중"}
- PHQ-9 점수: 이전 회기 ${inputData.phqPrevious ?? 0}점 -> 금회기 ${inputData.phqCurrent ?? 0}점
- 자기효능감(10점 척도): 이전 회기 ${inputData.efficacyPrevious ?? 0}점 -> 금회기 ${inputData.efficacyCurrent ?? 0}점

- 취업 영역 주요 호소문제: ${inputData.complaintsJob || "미입력"}
- 정서 영역 주요 호소문제: ${inputData.complaintsEmotional || "미입력"}
- 내담자 강점: ${inputData.clientStrengths || "미입력"}

- 심리·정서 상담 내용: ${inputData.psychotherapyNotes || "미입력"}
- 구직활동 점검: 입사지원 ${inputData.jobSearchCheckCount ?? 0}건 / 면접 ${inputData.jobSearchInterviewCount ?? 0}건 / 면접결과 등: ${inputData.jobSearchCheckResult || "특이사항 없음"}
- 취업역량 강화 내용: ${inputData.jobCapacityNotes || "미입력"}
- 동기강화 상담내용: ${inputData.motivationNotes || "미입력"}
- 이전 회기 대비 변화점 및 실천과제 완료 상태: ${inputData.previousSessionChanges || "미입력"}

- 취업지원 연계서비스 항목: ${(inputData.referrals || []).join(", ") || "없음"}
- 진로심리검사 활용 내용: ${inputData.careerTestNotes || "미입력"}
- 표정 및 언어표현 관찰 내용: ${inputData.clientExpression || "미입력"}
- 종합 판단 내용: ${inputData.overallJudgment || "미입력"}

- 차기 회기 계획 (원본):
  * 모의면접: ${inputData.nextActionPlan?.mockInterviews ?? 1}회 실시 예정
  * 목표기업: ${inputData.nextActionPlan?.targetCompanies ?? 3}개소 선정 예정
  * PHQ-9 재측정: ${inputData.nextActionPlan?.phqReassess ? "진행함" : "진행 안 함"}
  * 추가 계획: ${inputData.nextActionPlan?.additionalPlan || "미입력"}
  * 차기 상담 일정: ${inputData.nextActionPlan?.nextSchedule || "미정"}

- 상담자 종합의견 (원본): ${inputData.counselorOpinion || "미입력"}

---

위 데이터를 근거로 하여, 전문 상담보고서 양식에 맞추어 각각의 필드를 확장, 보완하여 고품질의 텍스트로 완성하십시오.
특히, 아래 사항에 주의하십시오:
- [취업 영역 호소문제], [정서 영역 호소문제], [강점영역]을 요약 불릿 형태로 작성하되 상담 목표와 연결 가능하도록 작성하십시오.
- [핵심감정 분석]: 우울 수치(PHQ-9) 및 자기효능감 수치 변화가 어떠한 감정상태와 심리적 변화를 나타내는지 심리학적으로 기입하십시오.
- [개별특성 분석]: 실업기간, 보유자격증, 경제적 상황과 심리 변화를 유기적으로 종합 분석하고, 이에 기반한 단기, 중기, 장기 상담목표를 설정해 주십시오. (단기: 당장 1~2주 내 달성할 심리적/행동적 목표, 중기: 1개월 이내 취업 준비 상태 빌드업 목표, 장기: 최종 취업 성공 및 적응 목표)
- [상담내용]: 심리정서, 구직활동 점검, 취업역량 강화, 동기강화, 이전 회기 변화점에 대해 구체적 사실에 입각하여 격식있고 짜임새 있는 긴 줄글이나 불릿으로 기입해 주십시오.
- [진로심리검사 활용]: 점수 변화(PHQ-9 등) 또는 직업적성검사 등을 심리적/진로 준비 측면과 결합해 활용법을 자세히 써 주십시오.
- [내담자 상태 파악]: 표정과 언어표현 등 정밀한 관찰 내용과 종합 판단을 체계적으로 서술해 주십시오.
- [차기 회기 계획]: 모의면접 및 목표기업, PHQ재평가뿐만 아니라 차기 실행계획을 구체적인 동사형 행동 태스크로 3~4개 제시하십시오.
- [상담자 종합의견]: 내담자의 개별특성, 심리변화(PHQ-9 및 효능감 점수), 구직성과를 모두 아우르는 총평을 작성해 주십시오.
`;

    // Define response schema
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        complaintsJob: { 
          type: Type.STRING, 
          description: "취업 영역 호소문제 정제안 (체계적인 불릿 형식, 격식체)" 
        },
        complaintsEmotional: { 
          type: Type.STRING, 
          description: "정서 영역 호소문제 정제안 (체계적인 불릿 형식, 격식체)" 
        },
        clientStrengths: { 
          type: Type.STRING, 
          description: "내담자 강점 분석 (상담목표 달성에 기여하는 실질적 강점)" 
        },
        coreEmotionAnalysis: { 
          type: Type.STRING, 
          description: "PHQ-9 및 자기효능감 수치 변화에 따른 전문적인 심리·정서 및 핵심감정 분석" 
        },
        individualCharacteristicsAnalysis: { 
          type: Type.STRING, 
          description: "실업기간, 보유자격증, 경제적 수준, 건강상태와 심리 수치를 결합한 유기적 종합 분석" 
        },
        goalShortTerm: { 
          type: Type.STRING, 
          description: "개별특성에 맞춘 단기 상담 목표" 
        },
        goalMediumTerm: { 
          type: Type.STRING, 
          description: "개별특성에 맞춘 중기 상담 목표" 
        },
        goalLongTerm: { 
          type: Type.STRING, 
          description: "개별특성에 맞춘 장기 상담 목표" 
        },
        psychotherapyNotes: { 
          type: Type.STRING, 
          description: "심리·정서 상담 내용 (상세하고 기법이 언급된 전문적 서술)" 
        },
        jobSearchCheckResult: { 
          type: Type.STRING, 
          description: "구직활동 점검 결과 및 보완점 (입사지원 건수 및 면접 결과 분석)" 
        },
        jobCapacityNotes: { 
          type: Type.STRING, 
          description: "취업역량 강화 상담 내용 (이력서 첨삭, 직종 탐색 등 구체적 성과)" 
        },
        motivationNotes: { 
          type: Type.STRING, 
          description: "구직동기 강화 상담 내용 및 인지행동 치료적 조력 성과" 
        },
        previousSessionChanges: { 
          type: Type.STRING, 
          description: "이전 회기 실천과제 수행 여부 및 PHQ-9 변화량 분석" 
        },
        careerTestNotes: { 
          type: Type.STRING, 
          description: "PHQ-9 등 심리검사 또는 진로심리검사 활용 및 피드백 내용" 
        },
        clientExpression: { 
          type: Type.STRING, 
          description: "내담자의 비언어적 표현(표정, 목소리, 시선 처리 등) 관찰 기록" 
        },
        overallJudgment: { 
          type: Type.STRING, 
          description: "종합 판단 (심리적 위기 수준, 구직 적극성 종합 진단)" 
        },
        nextActionPlanDetails: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: "차기 회기를 위한 구체적이고 측정 가능한 실행 계획들 (최소 3개 이상 구체적 서술)" 
        },
        counselorOpinion: { 
          type: Type.STRING, 
          description: "상담자 종합의견 (수치 변화 요약, 취업성과 요약, 향후 지원 계획을 모두 담은 최종 총평)" 
        }
      },
      required: [
        "complaintsJob", "complaintsEmotional", "clientStrengths", "coreEmotionAnalysis",
        "individualCharacteristicsAnalysis", "goalShortTerm", "goalMediumTerm", "goalLongTerm",
        "psychotherapyNotes", "jobSearchCheckResult", "jobCapacityNotes", "motivationNotes",
        "previousSessionChanges", "careerTestNotes", "clientExpression", "overallJudgment",
        "nextActionPlanDetails", "counselorOpinion"
      ]
    };

    const response = await dynamicAi.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2,
      },
    });

    const generatedText = response.text;
    if (!generatedText) {
      throw new Error("No text returned from Gemini API");
    }

    const reportJson = JSON.parse(generatedText.trim());
    return res.json(reportJson);

  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    return res.status(500).json({ 
      error: "상담보고서 생성 중 오류가 발생했습니다.", 
      details: error.message || error 
    });
  }
});

// Vite middleware / Static serving setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware mounted.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Serving static production assets from:", distPath);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
