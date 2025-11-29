
import { CoachingModel, Role, Theme, Language } from "./types";

export const THEMES: Theme[] = [
  {
    id: 'microsoft',
    name: 'Microsoft',
    primary: '#0078d4', // Microsoft Blue
    secondary: '#50e6ff', // Cyan
    accent: '#323130', // Neutral
    background: '#f3f2f1', // Light Gray Surface
    gradient: 'linear-gradient(135deg, #0078d4 0%, #004578 100%)'
  },
  {
    id: 'slack',
    name: 'Slack',
    primary: '#4a154b', // Aubergine
    secondary: '#36c5f0', // Blue
    accent: '#2eb67d', // Green Accent
    background: '#ffffff',
    gradient: 'linear-gradient(135deg, #4a154b 0%, #611f69 100%)'
  },
  {
    id: 'stripe',
    name: 'Stripe',
    primary: '#635bff', // Blurple
    secondary: '#0a2540', // Dark Slate
    accent: '#cfd8dc', // Light Blue-Gray (Derived for UI balance)
    background: '#f6f9fc',
    gradient: 'linear-gradient(135deg, #635bff 0%, #0a2540 100%)'
  },
  {
    id: 'zoom',
    name: 'Zoom',
    primary: '#2d8cff', // Zoom Blue
    secondary: '#ff602d', // Orange
    accent: '#e8f3ff', // Light Blue Accent
    background: '#ffffff',
    gradient: 'linear-gradient(135deg, #2d8cff 0%, #0b5cff 100%)'
  },
];

export const COLORS = {
  primary: '#0f4c75',
  secondary: '#3282b8',
  accent: '#bbe1fa',
  background: '#f8fafc',
  text: '#1e293b',
  white: '#ffffff',
  success: '#10b981',
  warning: '#f59e0b',
};

export const MOCK_EVALUATION = {
  metrics: [
    { category: 'Empathy & Rapport', score: 7, fullMark: 10 },
    { category: 'Active Listening', score: 8, fullMark: 10 },
    { category: 'Powerful Questioning', score: 6, fullMark: 10 },
    { category: 'Goal Orientation', score: 9, fullMark: 10 },
    { category: 'Professionalism', score: 10, fullMark: 10 },
  ],
  strengths: [
    "Maintained a professional tone throughout the session.",
    "Good use of open-ended questions to clarify the situation."
  ],
  improvements: [
    "Could demonstrate more empathy towards the user's frustration.",
    "Moved to solutions a bit too quickly before fully exploring the reality."
  ],
  recommendedActions: [
    "Practice reflective listening techniques.",
    "Spend more time in the 'Reality' phase of the GROW model."
  ],
  summary: "A solid coaching session. You demonstrated good structure but could improve on building deeper rapport initially."
};

