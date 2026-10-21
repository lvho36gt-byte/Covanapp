// Gemini Service - calls backend proxy safely
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isFallback?: boolean;
}

export const checkServerHealth = async (): Promise<{ status: string; hasApiKey: boolean }> => {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch {
    return { status: 'offline', hasApiKey: false };
  }
};

export const sendChatToRobot = async (
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  subject?: string,
  topic?: string
): Promise<{ text: string; isLiveAi: boolean }> => {
  try {
    const res = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: messages.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          content: m.content,
        })),
        subject,
        currentTopic: topic,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return { text: data.reply, isLiveAi: true };
    }

    const errData = await res.json().catch(() => ({}));
    if (errData.error === 'NO_API_KEY') {
      return {
        text: `[CHẾ ĐỘ TRỢ GIÚP MẪU - Chưa có API Key trên máy chủ]\n\nChào bạn nhỏ! Robot Bạn Học khuyên bạn:\n1. Hãy đọc thật kỹ yêu cầu của bài toán hoặc đoạn văn.\n2. Xác định xem đề bài đã cho biết những gì và hỏi điều gì.\n3. Hãy thử làm từng bước một nhé. Bạn đang thấy khó ở bước nào nào?`,
        isLiveAi: false,
      };
    }

    throw new Error(errData.message || 'Lỗi kết nối máy chủ');
  } catch (error: any) {
    return {
      text: `[THÔNG BÁO KẾT NỐI: ${error?.message || 'Không thể liên lạc với máy chủ AI'}]\n\nRobot Bạn Học vẫn luôn đồng hành cùng bạn! Hãy tham khảo phần Khám phá bài học hoặc hỏi cô giáo Cẩm Vân trong giờ học nhé!`,
      isLiveAi: false,
    };
  }
};

export const generateQuestionsByAi = async (params: {
  subject: string;
  topic: string;
  cognitiveLevel: string;
  questionType: string;
  count: number;
  teacherNotes?: string;
}): Promise<{ questions: any[]; isLiveAi: boolean }> => {
  try {
    const res = await fetch('/api/gemini/generate-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (res.ok) {
      const data = await res.json();
      return { questions: data.questions || [], isLiveAi: true };
    }

    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || 'Không thể tạo tự động từ máy chủ');
  } catch (error: any) {
    console.warn('AI question generator fallback triggered:', error);
    // Return sample curated Grade 4 question for teacher review
    return {
      questions: [
        {
          question: `Cho biết giá trị của chữ số 5 trong số 354 892 thuộc hàng nào, lớp nào?`,
          type: 'multiple-choice',
          options: [
            'Hàng chục nghìn, lớp nghìn',
            'Hàng trăm nghìn, lớp triệu',
            'Hàng nghìn, lớp nghìn',
            'Hàng trăm, lớp đơn vị',
          ],
          correctAnswer: 'Hàng chục nghìn, lớp nghìn',
          explanation: 'Chữ số 5 đứng ở vị trí thứ 5 từ phải sang trái, tức là hàng chục nghìn, thuộc lớp nghìn.',
          cognitiveLevel: params.cognitiveLevel || 'Thông hiểu',
          objective: 'Nhận biết giá trị theo vị trí của chữ số trong số tự nhiên lớp 4.',
        },
      ],
      isLiveAi: false,
    };
  }
};
