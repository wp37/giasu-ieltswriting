# IELTS Writing Tool - Architecture & Design Document

## 🏗️ Kiến trúc tổng quan

### Technology Stack
```
Frontend:
├── React 19.2.0 (UI Framework)
├── Vite 7.2.4 (Build Tool)
├── React Router DOM 7.13.0 (Routing)
├── i18next 25.8.4 (Internationalization)
├── Axios 1.13.4 (HTTP Client)
└── Lucide React 0.563.0 (Icons)

API Integration:
├── Gemini API (Direct REST calls)
└── Client-side API key management

Deployment:
└── Vercel (Static Hosting + SPA routing)
```

## 📐 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │                  React Application                  │    │
│  │                                                     │    │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────┐ │    │
│  │  │   UI Layer  │  │ Service Layer│  │ Storage  │ │    │
│  │  │             │  │              │  │          │ │    │
│  │  │ - App.jsx   │  │ - geminiSvc  │  │localStorage│    │
│  │  │ - Modals    │  │ - apiKeySvc  │  │          │ │    │
│  │  │ - Error UI  │  │ - eduSvc     │  │ API Key  │ │    │
│  │  └─────────────┘  └──────────────┘  └──────────┘ │    │
│  └────────────────────────────────────────────────────┘    │
│                          │                                  │
│                          │ HTTPS                           │
│                          ▼                                  │
│  ┌────────────────────────────────────────────────────┐    │
│  │           Google Generative AI API                  │    │
│  │                                                     │    │
│  │  ┌─────────────────────────────────────────────┐  │    │
│  │  │  Models (with Fallback):                    │  │    │
│  │  │  1. gemini-3-flash-preview   (Default)      │  │    │
│  │  │  2. gemini-3-pro-preview     (Fallback 1)   │  │    │
│  │  │  3. gemini-2.5-flash         (Fallback 2)   │  │    │
│  │  └─────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## 🔑 API Key Management Flow

```
┌──────────┐
│  Start   │
└────┬─────┘
     │
     ▼
┌─────────────────┐
│ Check localStorage│
│ for API Key      │
└────┬─────┬──────┘
     │     │
 Found│    │Not Found
     │     │
     ▼     ▼
┌─────┐  ┌──────────────┐
│Load │  │Show API Key  │
│Key  │  │Modal (Force) │
└──┬──┘  └──────┬───────┘
   │            │
   │            ▼
   │     ┌──────────────┐
   │     │User Inputs:  │
   │     │- API Key     │
   │     │- Model Select│
   │     └──────┬───────┘
   │            │
   │            ▼
   │     ┌──────────────┐
   │     │Validate Key  │
   │     │(starts AIza?)│
   │     └──────┬───────┘
   │            │
   │     Valid  │
   └─────┬──────┘
         │
         ▼
  ┌──────────────┐
  │Save to       │
  │localStorage  │
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │Set API Key in│
  │geminiService │
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │Ready to Use  │
  └──────────────┘
```

## 🔄 Request Flow with Fallback Mechanism

```
┌──────────────┐
│User Request  │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────┐
│ geminiService.callWithRetry()        │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ Attempt 1: gemini-3-flash-preview    │
│ (Default Model)                      │
└──────┬───────────────┬───────────────┘
       │               │
   Success│         Failure│
       │               │
       ▼               ▼
┌──────────┐   ┌──────────────────────────────┐
│Return    │   │Check Error Type:             │
│Result    │   │- 429 RESOURCE_EXHAUSTED?     │
└──────────┘   │- 503 UNAVAILABLE?            │
               │- Other retryable errors?     │
               └──────┬───────────────────────┘
                      │
                 Retryable│
                      │
                      ▼
               ┌──────────────────────────────┐
               │ Attempt 2: gemini-3-pro-preview│
               │ (Fallback Model 1)            │
               └──────┬───────────┬────────────┘
                      │           │
                  Success│     Failure│
                      │           │
                      ▼           ▼
               ┌──────────┐   ┌──────────────────────────┐
               │Return    │   │ Attempt 3: gemini-2.5-flash│
               │Result    │   │ (Fallback Model 2)        │
               └──────────┘   └──────┬──────────┬─────────┘
                                     │          │
                                 Success│   Failure│
                                     │          │
                                     ▼          ▼
                              ┌──────────┐  ┌──────────────┐
                              │Return    │  │All Models    │
                              │Result    │  │Failed - Show │
                              └──────────┘  │Error UI      │
                                            └──────────────┘
```

## 🎨 Component Architecture

### Component Tree
```
App
├── Header
│   ├── Logo & Title
│   ├── Settings Button
│   ├── API Key Warning (conditional)
│   └── Model Indicator (conditional)
│
├── Main Content
│   ├── Empty State (no API key)
│   └── Content Wrapper (has API key)
│       ├── Writing Interface
│       ├── Evaluation Panel
│       └── Error Display (conditional)
│
└── Modals
    ├── ApiKeyModal
    │   ├── API Key Input
    │   ├── Model Selection Cards
    │   └── Help Links
    │
    └── ErrorDisplay
        ├── Error Type Badge
        ├── Current Model Info
        ├── Failed Models List
        ├── Technical Details
        └── Retry/Help Actions
```

## 🗂️ Service Layer Design

