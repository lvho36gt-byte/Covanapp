import React, { useState, useRef, useEffect } from 'react';
import { RobotMascot } from '../components/RobotMascot';
import { sendChatToRobot, ChatMessage } from '../services/geminiService';
import { soundManager } from '../services/soundEffects';
import { Send, Sparkles, Bot, Trash2, ShieldCheck, Volume2, HelpCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RobotTutorPage: React.FC = () => {
  const { student } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      role: 'assistant',
      content: `Chào ${student.name}! Tớ là Robot Bạn Học AI - người bạn đồng hành của bạn tại Trường Tiểu học Khoái Châu 1.\n\nTớ có thể giúp bạn gợi ý từng bước giải bài tập, giải thích các khái niệm môn Toán, Tiếng Việt, Khoa học hoặc cùng bạn luyện tập. Bạn đang băn khoăn bài nào thế?`,
      timestamp: 'Vừa xong',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'Tớ chưa hiểu cách so sánh hai số có 6 chữ số 🔢',
    'Làm sao để tìm được danh từ trong câu văn? 📚',
    'Vì sao nước lại bay hơi lên trời thành mây? ☁️',
    'Đố tớ một câu đố toán vui có lời văn đi! 🧩',
    'Gợi ý tớ cách viết đoạn văn miêu tả cây nhãn lồng 🌳',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    soundManager.playClick();
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputValue('');
    setIsLoading(true);

    try {
      const { text: replyText, isLiveAi } = await sendChatToRobot(
        newHistory.map(m => ({ role: m.role, content: m.content })),
        'Toán và Tiếng Việt Lớp 4',
        'Tổng hợp'
      );

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        isFallback: !isLiveAi,
      };

      setMessages(prev => [...prev, botMsg]);
      soundManager.playCorrect();
    } catch {
      // Fallback
      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: 'Tớ gặp chút gián đoạn kết nối. Bạn hãy thử hỏi lại hoặc trao đổi thêm với cô Cẩm Vân trong giờ học nhé!',
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          isFallback: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Phân hệ 4 • Trợ lý AI học tập
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mt-1 flex items-center gap-2">
            <span>Robot Bạn Học AI</span>
            <span className="text-sm font-bold bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full border border-teal-200">
              Đồng hành 24/7
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Trợ lý AI sư phạm: Không giải hộ, hướng dẫn từng bước và khuyến khích em tự suy nghĩ!
          </p>
        </div>

        <button
          onClick={() => {
            if (window.confirm('Xóa đoạn hội thoại và bắt đầu trò chuyện mới?')) {
              setMessages([
                {
                  id: 'm-reset',
                  role: 'assistant',
                  content: `Chào ${student.name}! Bạn muốn cùng tớ khám phá điều gì tiếp theo nè?`,
                  timestamp: 'Vừa xong',
                },
              ]);
            }
          }}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl transition-colors font-medium"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Làm mới đoạn chat</span>
        </button>
      </div>

      {/* Safety Notice Card */}
      <div className="bg-sky-50/70 border border-sky-200 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs text-sky-900">
        <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Nguyên tắc vàng AI Tiểu học:</strong> Robot Bạn Học không đưa ngay đáp án toàn bài tập mà sẽ gợi ý từng bước. Hãy trao đổi với cô giáo Cẩm Vân khi em cần hướng dẫn sâu hơn nhé!
        </p>
      </div>

      {/* Main Chat Box */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[540px] overflow-hidden">
        {/* Chat Messages List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map(msg => {
            const isBot = msg.role === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
              >
                {isBot && (
                  <div className="shrink-0">
                    <RobotMascot size="sm" expression="happy" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-3xl text-xs sm:text-sm leading-relaxed space-y-2 shadow-xs ${
                    isBot
                      ? 'bg-slate-50 text-slate-800 border border-slate-200/80 rounded-tl-xs'
                      : 'bg-blue-600 text-white rounded-tr-xs'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.content}</div>

                  <div className={`flex items-center justify-between text-[10px] pt-1 border-t ${
                    isBot ? 'border-slate-200/60 text-slate-400' : 'border-blue-500 text-blue-200'
                  }`}>
                    <span>{msg.timestamp}</span>

                    {isBot && (
                      <div className="flex items-center gap-2">
                        {msg.isFallback && (
                          <span className="text-amber-600 font-bold bg-amber-50 px-1.5 py-0.2 rounded">
                            Chế độ mẫu
                          </span>
                        )}
                        <button
                          onClick={() => speakText(msg.content)}
                          className="hover:text-blue-600 transition-colors p-0.5"
                          title="Đọc to câu trả lời"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {!isBot && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center text-sm font-bold text-blue-800 shrink-0">
                    👦
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start gap-3">
              <RobotMascot size="sm" expression="thinking" />
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-3xl rounded-tl-xs text-xs text-slate-500 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]"></div>
                <span>Robot Bạn Học đang suy nghĩ gợi ý cho bạn...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Bar */}
        <div className="border-t border-slate-100 bg-slate-50/60 p-2.5 px-4 overflow-x-auto no-scrollbar flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap">
            Gợi ý nhanh:
          </span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              disabled={isLoading}
              className="text-xs bg-white hover:bg-sky-50 border border-slate-200 text-slate-700 font-medium px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors shadow-2xs hover:border-sky-300"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Nhập câu hỏi hoặc bài tập bạn muốn hỏi Robot..."
            className="flex-1 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-800 outline-none transition-all"
          />

          <button
            onClick={() => handleSend()}
            disabled={isLoading || !inputValue.trim()}
            className="p-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-2xl shadow-md transition-all active:scale-95"
            title="Gửi câu hỏi"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