export const GUIDE_CONTENT: Record<Language, any> = {
  EN: {
    title: "User Guide & Methodology",
    objectives: {
      title: "Objective",
      content: "Dr.LiveCoach is designed to provide a safe, realistic environment for professionals to practice coaching and communication skills. It bridges the gap between theory (GROW, OSKAR) and real-world application."
    },
    howTo: {
      title: "How to Use",
      steps: [
        "Select your Role: Choose to be the 'Coach' (to practice leading) or 'Coachee' (to practice self-reflection).",
        "Define Persona: Set specific demographics and professional challenges to simulate real workplace scenarios.",
        "Choose Framework: Select a model like GROW to guide the structure of the conversation.",
        "Interact: Engage in a natural conversation. The AI will react emotionally based on your approach.",
        "Evaluate: End the session to receive a detailed breakdown of your performance."
      ]
    },
    metrics: {
      title: "Evaluation Metrics",
      items: [
        { name: "Empathy & Rapport", desc: "Ability to build trust and acknowledge feelings." },
        { name: "Active Listening", desc: "Reflecting back what is heard, summarizing key points." },
        { name: "Powerful Questioning", desc: "Asking open-ended questions that provoke insight (Who, What, How, When)." },
        { name: "Goal Orientation", desc: "Moving the conversation towards a clear outcome or action plan." },
        { name: "Professionalism", desc: "Maintaining respectful and appropriate tone." }
      ]
    }
  },
  TH: {
    title: "คู่มือการใช้งานและหลักการประเมิน",
    objectives: {
      title: "วัตถุประสงค์",
      content: "Dr.LiveCoach ถูกออกแบบมาเพื่อสร้างพื้นที่ปลอดภัยให้บุคลากรได้ฝึกฝนทักษะการโค้ชและการสื่อสาร ช่วยเชื่อมโยงทฤษฎี (GROW, OSKAR) สู่การปฏิบัติจริงก่อนนำไปใช้กับทีมงาน"
    },
    howTo: {
      title: "แนวทางการใช้งาน",
      steps: [
        "เลือกบทบาท (Role): เป็น 'Coach' เพื่อฝึกทักษะผู้นำ หรือ 'Coachee' เพื่อฝึกการสำรวจตนเอง",
        "กำหนดตัวละคร (Persona): ระบุเพศ อายุ และปัญหาท้าทาย เพื่อจำลองสถานการณ์ให้สมจริง",
        "เลือกโมเดล (Framework): เลือกรูปแบบ เช่น GROW Model เพื่อวางโครงสร้างการสนทนา",
        "เริ่มสนทนา: พูดคุยอย่างเป็นธรรมชาติ AI จะตอบสนองทางอารมณ์ตามวิธีการที่คุณใช้",
        "ประเมินผล: กดจบเซสชั่นเพื่อรับรายงานวิเคราะห์จุดแข็งและจุดที่ต้องพัฒนา"
      ]
    },
    metrics: {
      title: "เกณฑ์การประเมินผล",
      items: [
        { name: "Empathy & Rapport", desc: "ความสามารถในการสร้างความไว้วางใจและการรับรู้อารมณ์" },
        { name: "Active Listening", desc: "การฟังเชิงรุก การทวนความ และการสรุปประเด็นสำคัญ" },
        { name: "Powerful Questioning", desc: "การใช้คำถามทรงพลัง (คำถามปลายเปิด) เพื่อกระตุ้นความคิด" },
        { name: "Goal Orientation", desc: "การนำพาบทสนทนาไปสู่เป้าหมายหรือแผนการลงมือทำที่ชัดเจน" },
        { name: "Professionalism", desc: "ความเป็นมืออาชีพและการรักษาบรรยากาศเชิงบวก" }
      ]
    }
  },
  CN: {
    title: "用户指南与评估方法",
    objectives: {
      title: "目标",
      content: "Dr.LiveCoach 旨在为专业人士提供一个安全、逼真的环境，用于练习教练和沟通技巧。它弥合了理论（GROW, OSKAR）与实际应用之间的差距。"
    },
    howTo: {
      title: "如何使用",
      steps: [
        "选择角色：选择成为“教练”（练习领导力）或“学员”（练习自我反思）。",
        "定义画像：设置具体的人口统计数据和职业挑战，以模拟真实的工作场景。",
        "选择框架：选择如 GROW 这样的模型来引导对话结构。",
        "互动：进行自然的对话。AI 将根据您的方法做出情感反应。",
        "评估：结束会话以接收详细的绩效分析报告。"
      ]
    },
    metrics: {
      title: "评估指标",
      items: [
        { name: "Empathy & Rapport", desc: "建立信任和感知情绪的能力。" },
        { name: "Active Listening", desc: "积极倾听，反馈所听到的内容，总结关键点。" },
        { name: "Powerful Questioning", desc: "提出引发洞察力的开放式问题（Who, What, How, When）。" },
        { name: "Goal Orientation", desc: "将对话引向明确的结果或行动计划。" },
        { name: "Professionalism", desc: "保持尊重和适当的语调。" }
      ]
    }
  }
};

