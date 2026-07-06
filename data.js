/**
 * Default mock data database for Cosmic English AI
 */

const DEFAULT_POSTS = [
  {
    "id": "post-1",
    "title": "Làm chủ ChatGPT để cải thiện kỹ năng Viết tiếng Anh công sở",
    "category": "AI Prompts",
    "summary": "Hướng dẫn chi tiết cách viết prompt giúp ChatGPT chỉnh sửa email, báo cáo chuyên nghiệp theo văn phong bản xứ.",
    "content": "### 1. Vấn đề của người học\nKhi viết email công sở, chúng ta thường dịch word-by-word từ tiếng Việt sang tiếng Anh dẫn đến câu cú lủng củng và thiếu tự nhiên. ChatGPT có thể giải quyết vấn đề này nếu bạn biết cách đưa ngữ cảnh.\n\n### 2. Phương pháp giải quyết với AI\nThay vì chỉ dùng prompt đơn giản như 'correct my email', hãy phân vai và cấu trúc hóa mong muốn của bạn.\n\n### 3. Thực hành\nHãy sử dụng Prompt mẫu dưới đây để bắt đầu thực hành chỉnh sửa email của bạn.",
    "ai_prompt": "Act as a professional English Editor. I will provide you with a draft email written by a non-native speaker. Your task is to:\n1. Rewrite the email in a polite, professional, and natural corporate tone.\n2. Keep the core message unchanged.\n3. List 3 key grammar/vocabulary improvements you made in a table format.\n\nDraft Email: [Dán email của bạn vào đây]",
    "created_at": "2026-06-25T08:00:00Z",
    "status": "Published"
  },
  {
    "id": "post-2",
    "title": "Học từ vựng IELTS theo ngữ cảnh với Claude 3.5 Sonnet",
    "category": "Methods",
    "summary": "Phương pháp tự động hóa việc tạo danh sách từ vựng IELTS Band 7.0+ theo chủ đề yêu thích bằng Claude.",
    "content": "### 1. Tại sao học từ vựng chay không hiệu quả?\nHọc từ vựng theo danh sách rời rạc khiến bạn nhanh quên và không biết cách dùng từ trong câu thực tế.\n\n### 2. Giải pháp ứng dụng AI\nClaude 3.5 Sonnet nổi bật với khả năng viết văn phong rất tự nhiên. Chúng ta sẽ yêu cầu Claude viết một bài đọc ngắn theo chủ đề mong muốn, sau đó bóc tách từ vựng.",
    "ai_prompt": "Write a 150-word essay about 'Climate Change' using at least 5 IELTS Band 7.5+ vocabulary words. Underline those words.\nAfter the essay, provide a table containing:\n- The word\n- Its phonetic spelling\n- Vietnamese translation\n- A new example sentence showing how it is used in a business context.",
    "created_at": "2026-06-26T09:30:00Z",
    "status": "Published"
  },
  {
    "id": "post-3",
    "title": "Top 3 Công cụ AI luyện nói tiếng Anh miễn phí tốt nhất 2026",
    "category": "AI Tools Review",
    "summary": "Đánh giá chi tiết các công cụ AI hỗ trợ luyện nói (Speaking) tại nhà không cần người hướng dẫn.",
    "content": "### 1. ChatGPT Voice Mode\nTính năng đàm thoại trực tiếp bằng giọng nói của ChatGPT giúp bạn giao tiếp như với người thật.\n\n### 2. Talkpal AI\nỨng dụng chuyên biệt cho luyện nói ngoại ngữ với các tình huống giả lập thực tế.\n\n### 3. Elsa Speak (AI Speech Analyzer)\nPhân tích chi tiết khẩu hình, phát âm và đề xuất cải thiện chuẩn xác.",
    "ai_prompt": "Không có Prompt đi kèm cho bài viết Review. Hãy cài đặt ứng dụng trên điện thoại để trải nghiệm trực tiếp.",
    "created_at": "2026-06-27T10:15:00Z",
    "status": "Published"
  },
  {
    "id": "post-4",
    "title": "Prompt sửa lỗi ngữ pháp học thuật (Academic Writing Correction)",
    "category": "Grammar",
    "summary": "Nhận phân tích chi tiết lỗi sai ngữ pháp kèm giải thích lý thuyết trực quan để tránh lặp lại lỗi.",
    "content": "### 1. Giới thiệu\nKhi viết luận hoặc báo cáo học thuật, việc mắc lỗi ngữ pháp nhỏ có thể làm giảm uy tín của bài viết. Prompt này biến AI thành một giáo viên dạy viết nghiêm khắc.\n\n### 2. Cách vận hành\nAI sẽ không chỉ đưa ra bản sửa đổi mà sẽ phân tích từng lỗi sai để bạn rút kinh nghiệm.",
    "ai_prompt": "Review and correct the grammar of the following text. For each error found:\n- Identify the original error.\n- Provide the corrected version.\n- Explain the grammar rule in Vietnamese.\n- Give a correct example of that rule.\n\nText: [Dán đoạn văn học thuật của bạn vào đây]",
    "created_at": "2026-06-28T14:20:00Z",
    "status": "Published"
  },
  {
    "id": "post-5",
    "title": "Ứng dụng phương pháp Active Recall bằng AI để học từ vựng",
    "category": "Methods",
    "summary": "Biến ChatGPT thành đối tác học tập, chủ động hỏi và chấm điểm câu trả lời của bạn thay vì chỉ học thụ động.",
    "content": "### 1. Active Recall là gì?\nLà phương pháp chủ động truy xuất thông tin từ não bộ, giúp ghi nhớ sâu hơn gấp nhiều lần so với đọc đi đọc lại.\n\n### 2. Biến AI thành người khảo thí\nSử dụng Prompt để ChatGPT đóng vai giáo khảo hỏi từ vựng.",
    "ai_prompt": "I want to practice active recall for the following 5 vocabulary words: [Từ 1, Từ 2, Từ 3, Từ 4, Từ 5].\nAct as an English quizmaster. Ask me one word at a time in Vietnamese, and wait for me to write the English translation and an example sentence. After I reply, grade my answer (1-10) and then ask the next word.",
    "created_at": "2026-06-29T11:00:00Z",
    "status": "Published"
  }
];

const DEFAULT_USERS = [
  { "username": "admin", "password": "admin", "role": "Admin" },
  { "username": "user", "password": "123", "role": "User" }
];