### 1. apiKeyService.js
```javascript
Responsibilities:
- Save/Get API key from localStorage
- Validate API key format
- Save/Get selected model
- Clear API key

Methods:
- saveApiKey(key)
- getApiKey()
- hasApiKey()
- removeApiKey()
- saveSelectedModel(model)
- getSelectedModel()
```

### 2. geminiService.js
```javascript
Responsibilities:
- Make API calls to Gemini
- Handle retry logic
- Manage model fallback
- Parse API responses

Methods:
- setApiKey(key)
- getCurrentModel()
- tryNextModel()
- resetToDefaultModel()
- callWithRetry(prompt, options)
- makeApiCall(model, prompt, options)
- isRetryableError(error)
- evaluateEssay(params)
```

### 3. educationService.js
```javascript
Responsibilities:
- Provide learning paths
- Generate personalized tips
- Create practice exercises
- Build study plans

Methods:
- getLearningPath(level)
- getPersonalizedTips(evaluation)
- getPracticeExercises(evaluation)
- getStudyPlan(current, target, weeks)
```

## 📊 Data Flow

### Essay Evaluation Flow
```
1. User writes essay
   ↓
2. Click "Evaluate"
   ↓
3. geminiService.evaluateEssay({
     essay: text,
     taskType: 'task1' | 'task2',
     taskSubType: 'academic' | 'gt' | 'opinion',
     topic: string,
     wordCount: number
   })
   ↓
4. API Call with Retry
   ↓
5. Parse JSON Response
   ↓
6. Display Results:
   - Overall Band Score
   - Task Achievement
   - Coherence & Cohesion
   - Lexical Resource
   - Grammatical Range
   ↓
7. Generate Personalized Tips
   (via educationService)
   ↓
8. Show Practice Recommendations
```

## 🎯 State Management

### App Level State
```javascript
const [showApiKeyModal, setShowApiKeyModal] = useState(false)
const [hasApiKey, setHasApiKey] = useState(false)
const [currentModel, setCurrentModel] = useState('')
const [isProcessing, setIsProcessing] = useState(false)
const [error, setError] = useState('')
```

### ApiKeyModal State
```javascript
const [apiKey, setApiKey] = useState('')
const [selectedModel, setSelectedModel] = useState('')
const [showKey, setShowKey] = useState(false)
const [error, setError] = useState('')
```

### ErrorDisplay State
```javascript
const [showDetails, setShowDetails] = useState(false)
```

## 🔒 Security Considerations

### API Key Storage
- ✅ Stored in localStorage (client-side only)
- ✅ Never sent to any backend server
- ✅ User owns their own API key
- ✅ Can be deleted anytime

### API Communication
- ✅ HTTPS only
- ✅ Direct browser → Google AI API
- ✅ No proxy/middleware
- ✅ CORS handled by Google

## 🚀 Deployment Strategy

### Build Process
```bash
1. npm install          # Install dependencies
2. npm run build        # Build for production
3. Output to dist/      # Static files
```

### Vercel Configuration
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### Environment Variables
```
No environment variables needed!
All configuration is client-side via localStorage.
```

## 📈 Performance Optimization

### Code Splitting
- React lazy loading for routes
- Dynamic imports for heavy components

### Caching Strategy
- API responses cached during session
- Model preferences persisted
- No server-side caching needed

### Bundle Size
- Tree shaking enabled (Vite)
- CSS modules for styling
- Minimal dependencies

## 🧪 Testing Strategy

### Manual Testing Checklist
```
□ API Key Modal
  □ Shows on first visit
  □ Validates API key format
  □ Saves to localStorage
  □ Can be reopened from Settings

□ Model Selection
  □ All 3 models displayed
  □ Can select different models
  □ Selection persists

□ Error Handling
  □ Shows error for invalid key
  □ Retry with fallback models
  □ Clear error messages
  □ Help links work

□ Deployment
  □ Vercel build succeeds
  □ SPA routing works
  □ Assets load correctly
```

## 📱 Responsive Design

### Breakpoints
```css
Mobile:    < 640px
Tablet:    640px - 1024px
Desktop:   > 1024px
```

### Mobile Optimizations
- Touch-friendly buttons
- Full-width modals
- Simplified navigation
- Readable font sizes

## 🎓 Education Integration

### Learning Modules Structure
```
Level: Beginner / Intermediate / Advanced
  ├── Modules (3-5 per level)
  │   ├── Topics (4-6 per module)
  │   └── Resources
  ├── Focus Areas
  └── Recommended Practices
```

### Personalization Engine
```
Input: Essay Evaluation
  ↓
Analyze Weak Areas:
  - Task Achievement < 6.5?
  - Coherence < 6.5?
  - Vocabulary < 6.5?
  - Grammar < 6.5?
  ↓
Generate:
  - Personalized Tips (high priority first)
  - Practice Exercises (targeted)
  - Study Plan (time-based)
  ↓
Output: Actionable Recommendations
```

## 🔮 Future Enhancements

### Phase 2 Features
- [ ] Save essay history
- [ ] Track progress over time
- [ ] Vocabulary flashcards
- [ ] Grammar exercises
- [ ] Speaking practice integration

### Phase 3 Features
- [ ] Real-time collaboration
- [ ] Teacher/Student roles
- [ ] Batch essay evaluation
- [ ] Advanced analytics
- [ ] Mobile app (React Native)

---

**Architecture Version**: 1.0.0
**Last Updated**: February 2026
**Status**: Production Ready