export const TRANSLATIONS: Record<Language, any> = {
  EN: {
    title: "Dr.LiveCoach",
    subtitle: "Professional Coaching Simulator",
    setupTitle: "Simulation Setup",
    setupDesc: "Configure simulation parameters.",
    roleTitle: "Your Role",
    roleCoach: "Coach",
    roleCoachDesc: "Practice leadership skills",
    roleCoachee: "Coachee",
    roleCoacheeDesc: "Seek guidance",
    profileTitle: "Client Persona",
    gender: "Gender",
    age: "Age Range",
    profession: "Industry/Profession",
    position: "Current Position",
    topic: "The Topic / Challenge",
    topicPlaceholder: "Describe the specific challenge...",
    frameworkTitle: "Framework",
    startBtn: "Start Simulation",
    chatPlaceholder: "Type your message here...",
    endSession: "End Session",
    activeNow: "Active",
    evalTitle: "Session Evaluation",
    evalSub: "Performance Analysis for",
    newSession: "New Session",
    radarTitle: "Competency Radar",
    summaryTitle: "AI Executive Summary",
    scoreBreakdown: "Score Breakdown",
    strengths: "Key Strengths",
    improvements: "Areas for Development",
    actions: "Recommended Actions",
    demoMode: "Demo Mode",
    greetingCoach: "Hello. Thanks for making time. I've been feeling a bit stuck lately.",
    greetingCoachee: "Hello. I'm Dr.LiveCoach. What brings you here today?",
    analyzing: "Analyzing Performance...",
    analyzingDesc: "Generating comprehensive feedback report.",
    modeTitle: "Interaction Mode",
    modeText: "Text Chat",
    modeVoice: "Live Voice",
    connecting: "Connecting Securely...",
    listening: "Listening...",
    speaking: "Speaking...",
    micAccess: "Microphone access required.",
    liveError: "Connection interrupted.",
    historyTitle: "Coaching Journal",
    noHistory: "No saved sessions found.",
    viewBtn: "View Report",
    deleteBtn: "Delete",
    date: "Date",
    duration: "Duration",
    transcript: "Transcript",
    showTranscript: "Show Transcript",
    hideTranscript: "Hide Transcript",
    timeElapsed: "Elapsed",
    footerCopyright: "© 2025 Dr.Pattaroj Kamonrojsiri. All rights reserved.",
    guideBtn: "User Guide",
  },
  TH: {
    title: "Dr.LiveCoach",
    subtitle: "ระบบจำลองการโค้ชสำหรับมืออาชีพ",
    setupTitle: "ตั้งค่าการจำลอง",
    setupDesc: "กำหนดค่าสถานการณ์เพื่อเริ่มฝึกฝน",
    roleTitle: "บทบาทของคุณ",
    roleCoach: "โค้ช (Coach)",
    roleCoachDesc: "ฝึกทักษะผู้นำและการฟัง",
    roleCoachee: "ผู้รับการโค้ช (Coachee)",
    roleCoacheeDesc: "ปรึกษาปัญหาเพื่อหาทางออก",
    profileTitle: "ข้อมูลคู่สนทนา",
    gender: "เพศ",
    age: "ช่วงอายุ",
    profession: "สายงาน/อุตสาหกรรม",
    position: "ตำแหน่ง",
    topic: "หัวข้อหรือปัญหา",
    topicPlaceholder: "ระบุความท้าทายที่ต้องการปรึกษา...",
    frameworkTitle: "รูปแบบการโค้ช",
    startBtn: "เริ่มการจำลอง",
    chatPlaceholder: "พิมพ์ข้อความของคุณ...",
    endSession: "จบการสนทนา",
    activeNow: "กำลังใช้งาน",
    evalTitle: "ผลการประเมิน",
    evalSub: "วิเคราะห์ประสิทธิภาพสำหรับบทบาท",
    newSession: "เริ่มเซสชั่นใหม่",
    radarTitle: "สมรรถนะหลัก (Competencies)",
    summaryTitle: "บทสรุปจาก AI",
    scoreBreakdown: "คะแนนรายด้าน",
    strengths: "จุดแข็ง",
    improvements: "สิ่งที่ควรปรับปรุง",
    actions: "ข้อแนะนำเพื่อการพัฒนา",
    demoMode: "โหมดทดลอง",
    greetingCoach: "สวัสดีครับ/ค่ะ ขอบคุณที่สละเวลามาคุยกัน ช่วงนี้ผม/ฉันรู้สึกติดขัดและอยากขอคำปรึกษา",
    greetingCoachee: "สวัสดีครับ/ค่ะ ผมคือ Dr.LiveCoach วันนี้มีเรื่องอะไรให้ผมช่วยดูแลครับ?",
    analyzing: "กำลังประมวลผล...",
    analyzingDesc: "ระบบกำลังวิเคราะห์รูปแบบการสนทนาของคุณ",
    modeTitle: "รูปแบบการสื่อสาร",
    modeText: "แชทข้อความ",
    modeVoice: "สนทนาเสียง (Live)",
    connecting: "กำลังเชื่อมต่อ...",
    listening: "กำลังฟัง...",
    speaking: "กำลังพูด...",
    micAccess: "กรุณาอนุญาตให้ใช้ไมโครโฟน",
    liveError: "การเชื่อมต่อขัดข้อง",
    historyTitle: "บันทึกประวัติการโค้ช",
    noHistory: "ไม่พบประวัติการใช้งาน",
    viewBtn: "ดูผล",
    deleteBtn: "ลบ",
    date: "วันที่",
    duration: "เวลา",
    transcript: "บันทึกการสนทนา",
    showTranscript: "ดูบทสนทนา",
    hideTranscript: "ซ่อนบทสนทนา",
    timeElapsed: "เวลา",
    footerCopyright: "© 2025 Dr.Pattaroj Kamonrojsiri. All rights reserved.",
    guideBtn: "คู่มือการใช้งาน",
  },
  CN: {
    title: "Dr.LiveCoach",
    subtitle: "专业教练模拟系统",
    setupTitle: "模拟设置",
    setupDesc: "配置参数以开始训练",
    roleTitle: "您的角色",
    roleCoach: "教练 (Coach)",
    roleCoachDesc: "练习领导力和倾听技巧",
    roleCoachee: "学员 (Coachee)",
    roleCoacheeDesc: "寻求指导和解决方案",
    profileTitle: "客户资料",
    gender: "性别",
    age: "年龄",
    profession: "行业/职业",
    position: "职位",
    topic: "话题 / 挑战",
    topicPlaceholder: "描述具体的挑战...",
    frameworkTitle: "教练模型",
    startBtn: "开始模拟",
    chatPlaceholder: "输入您的消息...",
    endSession: "结束会话",
    activeNow: "在线",
    evalTitle: "会话评估",
    evalSub: "绩效分析：",
    newSession: "新会话",
    radarTitle: "能力雷达",
    summaryTitle: "AI 执行摘要",
    scoreBreakdown: "得分明细",
    strengths: "主要优势",
    improvements: "改进领域",
    actions: "建议行动",
    demoMode: "演示模式",
    greetingCoach: "你好。最近我感觉有点停滞不前，想找人聊聊。",
    greetingCoachee: "你好。我是 Dr.LiveCoach。今天有什么我可以帮你的吗？",
    analyzing: "正在分析...",
    analyzingDesc: "正在生成综合反馈报告。",
    modeTitle: "互动模式",
    modeText: "文字",
    modeVoice: "语音 (Live)",
    connecting: "连接中...",
    listening: "聆听中...",
    speaking: "说话中...",
    micAccess: "需要麦克风权限",
    liveError: "连接中断",
    historyTitle: "辅导日志",
    noHistory: "暂无记录",
    viewBtn: "查看",
    deleteBtn: "删除",
    date: "日期",
    duration: "时长",
    transcript: "文字记录",
    showTranscript: "显示记录",
    hideTranscript: "隐藏记录",
    timeElapsed: "用时",
    footerCopyright: "© 2025 Dr.Pattaroj Kamonrojsiri. All rights reserved.",
    guideBtn: "使用指南",
  }
};