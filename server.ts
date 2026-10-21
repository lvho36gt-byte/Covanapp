import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize GoogleGenAI server-side with telemetry User-Agent header
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    appName: 'AI ĐỒNG HÀNH – Lớp 4',
  });
});

// Endpoint: Chat with Robot Bạn Học AI
app.post('/api/gemini/chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const { messages, subject, currentTopic } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      res.status(503).json({
        error: 'NO_API_KEY',
        message: 'Chưa cấu hình GEMINI_API_KEY trên máy chủ. Đang bật chế độ Trợ giúp mẫu thông minh.',
      });
      return;
    }

    const systemInstruction = `Bạn là "Robot Bạn Học AI" - người bạn đồng hành thông minh, đáng yêu và kiên nhẫn của học sinh Lớp 4 (9-10 tuổi) theo chương trình GDPT 2018 tại Việt Nam (thuộc lớp cô Nguyễn Thị Cẩm Vân, Trường Tiểu học Khoái Châu 1).
QUY TẮC BẮT BUỘC CHO TRẺ EM LỚP 4:
1. KHÔNG BAO GIỜ giải hộ hay đưa thẳng đáp án bài tập!
2. Hãy dùng phương pháp gợi mở từng bước (scaffolding). Đưa ra ví dụ đơn giản tương tự trước.
3. Sau mỗi bước hướng dẫn ngắn gọn (2-3 câu), luôn đặt một câu hỏi nhỏ tương tác: "Bạn đã hiểu bước này chưa nè?" hoặc "Đố bạn bước tiếp theo ta làm gì?".
4. Dùng ngôn từ vui tươi, ấm áp, tích cực (xưng "tớ" hoặc "Robot Bạn Học", gọi học sinh là "bạn" hoặc "bạn nhỏ").
5. Môn học liên quan: ${subject || 'Tổng hợp lớp 4'}, chủ đề: ${currentTopic || 'Học tập'}.
6. Luôn khuyến khích học sinh tự suy nghĩ và nếu có băn khoăn hãy hỏi cô giáo Cẩm Vân.
7. Tuyệt đối không yêu cầu hoặc hỏi thông tin cá nhân của trẻ em.`;

    // Format chat messages
    const formattedContents = (messages || []).map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    if (formattedContents.length === 0) {
      formattedContents.push({
        role: 'user',
        parts: [{ text: 'Chào Robot Bạn Học AI!' }],
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'Tớ luôn ở đây để đồng hành cùng bạn! Bạn hãy thử nói rõ hơn câu hỏi nhé.';
    res.json({ reply });
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    res.status(500).json({
      error: 'API_ERROR',
      message: error?.message || 'Có lỗi xảy ra khi kết nối với AI. Hãy thử lại nhé!',
    });
  }
});

// Endpoint: AI Question Generator for Teacher Workshop (Xưởng Sáng Tạo Học Liệu)
app.post('/api/gemini/generate-questions', async (req: Request, res: Response): Promise<void> => {
  try {
    const { subject, topic, cognitiveLevel, questionType, count = 3, teacherNotes } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      res.status(503).json({
        error: 'NO_API_KEY',
        message: 'Chưa có GEMINI_API_KEY. Vui lòng sử dụng ngân hàng câu hỏi chuẩn có sẵn hoặc cấu hình API Key.',
      });
      return;
    }

    const prompt = `Bạn là chuyên gia thẩm định chương trình Tiểu học GDPT 2018 môn ${subject} Lớp 4.
Hãy biên soạn ${count} câu hỏi/bài tập chuẩn sư phạm cho chủ đề: "${topic}".
- Mức độ nhận thức: ${cognitiveLevel || 'Thông hiểu'} (theo 4 mức: Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao).
- Định dạng câu hỏi: ${questionType || 'Trắc nghiệm 4 lựa chọn'}.
${teacherNotes ? `- Yêu cầu thêm từ giáo viên: ${teacherNotes}` : ''}

Trả về DUY NHẤT một mảng JSON thuần túy (không kèm markdown ngoài JSON, hoặc đặt trong block json) theo cấu trúc:
[
  {
    "question": "Nội dung câu hỏi rõ ràng, chính xác, chuẩn lớp 4",
    "type": "multiple-choice" | "true-false" | "fill-blank" | "matching",
    "options": ["Lựa chọn A", "Lựa chọn B", "Lựa chọn C", "Lựa chọn D"],
    "correctAnswer": "Đáp án đúng (chuỗi văn bản hoặc chữ cái khớp lựa chọn)",
    "explanation": "Giải thích chi tiết, sư phạm, dễ hiểu cho học sinh lớp 4",
    "cognitiveLevel": "${cognitiveLevel || 'Thông hiểu'}",
    "objective": "Mục tiêu đạt được theo chuẩn GDPT 2018"
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });

    const jsonText = response.text || '[]';
    let parsed = [];
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      // Fallback clean if surrounded by ```json ... ```
      const cleaned = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleaned);
    }

    res.json({ questions: parsed });
  } catch (error: any) {
    console.error('Gemini question generation error:', error);
    res.status(500).json({
      error: 'GENERATION_ERROR',
      message: error?.message || 'Không thể tạo câu hỏi lúc này.',
    });
  }
});

// Setup Vite or static serving
async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${port} in ${isProd ? 'production' : 'development'} mode`);
  });
}

startServer().catch((err) => {
  console.error('Error starting server:', err);
});
