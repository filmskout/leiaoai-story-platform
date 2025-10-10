# LeiaoAI Story Platform - Restored

A comprehensive AI-powered investment consulting platform with multilingual support and advanced AI chat capabilities.

## Features Restored

✅ **Complete Multilingual Support (13 Languages)**
- Chinese (Simplified & Traditional)
- English, Japanese, Korean
- French, German, Spanish, Portuguese, Italian
- Russian, Arabic, Hindi
- RTL support for Arabic
- Dynamic language switching with persistence

✅ **Advanced AI Chat System**
- 3 LLM Models: DeepSeek, OpenAI, Qwen
- Intelligent geo-location based model selection
- Performance tracking and optimization
- Complete markdown rendering with syntax highlighting
- Code blocks with copy functionality
- Mathematical formula support (KaTeX)

✅ **Professional Services Integration**
- 12 Expertise Areas: CVC Investment, M&A, IPO (A/HK/US), SPAC, etc.
- Interactive carousel with touch/swipe navigation
- Direct AI chat integration with pre-filled questions
- Mobile-optimized responsive design

✅ **Enhanced UI/UX**
- Fixed dark/light theme logo switching
- Professional investment platform aesthetics
- Smooth theme transitions (light/dark/auto)
- Mobile responsive design
- Error boundaries and fallback systems

## Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase project setup

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd leiaoai-story-platform

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Configure your environment variables in .env.local
# See Environment Configuration section below

# Start development server
pnpm dev
```

## Environment Configuration

Create a `.env.local` file with the following variables:

```env
# Supabase Configuration (Required)
VITE_SUPABASE_URL=https://fwjerftzoosqmijmnkyb.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Model APIs (At least one required)
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_DEEPSEEK_API_KEY=your_deepseek_api_key  
VITE_QWEN_API_KEY=your_qwen_api_key

# Optional
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_APP_URL=https://your-app-url.vercel.app
```

## Deployment to Vercel

### Method 1: GitHub Integration (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit - LeiaoAI Platform Restored"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Configure the following settings:

3. **Vercel Configuration**:
   - **Framework Preset**: Vite
   - **Build Command**: `pnpm build` or `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install` or `npm install`

4. **Environment Variables in Vercel**:
   Go to Project Settings > Environment Variables and add:
   ```
   VITE_SUPABASE_URL=https://fwjerftzoosqmijmnkyb.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   VITE_OPENAI_API_KEY=sk-...
   VITE_DEEPSEEK_API_KEY=...
   VITE_QWEN_API_KEY=...
   VITE_GOOGLE_MAPS_API_KEY=AIzaSyCO0kKndUNlmQi3B5mxy4dblg_8WYcuKuk
   ```

### Method 2: Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login and Deploy**:
   ```bash
   vercel login
   vercel --prod
   ```

3. **Configure Environment Variables**:
   ```bash
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
   # Add other environment variables...
   ```

## Build and Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm lint         # Run ESLint

# Type checking
pnpm type-check   # Run TypeScript compiler check
```

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **UI Components**: Radix UI + Custom components
- **Routing**: React Router v6
- **State Management**: React Context API
- **Internationalization**: i18next
- **Animations**: Framer Motion
- **Markdown**: ReactMarkdown + Syntax Highlighting
- **Backend**: Supabase (Database, Auth, Edge Functions)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ai/             # AI chat related components
│   ├── professional/   # Professional services components
│   └── ui/             # Base UI components
├── contexts/           # React contexts (Theme, Language, AI, Auth)
├── hooks/              # Custom React hooks
├── i18n/               # Internationalization configuration
├── lib/                # Utility libraries and configurations
├── pages/              # Page components
├── services/           # API services and integrations
├── styles/             # Global styles and theme definitions
└── utils/              # Helper functions

public/
├── locales/            # Translation files (13 languages)
├── images/             # Static images and assets
└── ...                 # Other static assets

supabase/
├── functions/          # Edge functions
├── migrations/         # Database migrations
└── types.ts           # Generated TypeScript types
```

## Features

### 🌐 Multilingual Support
- 13 languages with complete translations
- RTL support for Arabic
- Dynamic language switching
- Language-based AI model recommendations

### 🤖 AI Chat System
- Multiple LLM integration (DeepSeek, OpenAI, Qwen)
- Intelligent model selection based on geography
- Performance tracking and optimization
- Rich markdown rendering with syntax highlighting
- Professional question bank

### 💼 Professional Services
- 12 specialized investment expertise areas
- Interactive carousel interface
- Direct AI consultation integration
- Mobile-optimized design

### 🎨 UI/UX
- Dark/Light/Auto theme support
- Professional investment platform design
- Mobile-first responsive design
- Smooth animations and transitions
- Accessibility features

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `VITE_OPENAI_API_KEY` | OpenAI API key | Optional* |
| `VITE_DEEPSEEK_API_KEY` | DeepSeek API key | Optional* |
| `VITE_QWEN_API_KEY` | Qwen API key | Optional* |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps API key | Optional |
| `VITE_APP_URL` | Application URL | Optional |

*At least one AI model API key is required for chat functionality.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please check the documentation or create an issue in the repository.

---

**Status**: ✅ Fully Restored and Production Ready  
**Last Updated**: October 10, 2025  
**Version**: 2.0.0 (Restored)