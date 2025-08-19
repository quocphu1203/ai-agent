# AI House Exterior Design Assistant

Ứng dụng AI thiết kế ngoại thất nhà thông minh sử dụng **@openai/agents** framework.

## 🌟 Tính năng chính

- **Phân tích ảnh ngôi nhà**: Upload ảnh và AI sẽ phân tích kiến trúc, phong cách
- **Đề xuất cải thiện**: AI đưa ra 3-4 đề xuất cải thiện ngoại thất cụ thể
- **Hình ảnh minh họa**: Mỗi đề xuất đi kèm ảnh minh họa
- **Tạo ảnh hoàn chỉnh**: Kết hợp ảnh gốc với đề xuất tạo ra ảnh cuối
- **Expert Assistant**: Tư vấn chuyên sâu với ước tính chi phí và thời gian

## 🤖 AI Agents

Ứng dụng sử dụng **@openai/agents** framework với các agent chuyên biệt:

1. **House Analysis Agent**: Phân tích ảnh và đưa ra đề xuất
2. **Image Generator Agent**: Tạo ảnh hoàn chỉnh từ đề xuất
3. **Expert Assistant Agent**: Tư vấn chuyên sâu với thông tin chi tiết

## 🚀 Cài đặt và chạy

### 1. Clone và cài đặt dependencies

```bash
git clone <your-repo>
cd ai-agent
npm install
```

### 2. Cấu hình environment

Tạo file `.env.local`:

```bash
# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Next.js Environment  
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Chạy ứng dụng

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## 📱 Cách sử dụng

### Bước 1: Upload ảnh ngôi nhà
- Kéo thả ảnh vào vùng upload hoặc click "Chọn file"
- Hỗ trợ định dạng JPG, PNG, GIF

### Bước 2: Phân tích
- Click "Phân tích ngôi nhà"
- AI sẽ phân tích và hiển thị thông tin về:
  - Mô tả kiến trúc
  - Phong cách nhà
  - Tình trạng hiện tại

### Bước 3: Chọn đề xuất
- Xem danh sách đề xuất cải thiện
- Mỗi đề xuất có ảnh minh họa và lý do
- Click để chọn đề xuất ưa thích

### Bước 4: Tạo ảnh hoàn chỉnh
- Click "Tạo ảnh hoàn chỉnh"
- AI sẽ tạo ảnh ngôi nhà sau khi áp dụng cải thiện
- So sánh ảnh trước và sau
- Tải xuống kết quả

## 🔧 API Endpoints

### `/api/analyze-house`
**POST** - Phân tích ảnh ngôi nhà

Request:
```json
{
  "imageUrl": "data:image/jpeg;base64,..."
}
```

Response:
```json
{
  "description": "Mô tả ngôi nhà",
  "style": "Phong cách kiến trúc",
  "condition": "Tình trạng",
  "suggestions": [
    {
      "id": "unique_id",
      "title": "Tiêu đề đề xuất",
      "description": "Mô tả chi tiết",
      "imageUrl": "URL ảnh minh họa",
      "reasoning": "Lý do đề xuất"
    }
  ]
}
```

### `/api/generate-final`
**POST** - Tạo ảnh hoàn chỉnh

Request:
```json
{
  "originalImage": "data:image/jpeg;base64,..%",
  "suggestion": {
    "id": "suggestion_id",
    "title": "Đề xuất được chọn",
    "description": "Mô tả đề xuất"
  }
}
```

Response:
```json
{
  "finalImageUrl": "URL ảnh cuối",
  "appliedSuggestion": {...},
  "success": true
}
```

### `/api/generate-final-assistant`
**POST** - Expert Assistant với thông tin chi tiết

Request:
```json
{
  "imageUrl": "data:image/jpeg;base64,...",
  "userQuestion": "Câu hỏi cụ thể (optional)"
}
```

Response bao gồm thêm:
- `estimatedCost`: Ước tính chi phí
- `timeRequired`: Thời gian thực hiện
- `environmentalImpact`: Tác động môi trường
- `energyEfficiency`: Hiệu quả năng lượng

## 🛠 Công nghệ sử dụng

- **Framework**: Next.js 15 với App Router
- **AI**: @openai/agents framework  
- **UI**: React 19 + Tailwind CSS
- **Language**: TypeScript
- **Image Processing**: Next.js Image component
- **API**: Next.js API Routes

## 🔄 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │───▶│   API Routes    │───▶│  OpenAI Agents  │
│  (React/Next)   │    │  (Next.js API)  │    │   Framework     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                        │                        │
        ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Components    │    │   Route Logic   │    │   AI Analysis   │
│ - ImageUpload   │    │ - Image Analysis│    │ - House Expert  │
│ - Analysis      │    │ - Final Generate│    │ - Design Gen    │
│ - Suggestions   │    │ - Expert Assist │    │ - Multi-Agent   │
│ - FinalResult   │    └─────────────────┘    └─────────────────┘
└─────────────────┘
```

## 🎯 Agent System

### House Analysis Agent
- **Vai trò**: Chuyên gia kiến trúc và thiết kế
- **Nhiệm vụ**: Phân tích ảnh và đưa ra đề xuất
- **Model**: GPT-4o với vision capabilities

### Image Generator Agent  
- **Vai trò**: Chuyên gia tạo ảnh và visual design
- **Nhiệm vụ**: Tạo mô tả chi tiết cho ảnh cải thiện
- **Model**: GPT-4o

### Expert Assistant Agent
- **Vai trò**: Tư vấn viên chuyên sâu 
- **Nhiệm vụ**: Phân tích toàn diện với chi phí, thời gian
- **Model**: GPT-4o với enhanced instructions

## 📝 Development

### Thêm Agent mới

1. Tạo Agent trong API route:
```typescript
const newAgent = new Agent({
  name: "Agent Name",
  instructions: "Agent instructions...",
  model: "gpt-4o"
});
```

2. Sử dụng trong API:
```typescript
const result = await run(newAgent, userInput);
```

### Customize UI

Components được tổ chức trong `/app/components/`:
- `ImageUpload.tsx` - Upload ảnh
- `AnalysisDisplay.tsx` - Hiển thị phân tích  
- `SuggestionsList.tsx` - Danh sách đề xuất
- `FinalResult.tsx` - Kết quả cuối

## 📄 License

MIT License
