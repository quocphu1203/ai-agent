# AI House Exterior Design Assistant

Smart AI-powered house exterior design application using the **@openai/agents** framework.

## 🌟 Key Features

- **House Image Analysis**: Upload images and AI will analyze architecture and style
- **Improvement Suggestions**: AI provides 3-4 specific exterior improvement suggestions
- **Illustrative Images**: Each suggestion comes with illustrative images
- **Complete Image Generation**: Combines original image with suggestions to create final result
- **Expert Assistant**: In-depth consultation with cost and time estimates

## 🤖 AI Agents

The application uses the **@openai/agents** framework with specialized agents:

1. **House Analysis Agent**: Analyzes images and provides suggestions
2. **Image Generator Agent**: Creates complete images from suggestions
3. **Expert Assistant Agent**: Provides in-depth consultation with detailed information

## 🚀 Installation and Setup

### 1. Clone and install dependencies

```bash
git clone <your-repo>
cd ai-agent
npm install
```

### 2. Environment configuration

Create a `.env.local` file:

```bash
# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Next.js Environment  
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Run the application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📱 How to Use

### Step 1: Upload house image
- Drag and drop image into upload area or click "Choose file"
- Supports JPG, PNG, GIF formats

### Step 2: Analysis
- Click "Analyze House"
- AI will analyze and display information about:
  - Architectural description
  - House style
  - Current condition

### Step 3: Select suggestions
- View list of improvement suggestions
- Each suggestion has illustrative image and reasoning
- Click to select preferred suggestion

### Step 4: Generate complete image
- Click "Generate Complete Image"
- AI will create image of house after applying improvements
- Compare before and after images
- Download results

## 🔧 API Endpoints

### `/api/analyze-house`
**POST** - Analyze house image

Request:
```json
{
  "imageUrl": "data:image/jpeg;base64,..."
}
```

Response:
```json
{
  "description": "House description",
  "style": "Architectural style",
  "condition": "Condition",
  "suggestions": [
    {
      "id": "unique_id",
      "title": "Suggestion title",
      "description": "Detailed description",
      "imageUrl": "Illustrative image URL",
      "reasoning": "Reasoning for suggestion"
    }
  ]
}
```

### `/api/generate-final`
**POST** - Generate complete image

Request:
```json
{
  "originalImage": "data:image/jpeg;base64,..%",
  "suggestion": {
    "id": "suggestion_id",
    "title": "Selected suggestion",
    "description": "Suggestion description"
  }
}
```

Response:
```json
{
  "finalImageUrl": "Final image URL",
  "appliedSuggestion": {...},
  "success": true
}
```

### `/api/generate-final-assistant`
**POST** - Expert Assistant with detailed information

Request:
```json
{
  "imageUrl": "data:image/jpeg;base64,...",
  "userQuestion": "Specific question (optional)"
}
```

Response includes additional:
- `estimatedCost`: Cost estimate
- `timeRequired`: Implementation time
- `environmentalImpact`: Environmental impact
- `energyEfficiency`: Energy efficiency

## 🛠 Technologies Used

- **Framework**: Next.js 15 with App Router
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
- **Role**: Architecture and design expert
- **Task**: Analyze images and provide suggestions
- **Model**: GPT-4o with vision capabilities

### Image Generator Agent  
- **Role**: Image generation and visual design expert
- **Task**: Create detailed descriptions for improvement images
- **Model**: GPT-4o

### Expert Assistant Agent
- **Role**: In-depth consultant
- **Task**: Comprehensive analysis with cost, time information
- **Model**: GPT-4o with enhanced instructions

## 📝 Development

### Adding new Agent

1. Create Agent in API route:
```typescript
const newAgent = new Agent({
  name: "Agent Name",
  instructions: "Agent instructions...",
  model: "gpt-4o"
});
```

2. Use in API:
```typescript
const result = await run(newAgent, userInput);
```

### Customize UI

Components are organized in `/app/components/`:
- `ImageUpload.tsx` - Image upload
- `AnalysisDisplay.tsx` - Analysis display  
- `SuggestionsList.tsx` - Suggestions list
- `FinalResult.tsx` - Final results

## 📄 License

MIT License
