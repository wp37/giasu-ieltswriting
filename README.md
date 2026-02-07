# IELTS Writing Tool - Education AI Platform

> Professional IELTS Writing evaluation platform powered by **Google Gemini AI** with intelligent model fallback and comprehensive education features.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-19.2.0-61dafb.svg)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646cff.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🎯 Description

IELTS Writing Tool is an intelligent platform that helps students improve their IELTS Writing skills through AI-powered evaluation and personalized learning paths. The system uses Google Gemini AI with automatic fallback mechanisms to ensure reliable service, while giving users full control over their API keys.

## ✨ Key Features

### 🔑 Smart API Key Management
- **User-Controlled**: Users provide their own Gemini API keys
- **Secure Storage**: Keys stored safely in browser localStorage
- **Easy Configuration**: Simple modal for API key and model selection
- **Always Accessible**: Settings button always visible for key updates

### 🤖 Intelligent AI Integration
- **Multiple Models**: Support for 3 Gemini models
  - `gemini-3-flash-preview` (Default - Fast & Efficient)
  - `gemini-3-pro-preview` (Pro - Detailed & Accurate)
  - `gemini-2.5-flash` (Stable - Reliable)
- **Automatic Fallback**: Seamlessly switches models on errors
- **Smart Retry**: Automatically retries with alternative models
- **Error Recovery**: Handles quota limits and API errors gracefully

### 🎯 Comprehensive Error Handling
- **Clear Messages**: Detailed error information with solutions
- **Visual Feedback**: Color-coded error types (Quota vs General)
- **Retry Mechanism**: One-click retry with next available model
- **Helpful Guidance**: Direct links to resolve common issues

### 🎓 Education System
- **Learning Paths**: Beginner, Intermediate, Advanced levels
- **Personalized Tips**: Based on essay evaluation results
- **Practice Exercises**: Targeted exercises for weak areas
- **Study Plans**: Customized plans with milestones and goals

### 🎨 Modern UI/UX
- **Responsive Design**: Works on all devices
- **Professional Interface**: Clean, intuitive design
- **Smooth Animations**: Polished user experience
- **Accessibility**: Following best practices

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|----------|
| React | 19.2.0 | UI Framework |
| Vite | 7.2.4 | Build Tool & Dev Server |
| React Router | 7.13.0 | Client-side Routing |
| i18next | 25.8.4 | Internationalization |
| Axios | 1.13.4 | HTTP Client |
| Lucide React | 0.563.0 | Icon Library |
| Google Gemini API | Latest | AI Model Provider |
| Vercel | - | Deployment Platform |

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- A Gemini API key (free at [Google AI Studio](https://aistudio.google.com/apikey))
- GitHub account (for deployment)
- Vercel account (free tier available)

### Local Development

```bash
# Clone the repository
git clone https://github.com/your-username/ielts-writing-tool.git

# Navigate to project directory
cd ielts-writing-tool

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🔐 Configuration

### API Key Setup

1. **Get your free API key**:
   - Visit: https://aistudio.google.com/apikey
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the key (starts with `AIza...`)

2. **Configure in app**:
   - Open the application
   - API Key Modal will appear automatically on first visit
   - Paste your API key
   - Select your preferred model
   - Click "Lưu cấu hình" (Save Configuration)

### Model Selection

Choose from three available models:

| Model | Speed | Detail | Best For | Badge |
|-------|-------|--------|----------|-------|
| `gemini-3-flash-preview` | ⚡⚡⚡ | ⭐⭐ | Quick evaluations | **Default** |
| `gemini-3-pro-preview` | ⚡⚡ | ⭐⭐⭐ | Detailed feedback | **Pro** |
| `gemini-2.5-flash` | ⚡⚡ | ⭐⭐ | Balanced approach | **Stable** |

### Storage

- **API Key**: Stored securely in browser's localStorage
- **Model Selection**: Persisted across sessions
- **No Backend**: All data stays in your browser
- **User Control**: You can change settings anytime via Settings button

## 📁 Project Structure

```
ielts-writing-tool/
├── src/
│   ├── components/              # UI Components
│   │   ├── ApiKeyModal/         # API key configuration
│   │   │   ├── ApiKeyModal.jsx
│   │   │   └── ApiKeyModal.css
│   │   ├── ErrorDisplay/        # Error handling UI
│   │   │   ├── ErrorDisplay.jsx
│   │   │   └── ErrorDisplay.css
│   │   ├── EvaluationPanel/     # Essay evaluation display
│   │   ├── FileUploader/        # File upload component
│   │   ├── ProgressChart/       # Progress visualization
│   │   ├── TopicSelector/       # Topic selection
│   │   ├── VocabHelper/         # Vocabulary assistance
│   │   └── WritingEditor/       # Essay editor
│   ├── services/                # Business logic
│   │   ├── apiKeyService.js     # API key management
│   │   ├── geminiService.js     # Gemini AI integration
│   │   └── educationService.js  # Education features
│   ├── utils/                   # Utility functions
│   ├── hooks/                   # Custom React hooks
│   ├── i18n/                    # Internationalization
│   ├── pages/                   # Page components
│   ├── App.jsx                  # Main app component
│   ├── App.css                  # Global styles
│   └── main.jsx                 # Entry point
├── public/                      # Static assets
├── docs/                        # Documentation
│   ├── SETUP_GUIDE.md          # Setup instructions
│   ├── ARCHITECTURE.md         # Technical architecture
│   ├── DEPLOYMENT_CHECKLIST.md # Deployment guide
│   └── DEPLOY_GUIDE_VI.md      # Vietnamese deploy guide
├── index.html                   # HTML template
├── vercel.json                  # Vercel configuration
├── vite.config.js              # Vite configuration
├── package.json                # Dependencies
└── README.md                   # This file
```

## 🎨 Customization

### Prompts & AI Behavior

Customize AI evaluation behavior in `src/services/geminiService.js`:

```javascript
// Modify temperature for creativity
temperature: 0.3  // Lower = more consistent, Higher = more creative

// Adjust max tokens for response length
maxOutputTokens: 2000  // Increase for longer responses
```

### UI Theme & Styling

All styles are in CSS files:
- `src/App.css` - Main application styles
- `src/components/*/*.css` - Component-specific styles

### Models Configuration

Edit model list in `src/services/geminiService.js`:

```javascript
const MODEL_ORDER = [
  'gemini-3-flash-preview',  // Default
  'gemini-3-pro-preview',    // Fallback 1
  'gemini-2.5-flash'         // Fallback 2
];
```

### Education Content

Customize learning paths in `src/services/educationService.js`:
- Modify learning modules
- Add new exercises
- Adjust study plan templates

For detailed customization guide, see: [ARCHITECTURE.md](./ARCHITECTURE.md)

## 🚢 Deployment

### Deploy to Vercel (Recommended)

#### Option 1: Via Vercel Dashboard
1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com) and sign in
3. Click "New Project"
4. Import your GitHub repository
5. Vercel auto-detects Vite configuration
6. Click "Deploy"
7. Wait for deployment (~2 minutes)
8. Get your live URL!

#### Option 2: Via Vercel CLI
```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Vercel Configuration

The `vercel.json` file is already configured for SPA routing:

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

### Post-Deployment

- ✅ HTTPS automatically enabled
- ✅ Global CDN distribution
- ✅ Automatic deployments on git push
- ✅ Zero configuration needed

For detailed deployment guide, see: [DEPLOY_GUIDE_VI.md](./DEPLOY_GUIDE_VI.md)

## 🎓 Education Features

### Learning Paths

```javascript
import { educationService } from './services/educationService'

// Get learning path for your level
const path = educationService.getLearningPath('beginner')
// Returns: modules, topics, focus areas, recommendations
```

### Personalized Tips

```javascript
// Get tips based on essay evaluation
const tips = educationService.getPersonalizedTips(evaluation)
// Returns: category, priority, tips, resources
```

### Study Plans

```javascript
// Generate a study plan
const plan = educationService.getStudyPlan(
  5.5,  // current band score
  7.0,  // target band score
  12    // weeks available
)
// Returns: schedule, milestones, recommendations
```

## 🔐 Security & Privacy

### Data Protection
- ✅ **Client-Side Only**: All processing happens in your browser
- ✅ **No Backend**: Zero server-side data collection
- ✅ **User-Controlled Keys**: You own and manage your API keys
- ✅ **Local Storage**: Keys stored locally, never transmitted to our servers
- ✅ **HTTPS Only**: Secure communication with Google AI API
- ✅ **No Tracking**: We don't collect essays, evaluations, or personal data
- ✅ **Open Source**: Code is transparent and auditable

### API Key Safety
- Store your key securely
- Don't share your key with others
- Monitor usage at [Google AI Studio](https://aistudio.google.com)
- Regenerate key if compromised
- Each user should use their own key

### Privacy Features
- No analytics or tracking scripts
- No cookies except localStorage for settings
- No data sent to third-party services (except Google AI API)
- All user data stays in browser

## 📊 System Architecture

```
┌─────────────────────────────────────────┐
│           User's Browser                 │
│                                          │
│  ┌────────────────────────────────┐    │
│  │     React Application           │    │
│  │                                 │    │
│  │  Components → Services → API    │    │
│  │     ↓            ↓         ↓    │    │
│  │   UI Logic   Business   Gemini  │    │
│  │              Logic      AI API  │    │
│  └────────────────────────────────┘    │
│                                          │
│  localStorage: API Key + Settings       │
└─────────────────────────────────────────┘
              ↓ HTTPS
┌─────────────────────────────────────────┐
│      Google Generative AI API           │
│                                          │
│  Models: gemini-3-flash-preview         │
│          gemini-3-pro-preview           │
│          gemini-2.5-flash               │
└─────────────────────────────────────────┘
```

## 🧪 Testing

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Manual Testing Checklist
- [ ] API Key Modal appears on first visit
- [ ] API key validation works
- [ ] Model selection persists
- [ ] Error handling displays correctly
- [ ] Retry mechanism works
- [ ] Settings can be updated
- [ ] Responsive design works

## 📚 Documentation

- [📖 Setup Guide](./SETUP_GUIDE.md) - Detailed setup instructions
- [🏗️ Architecture](./ARCHITECTURE.md) - Technical architecture details
- [📋 Summary (Vietnamese)](./SUMMARY_VI.md) - Vietnamese documentation
- [✅ Deployment Checklist](./DEPLOYMENT_CHECKLIST.md) - Pre-deployment checks

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Workflow

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) - AI model provider
- [React](https://react.dev/) - UI framework
- [Vite](https://vitejs.dev/) - Build tool
- [Vercel](https://vercel.com/) - Deployment platform

## 📞 Support

- 📧 Email: support@example.com
- 💬 Issues: [GitHub Issues](https://github.com/your-username/ielts-writing-tool/issues)
- 📖 Docs: [Documentation](./SETUP_GUIDE.md)

## 🗺️ Roadmap

### Version 1.1 (Coming Soon)
- [ ] Essay history tracking
- [ ] Progress analytics
- [ ] Vocabulary flashcards
- [ ] Grammar exercises

### Version 2.0 (Future)
- [ ] Real-time collaboration
- [ ] Teacher/Student roles
- [ ] Batch evaluation
- [ ] Mobile app (React Native)

---

**Made with ❤️ for IELTS learners worldwide**

**Last Updated**: February 2026 | **Version**: 1.0.0 | **Status**: ✅ Production Ready
